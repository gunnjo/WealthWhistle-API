/*Contains models for buckets. Currently, only insertion and deletion are defined.
* Each new model should define an action to carry out the task on the schema (e.g.
* insert a bucket) and then verify the user through account's verifyUser function
* */
var account = require('./account.js');
var constants = require('../constants.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bucketSchema = new Schema({
	bucketName: {type: String, required: true},
	creationTimestamp: {type: Date, default: Date.now()},
	currentTotal: {type: Number, default: 0},
	projectedCapacity: {type: Number, required: true},
	userId: {type: String, required: true}
});

var BucketModel = mongoose.model('bucket', bucketSchema);
exports.BucketModel = BucketModel;

/**
 * Deletes a bucket as well as the chain of events (credits and debits) that is attached
 * to it.
 * @param apiKey - The api key to be used for authentication
 * @param bucketData - An array containing an apiKey as well as a bucket id to delete
 * as well as the bucket owner's user id.
 * @param response - An express response object
 */
exports.deleteBucket = function(apiKey, bucketData, response) {
	//TODO: deleting a bucket should remove all relevant debits/credits
	var deleteBucket = function() {
		BucketModel.findByIdAndRemove(bucketData.bucketId, function(err, bucket) {
			if(err) {
				console.log(err);
				response.send(constants.HTTP_BADREQUEST);
				return;
			}
			response.send(constants.HTTP_OK, bucket);
		});
	};
	account.verifyUser(deleteBucket, apiKey, response, bucketData.userId);
}

/**
 * Deletes a bucket as well as the chain of events (credits and debits) that is attached
 * to it.
 * @param apiKey - The api key to be used for authentication
 * @param bucketData - An array containing a userId
 * @param response - An express response object
 */
exports.getBuckets = function(apiKey, accountData, response) {
	var getBuckets = function() {
		BucketModel.find({userId : accountData.userId}, 'bucketId', function(err, buckets) {
			if(err) {
				console.log(err);
				response.send(constants.HTTP_BADREQUEST);
				return;
			}
			response.send(constants.HTTP_OK, buckets);
		});
	};

	account.verifyUser(getBuckets, apiKey, response, accountData.userId);
}

/**
 * Creates a bucket.
 * @param apiKey - The api key to be used for authentication
 * @param bucketData - An array containing a bucketName, projectedCapacity for
 * the bucket, and a userId that owns the bucket.
 * @param response - An express response object.
 */
exports.insertBucket = function(apiKey, bucketData, response) {
	var insertBucket = function() {
		new BucketModel(bucketData).save(function(err, newBucket) {
			if (err) {
				console,log(err);
				response.send(constants.HTTP_BADREQUEST);
				return;
			}
			response.send(constants.HTTP_CREATED, newBucket);
		});
	}
	account.verifyUser(insertBucket, apiKey, response, bucketData.userId);
}
