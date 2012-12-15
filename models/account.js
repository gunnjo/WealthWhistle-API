/*Contains models for accounts. Currently, only insertion and modification are defined.
 * Each new model should define an action to carry out the task on the schema (e.g.
 * insert an account) and then verify the user through the verifyUser function, with
 * the exception of account insertion, for obvious reasons.
 */

var bcrypt = require('bcrypt');
var config = require('../config.js');
var constants = require('../constants.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	activationKey: {type: String, required: true},
	apiKey: {type: String, required: true},
	birthDate: {type: Date, required: false},
	creationDate: {type: Date, default: Date.now()},
	email: {type: String, required: true},
	firstName: {type: String, required: true},
	gender: {type: String, required: false},
	lastName: {type: String, required: true},
	password: {type: String, required: true},
	username: {type: String, index: {unique: true}, required: true},
	zip: {type: String, required: false}
});

AccountModel = mongoose.model('account', accountSchema);
exports.AccountModel = AccountModel;

/**
 * Gets an account
 *
 * @param accountData - An array containing all fields to be added to the database.
 * @param response - An express response object
 */
exports.getAccount = function(accountData, response) {
	AccountModel.findOne({username: accountData.username}, function(error, account) {
		if(error || account === null) {
			console.log(error);
			response.send(constants.HTTP_BADREQUEST);
			return;
		}
		var correctPassword = bcrypt.compareSync(accountData.password, account.password);
		if(correctPassword) {
			response.send(constants.HTTP_OK, account);
		}
		else {
			response.send(constants.HTTP_UNAUTHORIZED);
		}
	});
};

/**
 * Creates an account.
 *
 * @param accountData - An array containing all fields to be added to the database.
 * @param response - An express response object
 */
exports.insertAccount = function(accountData, response) {
	new this.AccountModel(accountData).save(function(err, newAccount) {
		if (err) {
			console.log(err);
			response.send(constants.HTTP_CONFLICT);
			return;
		}
		//TODO: send email with an activation key
		response.send(constants.HTTP_CREATED, newAccount);
	});
};

/**
 * Modifies an account.
 *
 * @param apiKey - The api key to be used for authentication
 * @param accountData - An array containing all fields to be modified on the database.
 * @param response - An express response object
 */
exports.updateAccount = function(apiKey, accountData, response) {
	var updateAccount = function() {
		AccountModel.findByIdAndUpdate(accountData.userId, accountData,
				function(err, numberAffected) {
					if (err) {
						console.log(err);
						response.send(constants.HTTP_BADREQUEST);
						return;
					}
					if (numberAffected === 0) {
						console.log('did not update any rows for userId ' + accountData.userId);
						response.send(constants.HTTP_BADREQUEST);
						return;
					}
					response.send(constants.HTTP_OK);
				})
	}
	this.verifyUser(updateAccount, apiKey, response, accountData.userId);
}

/**
 * Authenticates a user based on a provided API key. On successful authentication,
 * calls callback function 'action'.
 *
 * @param action - A function to be called if the user is verified
 * @param apiKey - A string representing a user's API key.
 * @param response - An express response object
 * @param userId - A string holding the user id of the user that is authenticating.
 */
exports.verifyUser = function(action, apiKey, response, userId) {
	this.AccountModel.findById(userId, 'apiKey', function(err, account) {
		if(err) {
			console.log('error verifying user - ' + userId);
			response.send(constants.HTTP_BADREQUEST);
			return;
		}
		if(account.apiKey != apiKey) {
			console.log('incorrect api key - ' + userId);
			response.send(constants.HTTP_UNAUTHORIZED);
			return;
		}
		action();
	});
}
