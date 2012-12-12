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

/**
 * Deletes a bucket as well as the chain of events (credits and debits) that is attached
 * to it.
 * @param bucketData - An array containing an apiKey as well as a bucket id to delete.
 * @param response - An express response object
 */
exports.deleteBucket = function(apiKey, bucketData, response) {
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
 * Inserts a bucket into the data store.
 * @param bucketData - An array containing an apiKey, bucketName, projectedCapacity for
 * the bucket, and a userId that owns the bucket.
 * @param response - An express response object.
 */

exports.insertBucket = function(apiKey, bucketData, response) {
	var insertBucket = function() {
		new BucketModel(bucketData).save(function(err, newBucket) {
			console.log("new bucket - " +  newBucket);
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
