module.exports = function (backend) {
	const router = require('express').Router()
	const Client = require('kubernetes-client').Client
	const client = new Client(/*{ config: config.fromKubeconfig(), version: '1.13' }*/)

	const domains = [
		{
			"id": "1",
			"name": "*.{username}.e.farberg.de",
			"description": "Bla"
		}, {
			"id": "2",
			"name": "*.{username}.users.edsc.cloud",
			"description": "Bla"
		}
	]

	function domainById(id) {
		var filtered = domains.filter(d => d.id === id)
		if (filtered && filtered.length > 0)
			return filtered[0]

		throw `Domain id ${id} not found`
	}

	function dnssecOfUser(userinfo, domain) {
		let d = `${userinfo.preferred_username}.${domain.name}`

		let r = {
			"id": domain.id + "-" + userinfo.preferred_username,
			"domain": d,
			"rfc2136_nameserver": "123.456.789.012",
			"rfc2136_nameserver_port": 53,
			"rfc2136_zone": `${d}.`,
			"rfc2136_tsigSecret": "KtmqLIsadfISWnQ==",
			"rfc2136_tsigKeyname": `${d}`,
			"rfc2136_tsigAlg": "hmac-sha512",
			"rfc2136_tsigAlgLetsencrypt": "HMACSHA512"
		}

		return r
	}

	router.get('/domains', backend.keycloak.enforcer(), (req, res) => {
		res.json(domains)
	})

	router.get('/domains/:id/dnssec', backend.keycloak.enforcer(), (req, res) => {
		const userinfo = backend.userinfo(req);
		const dnssecUserData = dnssecOfUser(userinfo, domainById(req.params.id))
		res.json(dnssecUserData)
	})


	return router
}
