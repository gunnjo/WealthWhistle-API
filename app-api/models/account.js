var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	activationKey: {type: String, required: true},
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

module.exports = mongoose.model('account', accountSchema);