module.exports = function (keycloak) {
	var router = require('express').Router()

	router.get('/token', keycloak.enforcer(), (req, res) => {
		res.type('text/plain').send(req.kauth.grant.access_token.token).end()
	})

	router.get('/me', keycloak.enforcer(null, { response_mode: 'token' }), function (req, res) {
		function safeStringify(obj, indent = 2) {
			let cache = [];
			const retVal = JSON.stringify(
				obj,
				(key, value) =>
					typeof value === "object" && value !== null
						? cache.includes(value)
							? undefined // Duplicate reference found, discard key
							: cache.push(value) && value // Store value in our collection
						: value,
				indent
			);
			cache = null;
			return retVal;
		};

		res.send(`
		<h1>Access Token</h1>
		<pre>${req.kauth.grant.access_token.token}</pre>
		<h1>ID Token</h1>
		<hr/>
		<pre>${safeStringify(req.kauth.grant.id_token.content)}</pre>
		<hr/>
		<h1>Request</h1>
		<pre>${safeStringify(req)}</pre>
	`)
	}
	);

	return router
}

