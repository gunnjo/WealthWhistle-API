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

exports.insertAccount = function(accountData, res) {
	new AccountModel(accountData).save(function(err, newAccount) {
		if (err) {
			console.log(err);
			res.send(409);
			return;
		}
		//TODO: send email with an activation key
		res.send(201, newAccount);
	});
};

exports.updateAccount = function(accountData, res) {
	AccountModel.update(conditions, accountData, function(err, numberAffected, rawResponse) {
		if (err) {
			console.log(err);
			res.send(400);
			return;
		}
		if (numberAffected === 0) {
			console.log('did not update any rows for username ' + req.params.username);
			res.send(400);
			return;
		}
		res.send(200);
	})
}