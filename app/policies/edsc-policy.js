class EdscPolicy {
	constructor(options) {
		this.log = options.logger ? options.logger("CrAccess") : console
		this.valid_subdomain_regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/
	}

	availableDomains(userinfo) {
		const username = userinfo.preferred_username
		const suffix1 = ".user.cloud.dhbw-mannheim.de"
		const domains = [username + suffix1]

		if (!username.match(this.valid_subdomain_regex)) {
			this.log.error("Username ", username, " does not match the valid pattern", this.valid_subdomain_regex)
			return {
				error: `preferred_username ('${username}') does not match the valid pattern, please contact the site operators`
			}
		}

		this.log.debug("EdscPolicy:availableDomains: userinfo=", userinfo, ", domains=", domains);
		return { domains }
	}

}

module.exports = EdscPolicy