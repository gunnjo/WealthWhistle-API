var Account = require('../models/account.js');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var crypto = require('crypto');

//TODO: better input validation
exports.post = function(req, res) {
	var accountData = {};
	var data = req.body;

	var hashedPassword = bcrypt.hashSync(data.password, config.app.salt);
	var activationKey = crypto.randomBytes(32).toString('hex');

	if (data.birthDate != undefined) { accountData.birthDate = data.birthDate; }
	if (data.email != undefined) { accountData.email = data.email; }
	if (data.gender != undefined) { accountData.gender = data.gender; }
	if (data.zip != undefined) { accountData.zip = data.zip; }
	accountData.username = data.username;
	accountData.password = hashedPassword;
	accountData.activationKey = activationKey;
	accountData.email = data.email;
	accountData.firstName = data.firstName;
	accountData.lastName = data.lastName;

	new Account(accountData).save(function(err, account) {
		if(err) {
			console.log(err);
			res.send(409);
			return;
		}
		//TODO: send email with an activation key
		res.send(201, 'id: ' + account.id + ' username: ' + accountData.username);
	});
}

exports.put = function(req, res) {
	var accountData = {};
	var conditions = {};
	var data = req.body;

	if(data.password != undefined) {
		var hashedPassword = bcrypt.hashSync(data.password, config.app.salt);
		accountData.password = hashedPassword;
	}

	if (data.email != undefined) { accountData.email = data.email; }
	if (data.zip != undefined) { accountData.zip = data.zip; }

	conditions.username = req.params.username;

	Account.update(conditions, accountData, function(err, numberAffected, rawResponse) {
		if(err) {
			console.log(err);
			res.send(400);
			return;
		}
		if(numberAffected === 0) {
			console.log('did not update any rows for username ' + req.params.username);
			res.send(400);
			return;
		}
		res.send(200);
	})
}