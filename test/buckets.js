var accounts = require('../models/account.js');
var assert = require('assert');
var buckets = require('../models/buckets.js');
var constants = require('../constants.js');
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
				assert.equal(response.statusCode, constants.HTTP_CREATED);
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
				assert.equal(response.statusCode, constants.HTTP_UNAUTHORIZED);
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
				assert.equal(response.statusCode, constants.HTTP_CREATED);
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
				assert.equal(response.statusCode, constants.HTTP_BADREQUEST);
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
				assert.equal(response.statusCode, constants.HTTP_BADREQUEST);
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
				assert.equal(response.statusCode, constants.HTTP_UNAUTHORIZED);
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
				assert.equal(response.statusCode, constants.HTTP_BADREQUEST);
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
				assert.equal(response.statusCode, constants.HTTP_OK);
				assert.equal(body._id, bucketId);
				done();
			})
		});
	});
	describe('Get Buckets', function() {
		var userId = '';

		before(function(done) {
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
				done();
			});
		});

		after(function(done) {
			buckets.BucketModel.remove({}, function () {
				accounts.AccountModel.remove({}, function() {
					done();
				});
			});
		});

		it('Should not list any buckets if the account does not have any buckets', function(done) {
			var requestData = {
				apiKey: 'testKey'
			};

			var getRequest = {
				json: requestData,
				method: 'GET',
				url: 'http://localhost:3000/buckets/' + userId
			};

			var bucketIds = [];

			request.get(getRequest, function(error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_OK);
				assert(JSON.stringify(body) === JSON.stringify(bucketIds));
				done();
			});
		});

		it('Should list all URIs for buckets belonging to an account', function(done) {
			var bucketData = {
				apiKey: 'testKey',
				bucketName : 'Entertainment',
				projectedCapacity: 5000,
				userId: userId
			};

			var requestData = {
				apiKey: 'testKey'
			};

			var getRequest = {
				json: requestData,
				method: 'GET',
				url: 'http://localhost:3000/buckets/' + userId
			};

			var bucketIds = [];
			var bucketsToMake = 3;

			var sendRequest = function() {
				request.get(getRequest, function(error, response, body) {
					assert.equal(response.statusCode, constants.HTTP_OK);
					assert(JSON.stringify(body) === JSON.stringify(bucketIds));
					done();
				});
			};

			var createTestBucket = function() {
				buckets.BucketModel(bucketData).save(function(err, newBucket){
					bucketIds.push({_id : newBucket._id});
					if(bucketsToMake === 0) {
						sendRequest();
					}
					else {
						bucketsToMake--;
						createTestBucket();
					}
				});
			};

			createTestBucket();
		});

		it('Should not list any buckets if API key is incorrect', function(done) {
			var requestData = {
				apiKey: 'invalidKey'
			};

			var getRequest = {
				json: requestData,
				method: 'GET',
				url: 'http://localhost:3000/buckets/' + userId
			};

			request.get(getRequest, function(error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_UNAUTHORIZED);
				done();
			});
		});

		it('Should not list any buckets if the username does not exist', function(done) {
			var requestData = {
				apiKey: 'testKey'
			};

			var getRequest = {
				json: requestData,
				method: 'GET',
				url: 'http://localhost:3000/buckets/' + 'invalidId'
			};

			request.get(getRequest, function(error, response, body) {
				assert.equal(response.statusCode, constants.HTTP_BADREQUEST);
				done();
			});
		});
	});
});