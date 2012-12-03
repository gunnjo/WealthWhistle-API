var config = {}

config.mongo = {}
config.app = {}

config.app.salt = '';
config.app.port = 3000;

config.mongo.dbName = '';
config.mongo.host = '';
config.mongo.password = '';
config.mongo.port = 27017;
config.mongo.username = '';

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