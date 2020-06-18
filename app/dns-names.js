const { addAsync } = require('@awaitjs/express');
const router = addAsync(require('express').Router())
const CustomResourceAccess = require('./custom-resource-access')

module.exports = function (options) {
	const crs = new CustomResourceAccess(options)
	const log = options.logger("dns-names")
	const policy = options.policy

	function crToJson(cr) {
		return {
			"spec": cr.spec,
			"status": cr.status
		}
	}

	async function crsOfUser(userinfo) {
		return (await crs.listItems())
			.filter(cr =>
				cr.spec.associatedPrincipals.includes(userinfo.sub))
	}

	async function crOfUserById(id, userinfo) {
		const result = (await crsOfUser(userinfo))
			.filter(cr => cr.spec.domainName === id)

		if (result && result.length > 0)
			return result[0]

		return null
	}

	async function domainById(id, userinfo) {
		log.debug(`domainIdsOfUser: Searching id ${id} of user`, userinfo.sub)

		const result = await crOfUserById(id, userinfo)
		if (result)
			return crToJson(result)

		throw `Domain id ${id} not found`
	}

	async function domainIdsOfUser(userinfo) {
		return (await crsOfUser(userinfo))
			.map(cr => cr.spec.domainName)
	}

	async function deleteDomain(id, userinfo) {
		const domain = await crOfUserById(id, userinfo)
		return await crs.deleteItem(domain.metadata.name)
	}

	async function getAvailableDomains(userinfo) {
		const policyResult = policy.availableDomains(userinfo)
		const policyAvailableDomains = policyResult.domains

		if (policyResult.error)
			return { error: policyResult.error }

		const existingDomains = await domainIdsOfUser(userinfo)
		const available = policyAvailableDomains.filter(name => !existingDomains.includes(name))

		return { available }
	}

	async function createDomain(id, userinfo, jsonData) {
		let adminContact = userinfo.email.replace("@", ".")

		let cr = {
			"apiVersion": "dnsseczone.farberg.de/v1",
			"kind": "DnssecZone",
			"metadata": {
				"name": id
			},
			"spec": {
				"domainName": id,
				"adminContact": adminContact,
				"expireSeconds": parseInt(jsonData.expireSeconds) || 60,
				"minimumSeconds": parseInt(jsonData.minimumSeconds) || 60,
				"refreshSeconds": parseInt(jsonData.refreshSeconds) || 60,
				"retrySeconds": parseInt(jsonData.retrySeconds) || 60,
				"ttlSeconds": parseInt(jsonData.ttlSeconds) || 60,
				"associatedPrincipals": [userinfo.sub]
			}
		}
		log.debug("Creating domain cr: ", cr)
		return await crs.createItem(cr)
	}

	router.getAsync('/domains/available', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const result = await getAvailableDomains(userinfo)

		if (!result.error) {
			res.json(result.available)
		} else {
			log.error(`Error while getting available domains from policy:`, policy.error)
			res.status(501 /* not implemented */).json({ error: policyResult.error })
		}

	})

	router.postAsync('/domains/list', options.keycloak.enforcer(), async (req, res) => {
		try {
			const userinfo = options.userinfo(req);

			if (!userinfo.email_verified || !userinfo.email) {
				res.status(403 /*Forbidden*/).send("Not allowed: the email address of your account has not been verified.")
				return
			}

			const values = req.body
			const policyResult = await getAvailableDomains(userinfo)

			if (policyResult.error || !policyResult.available.includes(values.domainName)) {
				res.status(403 /*Forbidden*/).send("Not allowed: policy error")
			}

			await createDomain(values.domainName, userinfo, values)
			res.json({ "done": true })
		} catch (e) {
			log.error("Unable to create domain: ", e)
			res.status(500 /*Internal server error*/).send("")
		}
	})

	router.getAsync('/domains/list', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const domainIds = await domainIdsOfUser(userinfo)
		//log.debug(`Domain ids of user ${userinfo.sub}`, domainIds)
		res.json(domainIds)
	})

	router.getAsync('/domains/domain/:id', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const id = req.params.id
		const dnssecUserData = await domainById(id, userinfo)
		//log.debug(`Domain id ${id} of user ${userinfo.sub} = `, dnssecUserData)
		res.json(dnssecUserData)
	})

	router.deleteAsync('/domains/domain/:id', options.keycloak.enforcer(), async (req, res) => {
		try {
			const id = req.params.id
			const userinfo = options.userinfo(req);
			const result = await deleteDomain(id, userinfo)
			res.json({ ok: true })

		} catch (e) {
			log.error(`Unable to delete domain ${req.params.id}: `, e)
			res.status(401 /* not found */).send("Unable to delete domain")
		}
	})

	return router
}
