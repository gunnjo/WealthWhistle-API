var account = require('../models/account.js');
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
	if (data.gender != undefined && data.zip.gender.length == 1) {
		accountData.gender = data.gender;
	}
	var validZip = data.zip != undefined && data.zip.length == 5 && data.zip.match('/^[0-9]{5}$/');
	if (validZip) { accountData.zip = data.zip; }
	accountData.username = data.username;
	accountData.password = hashedPassword;
	accountData.activationKey = activationKey;
	accountData.email = data.email;
	accountData.firstName = data.firstName;
	accountData.lastName = data.lastName;

	account.insertAccount(accountData, res);
}

exports.put = function(req, res) {
	var accountData = {};
	var conditions = {};
	var data = req.body;

	if (data.password != undefined) {
		var hashedPassword = bcrypt.hashSync(data.password, config.app.salt);
		accountData.password = hashedPassword;
	}

	if (data.email != undefined) { accountData.email = data.email; }
	var validZip = data.zip != undefined && data.zip.length == 5 && data.zip.match('/^[0-9]{5}$/');
	if (validZip) { accountData.zip = data.zip; }

	conditions.username = req.params.username;

	account.updateAccount(accountData, res);
}