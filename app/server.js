const path = require('path')
const express = require('express')
const session = require('express-session')
const { addAsync } = require('@awaitjs/express');
const Keycloak = require('keycloak-connect')
const cors = require('cors')
const log4js = require('log4js')
const { program: optionparser } = require('commander')

// ------------------------------------------------
// Parse command line options
// ------------------------------------------------

let options = optionparser
	.storeOptionsAsProperties(true)
	.option('--session-store <name>', "Session store to use (valid values: inmemory)", "inmemory")
	.option('--keycloak-config <file>', "Keycloak config file to use", "config/keycloak-dennis-dev.json")
	.option('--port <port>', 'Web server port', 8080)
	.option('--policy-file <file>', 'The policy to load', 'edsc-policy')
	.option('--namespace <ns>', 'Kubernetes namespace', 'default')
	.option('--mode <mode>', 'The mode to start the app in (development or production)', 'production')
	//DnsSecZones
	.option('--crd-group <group>', 'CRD group name', 'dnsseczone.farberg.de')
	.option('--crd-version <version>', 'CRD version', 'v1')
	.option('--crd-plural <plural>', 'CRD Plural', 'dnsseczones')
	//MicroK8s
	.option('--microk8s-crd-group <group>', 'Microk8s CRD group name', 'mk8.farberg.de')
	.option('--microk8s-crd-version <version>', 'Microk8s CRD version', 'v1')
	.option('--microk8s-crd-plural <plural>', 'Microk8s CRD Plural', 'microkeights')
	.option('--microk8s-crd-kind <plural>', 'Microk8s CRD Kind', 'MicrokEight')
	//Others
	.option('-v, --verbose', "Display verbose output", false)
	.version('0.0.3')
	.addHelpCommand()
	.parse()
	.opts()

const devMode = options.mode === "development"

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
// Create policy
// ------------------------------------------------

const Policy = require("./policies/" + options.policyFile)
const policy = new Policy(options)
log.debug(`Loaded policy from ${options.policyFile}: `, policy)

// ------------------------------------------------
// Create options to be used for the app
// ------------------------------------------------

options = Object.assign({}, options, {
	logger: getLogger,
	keycloak,
	userinfo(req) {
		return req.kauth.grant.id_token.content;
	},
	policy
})


// ------------------------------------------------
// Setup express
// ------------------------------------------------

const app = addAsync(express());

app.use(express.json());
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
		server: false,
		logLevel: "info",
		files: ["dist/frontend/*", "dist/backend/*"]
	});

	app.use(require('connect-browser-sync')(bs));
}

// ------------------------------------------------
// Setup routes
// ------------------------------------------------

log.debug(`Using path ${path.join(__dirname, '../dist/frontend')} to serve /`)

app.use('/', keycloak.protect(), express.static(path.join(__dirname, '../dist/frontend')))
app.use('/api/v1/auth', require('./apps/auth')(keycloak))
app.use('/api/v1/dns', require('./apps/dns')(options))
//app.use('/api/v1/microk8s', require('./apps/microk8s')(options))

// Custom 404 handler
//app.use('*', function (req, res) { log.warn("Unknown URL requested: ", req.url, req.headers); res.status(404).send('Not found'); });

// Start server
app.listen(options.port, () => {
	log.debug(`Started on port ${options.port}, access e.g., via http://localhost:${options.port}`);
});
