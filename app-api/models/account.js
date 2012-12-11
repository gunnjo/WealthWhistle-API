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
 * calls callback function.
 * @param action - A function to be called if the user is verified
 * @param apiKey - A string representing a user's API key.
 * @param response - An express response object
 * @param userId - A string holding the user id of the user that is authenticating.
 */
exports.verifyUser = function(action, apiKey, response, userId) {
	this.AccountModel.findById(userId, 'apiKey', function(err, account) {
		if(err) {
			console.log(err);
			response.send(constants.HTTP_BADREQUEST);
			return;
		}
		if(account.apiKey != apiKey) {
			console.log(err);
			response.send(constants.HTTP_UNAUTHORIZED);
			return;
		}
		action();
	});
}
