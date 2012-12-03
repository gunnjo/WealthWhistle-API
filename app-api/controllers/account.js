var Account = require('../models/account.js');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var crypto = require('crypto');

exports.post = function(req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, config.app.salt);
	var activationKey = crypto.randomBytes(32).toString('hex');
	console.log(activationKey);

	var accountData = {};
	var data = req.body;

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