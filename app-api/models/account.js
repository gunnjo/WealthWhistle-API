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

var AccountModel = mongoose.model('account', accountSchema);

exports.insertAccount = function(accountData, response) {
	new AccountModel(accountData).save(function(err, newAccount) {
		if (err) {
			console.log(err);
			response.send(constants.HTTP_CONFLICT);
			return;
		}
		//TODO: send email with an activation key
		response.send(constants.HTTP_CREATED, newAccount);
	});
};


exports.updateAccount = function(accountData, response) {

	AccountModel.findByIdAndUpdate(accountData.userId, accountData, function(err, numberAffected, rawResponse) {
		if (err) {
			console.log(err);
			response.send(constants.HTTP_BADREQUEST);
			return;
		}
		if (numberAffected === 0) {
			console.log('did not update any rows for username ' + req.params.username);
			response.send(constants.HTTP_BADREQUEST);
			return;
		}
		res.send(constants.HTTP_OK);
	})
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
	console.log(apiKey + " ::: " + userId);
	AccountModel.findById(userId, 'apiKey', function(err, account) {
		console.log(account);
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
		console.log('calling');
		action();
	});
}
