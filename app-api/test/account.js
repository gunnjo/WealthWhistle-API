var accounts = require('../models/account.js');
var assert = require('assert');
var config = require('../config.js');
var constants = require('../constants.js');
var mocha = require('mocha');
var mongoose = require('mongoose');
var request = require('request');

mongoose.connect(config.mongo.getConnectString());

describe('Accounts', function () {
	describe('Create Accounts', function () {

		beforeEach(function (done) {
			accounts.AccountModel.remove({}, function (err) {
				done();
			});
		});

		afterEach(function (done) {
			accounts.AccountModel.remove({}, function (err) {
				done();
			});
		});

		it('Should create an account if username does not already exist', function (done) {
			var testData = {
				birthDate: '12/12/12',
				email: 'test@test.com',
				gender: 'M',
				firstName: 'I am a',
				lastName: 'test',
				password: 'test',
				username: 'test',
				zip: '19301'
			};

			var postRequest = {
				json:testData,
				uri:'http://localhost:3000/users',
				method:'POST'
			};

			request(postRequest, function (error, response, body) {
				assert(body.activationKey != undefined);
				assert(body.password != undefined);
				assert.equal(response.statusCode, constants.HTTP_CREATED);
				assert.equal(body.birthDate, '2012-12-12T05:00:00.000Z');
				assert.equal(body.email, 'test@test.com');
				assert.equal(body.gender, 'M');
				assert.equal(body.firstName, 'I am a');
				assert.equal(body.lastName, 'test');
				assert.equal(body.username, 'test');
				assert.equal(body.zip, '19301');
				done();
			});
		});

		it('Should not add unrecognized fields to the database when creating an account',
				function (done) {
			var testData = {
				email:'test@test.com',
				firstName:'I am a',
				invalid: 'invalid',
				lastName:'test',
				password:'test',
				username:'test'
			};

			var postRequest = {
				json:testData,
				uri:'http://localhost:3000/users',
				method:'POST'
			};

			request(postRequest, function (error, response, body) {
				assert(body.invalid == undefined);
				done();
			});
		});

		it('Should not create a user if the username is already taken.', function (done) {
			var testData = {
				email:'test@test.com',
				firstName:'I am a',
				lastName:'test',
				password:'test',
				username:'test'
			};

			var postRequest = {
				json:testData,
				uri:'http://localhost:3000/users',
				method:'POST'
			};

			request(postRequest, function (error, response, body) {
				assert.equal(body.username, 'test');
				assert.equal(response.statusCode, constants.HTTP_CREATED);
				request(postRequest, function (error, response, body) {
					assert.equal(response.statusCode, constants.HTTP_CONFLICT);
					done();
				});
			});
		});
	});

	describe('Update Accounts', function() {
		var id = '';
		var password = '';

		before(function(done) {
			var testData = {
				activationKey: 'testAct',
				apiKey : 'testKey',
				birthDate: '12/12/12',
				email:'test@test.com',
				gender: 'M',
				firstName:'I am a',
				lastName:'test',
				password:'test',
				username:'test',
				zip: '19301'
			};

			new accounts.AccountModel(testData).save(function(err, newAccount) {
				id = newAccount._id;
				password = newAccount.password;
				console.log(newAccount.apiKey);
				done();
			});
		});

		after(function (done) {
			accounts.AccountModel.remove({}, function (err) {
				done();
			});
		});

		it('Should update all valid fields on an account', function(done) {
			var testData = {
				apiKey : 'testKey',
				password:'testChanged',
				email:'test@test.comChanged',
				zip: '19304'
			};

			var putRequest = {
				json:testData,
				uri:'http://localhost:3000/users/' + id,
				method:'PUT'
			};

			request(putRequest, function (error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_OK);
				accounts.AccountModel.findById(id, function(err, account) {
					assert.equal(account.email, 'test@test.comChanged');
					assert.equal(account.zip, '19304');
					assert.notEqual(account.password, password);
					done();
				});
			});
		});

		it('Should not update an account with an incorrect API key', function(done) {
			var testData = {
				apiKey : 'failKey'
			};

			var putRequest = {
				json:testData,
				uri:'http://localhost:3000/users/' + id,
				method:'PUT'
			};

			request(putRequest, function (error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_UNAUTHORIZED);
				done();
			});
		});

		it('Should not update any unrecognized/not writable fields on an account',
				function(done) {
			var testData = {
				apiKey: 'testKey',
				birthDate: 'Modified',
				creationDate: 'Modified',
				gender: 'Modified',
				invalid: 'invalid',
				firstName: 'Modified',
				lastName: 'Modified',
				username: 'Modified'
			};

			var putRequest = {
				json:testData,
				uri:'http://localhost:3000/users/' + id,
				method:'PUT'
			};

			request(putRequest, function (error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_OK);
				accounts.AccountModel.findById(id, function(err, account) {
					assert.notEqual(account.birthDate, 'Modified');
					assert.notEqual(account.creationDate, 'Modified');
					assert.notEqual(account.gender, 'Modified');
					assert.notEqual(account.firstName, 'Modified');
					assert.notEqual(account.lastName, 'Modified');
					assert.notEqual(account.userName, 'Modified');
					assert(account.invalid == undefined);
					done();
				});
			});
		});

		it('Should not update an account that doesn\'t exist', function(done) {
			var testData = {
				apiKey : 'testKey'
			};

			var putRequest = {
				json:testData,
				uri:'http://localhost:3000/users/notarealid',
				method:'PUT'
			};

			request(putRequest, function (error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_BADREQUEST);
				done();
			});
		});
	});
});