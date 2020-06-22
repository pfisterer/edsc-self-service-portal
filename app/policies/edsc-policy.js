class EdscPolicy {
	constructor(options) {
		this.valid_subdomain_regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/
	}

	availableDomains(userinfo) {
		const username = userinfo.preferred_username
		const suffix = ".user.edsc.cloud"

		if (!username.match(this.valid_subdomain_regex)) {
			return {
				error: `preferred_username ('${username}') does not match the valid pattern, please contact the site operators`
			}
		}

		return {
			domains: [username + suffix]
		}

	}

}

module.exports = EdscPolicy