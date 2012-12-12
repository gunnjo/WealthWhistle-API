var accounts = require('../models/account.js');
var assert = require('assert');
var buckets = require('../models/buckets.js');
var mocha = require('mocha');
var request = require('request');

describe('Buckets', function() {
	describe('Create Buckets', function() {
		var id = '';

		before(function(done) {
			buckets.BucketModel.remove({}, function() {
				var testUser = {
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

				new accounts.AccountModel(testUser).save(function(err, newAccount) {
					id = newAccount.id;
					done();
				});
			});
		});

		after(function(done) {
			buckets.BucketModel.remove({}, function() {
				accounts.AccountModel.remove({}, function() {
					done();
				});
			});
		});

		it('Should create new buckets', function(done) {
			var testData = {
				apiKey: 'testKey',
				bucketName : 'Entertainment',
				projectedCapacity: 5000,
				userId: id
			};

			var postData = {
				json: testData,
				url: 'http://localhost:3000/buckets'
			};

			request.post(postData, function(error, response, body) {
				assert.equal(response.statusCode, '201');
				assert.equal(body.bucketName, 'Entertainment');
				assert.equal(body.currentTotal, '0');
				assert.equal(body.projectedCapacity, '5000');
				assert.equal(body.userId, id);
				done();
			});
		});

		it('Should not create a bucket if an incorrect API key is used', function(done) {
			var testData = {
				apiKey: 'invalidKey',
				bucketName : 'Entertainment',
				projectedCapacity: 5000,
				userId: id
			};

			var postData = {
				json: testData,
				url: 'http://localhost:3000/buckets'
			};

			request.post(postData, function(error, response, body) {
				assert.equal(response.statusCode, '401');
				done();
			});
		});

		it('Should not add any invalid fields to new buckets', function(done) {
			var testData = {
				apiKey: 'testKey',
				bucketName : 'Entertainment',
				invalid: 'invalid',
				projectedCapacity: 5000,
				userId: id
			};

			var postData = {
				json: testData,
				url: 'http://localhost:3000/buckets'
			};

			request.post(postData, function(error, response, body) {
				assert.equal(response.statusCode, '201');
				assert(body.invalid == undefined);
				done();
			});
		});

		it('Should not create a bucket for an invalid user', function(done) {
			var testData = {
				apiKey: 'testKey',
				bucketName : 'Entertainment',
				projectedCapacity: 5000,
				userId: 'invalidId'
			};

			var postData = {
				json: testData,
				url: 'http://localhost:3000/buckets'
			};

			request.post(postData, function(error, response, body) {
				assert.equal(response.statusCode, '400');
				done();
			});
		});
	});

	describe('Delete Buckets', function() {
		var userId = '';
		var bucketId = '';

		before(function(done) {
			buckets.BucketModel.remove({}, function() {
				var testUser = {
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

				new accounts.AccountModel(testUser).save(function(err, newAccount) {
					userId = newAccount.id;
					var testBucket = {
						bucketName : 'Entertainment',
						projectedCapacity: 5000,
						userId: userId
					};
					new buckets.BucketModel(testBucket).save(function(err, newBucket) {
						bucketId = newBucket.id;
						done();
					});
				});
			});
		});

		after(function(done) {
			buckets.BucketModel.remove({}, function () {
				accounts.AccountModel.remove({}, function() {
					done();
				});
			});
		});

		it('Should not delete a bucket that doesn\'t exist', function(done) {
			var bucketData = {
				apiKey: 'testKey',
				userId: userId
			};

			var deleteData = {
				json: bucketData,
				url: 'http://localhost:3000/buckets/invalidId'
			};

			request.del(deleteData, function(error, response, body) {
				assert.equal(response.statusCode, '400');
				done();
			});
		});

		it('Should not delete a bucket if an incorrect API key is provided', function(done) {
			var bucketData = {
				apiKey: 'invalidKey',
				userId: userId
			};

			var deleteData = {
				json: bucketData,
				url: 'http://localhost:3000/buckets/' + bucketId
			};

			request.del(deleteData, function(error, response, body) {
				assert.equal(response.statusCode, '401');
				done();
			})
		});

		it('Should not delete a bucket for a user that doesn\'t exist', function(done) {
			var bucketData = {
				apiKey: 'testKey',
				userId: 'invalidId'
			};

			var deleteData = {
				json: bucketData,
				url: 'http://localhost:3000/buckets/' + bucketId
			};

			request.del(deleteData, function(error, response, body) {
				assert.equal(response.statusCode, '400');
				done();
			})
		});

		it('Should delete the correct bucket', function(done) {
			var bucketData = {
				apiKey: 'testKey',
				userId: userId
			};

			var deleteData = {
				json: bucketData,
				url: 'http://localhost:3000/buckets/' + bucketId
			};

			request.del(deleteData, function(error, response, body) {
				assert.equal(response.statusCode, '200');
				assert.equal(body._id, bucketId);
				done();
			})
		});
	});
});