EnvironmentEnum = {
	DEV : 'development',
	PROD : 'production'
};

var environment = EnvironmentEnum.DEV;

var prod = {};
var dev = {};

prod.app = {};
prod.mongo = {};

dev.app = {};
dev.mongo = {};

prod.app.salt = '';
prod.app.port = 3000;

prod.mongo.dbName = '';
prod.mongo.host = '';
prod.mongo.password = '';
prod.mongo.port = 27017;
prod.mongo.username = '';

dev.app.salt = '$2a$10$1U2/vEd4w52SOpHVccfKq.';
dev.app.port = 3000;

dev.mongo.dbName = 'WealthWhistle-test';
dev.mongo.host = 'localhost';
dev.mongo.password = '';
dev.mongo.port = 27017;
dev.mongo.username = '';

var config = {};

config.mongo = (environment == EnvironmentEnum.DEV) ? dev.mongo : prod.mongo;
config.app = (environment == EnvironmentEnum.DEV) ? dev.app : prod.app;

config.mongo.getConnectString = function() {
	var connectString = 'mongodb://';
	if(config.mongo.username != '' && config.mongo.password == '') {
		connectString += config.mongo.username + '@';
	} else if(config.mongo.username != '' && config.mongo.password != '') {
		connectString += config.mongo.username + ':' + config.mongo.password + '@';
	} else {
		//if both username and password are undefined, do nothing
	}
	connectString += config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName;
	return connectString;
}

module.exports = config;