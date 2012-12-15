/*Contains controllers that are related to accounts. Currently, only creation
* and edits are defined.
*
* All controllers should take relevant fields out of the request object and
* pass the response object and an array of fields to be inserted into the database
* to the appropriate model.
*/
var account = require('../models/account.js');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var crypto = require('crypto');

/**
 * Handles a request to get an account.
 *
 * @param request - An express request object.
 * @param response - An express response object
 */

exports.get = function(request, response) {
	var accountData = {};
	var data = request.body;

	accountData.username = request.params.username;
	accountData.password = data.password;

	account.getAccount(accountData, response);
}

/**
 * Handles a request to create  an account.
 *
 * @param request - An express request object.
 * @param response - An express response object
 */
exports.post = function(request, response) {
	//TODO: better input validation
	var accountData = {};
	var data = request.body;

	var hashedPassword = bcrypt.hashSync(data.password, config.app.salt);
	var activationKey = crypto.randomBytes(32).toString('hex');
	var apiKey = crypto.randomBytes(32).toString('hex');

	if (data.birthDate != undefined) { accountData.birthDate = data.birthDate; }
	if (data.email != undefined) { accountData.email = data.email; }
	if (data.gender != undefined && data.gender.length == 1) {
		accountData.gender = data.gender;
	}
	var validZip = (data.zip != undefined) && (data.zip.length == 5)
			&& (data.zip.match(/^[0-9]{5}$/) != null);
	if (validZip) { accountData.zip = data.zip; }
	accountData.username = data.username;
	accountData.password = hashedPassword;
	accountData.activationKey = activationKey;
	accountData.email = data.email;
	accountData.firstName = data.firstName;
	accountData.lastName = data.lastName;
	accountData.apiKey = apiKey;
	account.insertAccount(accountData, response);
}

/**
 * Handles a request to edit an account.
 *
 * @param request - An express request object.
 * @param response - An express response object
 */
exports.put = function(request, response) {
	var accountData = {};
	var data = request.body;

	if (data.password != undefined) {
		var hashedPassword = bcrypt.hashSync(data.password, config.app.salt);
		accountData.password = hashedPassword;
	}
	if (data.email != undefined) { accountData.email = data.email; }

	var validZip = (data.zip != undefined) && (data.zip.length == 5)
			&& (data.zip.match(/^[0-9]{5}$/) != null);
	if (validZip) { accountData.zip = data.zip; }

	accountData.userId = request.params.userId;
	var apiKey = data.apiKey;

	account.updateAccount(apiKey, accountData, response);
}