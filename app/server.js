const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const Keycloak = require('keycloak-connect')
const cors = require('cors')

const memoryStore = new session.MemoryStore();
const keyCloakConfig = require('../config/keycloak-dennis-dev.json')
//const keyCloakConfig = require('../config/keycloak-dhbw-dev.json')
//const keyCloakConfig = require('../config/keycloak-dhbw-prod.json')
const keycloak = new Keycloak({ store: memoryStore }, keyCloakConfig);

// Create express app
const app = express();
const devMode = app.get('env') === 'development';
const port = 8080

app.use(bodyParser.json());
app.use(cors());

app.use(session({
	secret: 'wqersfasdfasflkasdfasdflkj',
	resave: false,
	saveUninitialized: true,
	store: memoryStore
}));

app.use(keycloak.middleware({}));

// Setup dev mode
if (devMode) {
	// Install browsersync in development
	console.log("Using browser-sync")
	var browserSync = require('browser-sync');
	var bs = browserSync.create().init({
		logSnippet: false,
		files: ["dist/*"]
	});
	app.use(require('connect-browser-sync')(bs));

	// Use Mock-Instance of the database
} else {

}

const backend = {
	keycloak,
	userinfo(req) {
		return req.kauth.grant.id_token.content;
	}
}


// Install keycloak on
app.use('/', keycloak.protect(), express.static(path.join(__dirname, '../dist/frontend')))
console.log(`Using path ${path.join(__dirname, '../dist/frontend')} to serve /`)

app.use('/api/v1/auth', require('./auth')(keycloak))
app.use('/api/v1/dns', require('./dns-names')(backend))

// Custom 404 handler
app.use('*', function (req, res) { res.status(404).send('Not found'); });

// Start server
app.listen(port, function () {
	console.log(`Started on port ${port}`);
});
