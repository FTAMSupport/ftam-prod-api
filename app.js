var http = require('http'),
path = require('path'),
methods = require('methods'),
express = require('express'),
bodyParser = require('body-parser'),
session = require('express-session'),
cors = require('cors'),
passport = require('passport'),
errorhandler = require('errorhandler'),
mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';
var secret = require('./config').secret;

// Create global app object
var app = express();
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

// Session management
var RedisStore = require("connect-redis")(session);
console.log(process.env.SECRET);
app.use(session({ store: new RedisStore(), secret: secret, saveUninitialized: false, resave: false }));

if (!isProduction) {
app.use(errorhandler());
}

if(isProduction){
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function(test) {
	require('./authorization').init();
});
mongoose.connection.on('error', function() {
	console.log('There is an issue with your MongoDB connection.  Please make sure MongoDB is running.');
	process.exit(1);
});
} else {
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect("mongodb://grabbymongo4:MJfYjccuqANEpyTmawbqPqvO4jdJI7sqJjgt9F4FogUiuQscqPQH37VPzxyW17O5psT7fDCEu7lHCrq410DBAg==@grabbymongo4.documents.azure.com:10255/?ssl=true&replicaSet=globaldb");
mongoose.connection.on('connected', function(test) {
	require('./authorization').init();
});
mongoose.connection.on('error', function() {
	console.log('There is an issue with your MongoDB connection.  Please make sure MongoDB is running.');
	process.exit(1);
});
mongoose.set('debug', true);
}

require('./models/User');
require('./models/Restaurant');
require('./models/Foodtruck');
require('./models/Menu');
require('./models/Order');
require('./config/passport');
app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
app.use(function(err, req, res, next) {
console.log(err.stack);
res.status(err.status || 500);
res.json({'errors': {
  message: err.message,
  error: err
}});
});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.json({'errors': {
message: err.message,
error: {}
}});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3001, function(){
console.log('Listening on port ' + server.address().port);
});
