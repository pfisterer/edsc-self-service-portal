const path = require('path')
const express = require('express')
const session = require('express-session')
const { addAsync } = require('@awaitjs/express');
const bodyParser = require('body-parser')
const Keycloak = require('keycloak-connect')
const cors = require('cors')
const log4js = require('log4js')
const { program: optionparser } = require('commander')

// ------------------------------------------------
// Parse command line options
// ------------------------------------------------

let options = optionparser
	.storeOptionsAsProperties(true)
	.option('-v, --verbose', "Display verbose output", false)
	.option('--session-store <name>', "Session store to use (valid values: inmemory)", "inmemory")
	.option('--keycloak-config <file>', "Keycloak config file to use", "config/keycloak-dennis-dev.json")
	.option('--crd-group <group>', 'CRD group name', 'dnsseczone.farberg.de')
	.option('--crd-version <version>', 'CRD version', 'v1')
	.option('--crd-plural <plural>', 'CRD Plural', 'dnsseczones')
	.option('--namespace <ns>', 'Kubernetes namespace', 'default')
	.version('0.0.1')
	.addHelpCommand()
	.parse()
	.opts()

// ------------------------------------------------
// Set global log level options
// ------------------------------------------------

let logLevel = options.verbose ? "debug" : "info";

function getLogger(name) {
	let log = log4js.getLogger(name);
	log.level = logLevel;
	return log
}

const log = getLogger("main")


// ------------------------------------------------
// Setup express + keycloak
// ------------------------------------------------

let sessionStore;
if (options.sessionStore == "inmemory")
	sessionStore = new session.MemoryStore();
else
	throw `No session store of type '${options.sessionStore}' found`;

const keycloak = new Keycloak({ store: sessionStore }, options.keycloakConfig);

// ------------------------------------------------
// Create options to be used for the app
// ------------------------------------------------

options = Object.assign({}, options, {
	keycloak,
	userinfo(req) {
		return req.kauth.grant.id_token.content;
	},
	logger: getLogger
})

// ------------------------------------------------
// Setup express
// ------------------------------------------------


// Create express app
const app = addAsync(express());
const devMode = app.get('env') === 'development';
const port = 8080

app.use(bodyParser.json());
app.use(cors());

app.use(session({
	secret: 'wqersfasdfasflkasdfasdflkj',
	resave: false,
	saveUninitialized: true,
	store: sessionStore
}));

app.use(keycloak.middleware({}));


// ------------------------------------------------
// Setup browsersync in dev mode
// ------------------------------------------------

if (devMode) {
	// Install browsersync in development
	log.info("DevMode active: using browser-sync")

	var browserSync = require('browser-sync');

	var bs = browserSync.create().init({
		logSnippet: false,
		files: ["dist/*"]
	});

	app.use(require('connect-browser-sync')(bs));
}

// ------------------------------------------------
// Setup routes
// ------------------------------------------------

console.log(`Using path ${path.join(__dirname, '../dist/frontend')} to serve /`)
app.use('/', keycloak.protect(), express.static(path.join(__dirname, '../dist/frontend')))

app.use('/api/v1/auth', require('./auth')(keycloak))
app.use('/api/v1/dns', require('./dns-names')(options))

// Custom 404 handler
app.use('*', function (req, res) { res.status(404).send('Not found'); });

// Start server
app.listen(port, function () {
	log.debug(`Started on port ${port}, access e.g., via http://localhost:${port}`);
});
