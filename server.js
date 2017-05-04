// server.js
// IMPORTING THE NECESSARY PACKAGES ------------
const express    = require('express');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const path       = require('path');
const passport   = require('passport');

const app        = express();
const configDB   = require('./config/config.js');
const port       = process.env.PORT || 8080;
const server     = require('http').createServer(app);

// CONFIGURATION --------------------------------
mongoose.connect(configDB.URL);			// Configuration of database

require('./config/passport')(passport); // Configuration of passport

app.set('superSecret', 'ilovewhiskey')
// Configure the express application
app.use('/public', express.static(path.resolve(path.join(__dirname, '/public'))));	// FOR ACCESSING PUBLIC RESOURCES
app.use(morgan('dev'));									// logging the request
app.use(bodyParser.json());								// recieving the information via json
app.use(bodyParser.urlencoded({ extended: true }));		// recieving the information from forms

// ROUTES ----------------------------------------

require('./app/routes.js')(app, passport);

// LAUNCH -----------------------------------------

server.listen(port, function() {
	console.log(`MAGIC HAPPENS ON PORT ${port}`);
});

// WEBSOCKETS -------------------------------------
require('./socket/websocket.js')(server, app);

