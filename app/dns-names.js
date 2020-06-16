const { addAsync } = require('@awaitjs/express');
const router = addAsync(require('express').Router())
const CustomResourceAccess = require('./custom-resource-access')

module.exports = function (options) {
	const crs = new CustomResourceAccess(options)
	const log = options.logger("dns")

	function crToJson(cr) {
		return {
			"spec": cr.spec,
			"status": cr.status
		}
	}

	async function crsOfUser(userinfo) {
		return (await crs.listItems())
			.filter(cr => cr.spec.associatedPrincipals.includes(userinfo.preferred_username))
	}

	async function domainById(id, userinfo) {
		log.debug(`domainIdsOfUser: Searching id ${id} of user`, userinfo.preferred_username)
		const result = (await crsOfUser(userinfo))
			.filter(cr => cr.spec.domainName === id)

		if (result && result.length > 0)
			return crToJson(result[0])

		throw `Domain id ${id} not found`
	}

	async function domainIdsOfUser(userinfo) {
		return (await crsOfUser(userinfo))
			.map(cr => cr.spec.domainName)
	}

	router.getAsync('/domains', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const domainIds = await domainIdsOfUser(userinfo)
		log.debug(`Domain ids of user ${userinfo.preferred_username}`, domainIds)
		res.json(domainIds)
	})

	router.getAsync('/domains/:id', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const id = req.params.id
		const dnssecUserData = await domainById(id, userinfo)
		log.debug(`Domain id ${id} of user ${userinfo.preferred_username} = `, dnssecUserData)
		res.json(dnssecUserData)
	})


	return router
}
