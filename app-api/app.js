var config = require('./config');
var api = require('./api.js');

var express = require('express');
var mongoose = require('mongoose');
var app = express();

mongoose.connect(config.mongo.getConnectString());

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.post('/users', api.account.post);
app.put('/users/:username', api.account.put);

app.listen(config.app.port);
console.log("application listening on port: " + config.app.port);