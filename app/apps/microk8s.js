const { addAsync } = require('@awaitjs/express');
const router = addAsync(require('express').Router())
const CustomResourceAccess = require('../custom-resource-access')
const validation = require('../util/validation-helper')

module.exports = function (options) {
	let whiteListedFields = {
		"openstack_username": [validation.isSingleLineString],
		"openstack_auth_url": [validation.isUrl],
		"openstack_password": [validation.isSingleLineString],
		"openstack_domain_name": [validation.isSingleLineString],
		"openstack_project": [validation.isSingleLineString],
		"openstack_user_domain_name": [validation.isSingleLineString],
		"image": [validation.isSingleLineString],
		"flavor": [validation.isSingleLineString],
		"security_group": [validation.isSingleLineString],
		"key_name": [validation.isSingleLineString],
		"external_network_name": [validation.isSingleLineString],
		"floating_ip_pool": [validation.isSingleLineString],
		"dns_server1": [validation.isSingleLineString],
		"dns_server2": [validation.isSingleLineString],
		"microk8s_version": [validation.isSingleLineString],
		"enable_nginx": [validation.isBoolean],
	}

	const crs = new CustomResourceAccess(options.microk8sCrdGroup, options.microk8sCrdVersion, options.microk8sCrdPlural, options)
	const log = options.logger("microk8s")

	async function getCrs(userinfo) {
		try {
			const res = await crs.listItems()
			return (await res)
				.filter(cr => cr.spec.associatedPrincipals.includes(userinfo.sub))

		} catch (bla) {
			console.error("bla", bla)
		}

	}

	async function getCrById(userinfo, id) {
		return (await getCrs(userinfo))
			.filter(cr => cr.metadata.name === id)[0]
	}

	async function deleteCr(id, userinfo) {
		const cr = await getCrById(userinfo, id)
		if (cr) {
			log.info(`Deleting custom resource ${id}`)
			return await crs.deleteItem(cr.metadata.name)
		}

		throw `deleteCr: No custom resource found with id ${id} found for user ${userinfo.sub}`
	}

	async function createCr(id, userinfo, jsonData) {
		let spec = validation.validate(jsonData, whiteListedFields)
		spec.associatedPrincipals = [userinfo.sub]

		let cr = {
			"apiVersion": `${options.microk8sCrdGroup}/${options.microk8sCrdVersion}`,
			"kind": options.microk8sCrdKind,
			"metadata": {
				"name": id
			},
			"spec": spec
		}
		log.debug("Creating cr: ", cr)
		return await crs.createItem(cr)
	}

	router.getAsync('/', options.keycloak.enforcer(), async (req, res) => {
		const userinfo = options.userinfo(req);
		const crs = await getCrs(userinfo)
		log.debug(`getAsync: got ${crs?.length} crs user ${userinfo.sub}`)
		res.json(crs)
	})

	router.postAsync('/', options.keycloak.enforcer(), async (req, res) => {
		log.info("Request", req)
		try {
			const userinfo = options.userinfo(req);
			if (!userinfo.email_verified || !userinfo.email) {
				res.status(403 /*Forbidden*/).send("Not allowed: the email address of your account has not been verified.")
				return
			}

			const id = `microk8s-${userinfo.sub}-${req.body.instance_name}`.toLowerCase()
			await createCr(id, userinfo, req.body)

			res.json({ "done": true })
		} catch (e) {
			log.error("Unable to create custom resource: ", e)
			res.status(500 /*Internal server error*/).send(e)
		}
	})

	router.deleteAsync('/:id', options.keycloak.enforcer(), async (req, res) => {
		try {
			const id = req.params.id
			const userinfo = options.userinfo(req);
			const result = await deleteCr(id, userinfo)
			res.json({ ok: true })

		} catch (e) {
			log.error(`Unable to delete domain ${req.params.id}: `, e)
			res.status(401 /* not found */).send("Unable to delete domain")
		}
	})

	return router
}