var accounts = require('./controllers/account.js');
var buckets = require('./controllers/buckets.js');

var config = require('./config');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(config.mongo.getConnectString());

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.post('/users', accounts.post);
app.put('/users/:username', accounts.put);
app.post('/buckets', buckets.post);

app.listen(config.app.port);
console.log("application listening on port: " + config.app.port);