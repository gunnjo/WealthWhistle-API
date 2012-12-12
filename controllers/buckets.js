/*Contains controllers that are related to buckets. Currently, only creation
 * and deletion are defined. Temporary edits (e.g. an expense) should be handled
 * through credits/debits, whereas permanent edits (e.g. renaming a bucket)
 * should be added later.
 *
 * All controllers should take relevant fields out of the request object and
 * pass the response object and an array of fields to be inserted into the database
 * to the appropriate model.
 * */

//TODO: add ability to make permanent changes to a bucket.

var buckets = require('../models/buckets.js');

/**
 * Handles a request to create a bucket.
 *
 * @param request - An express request object.
 * @param response - An express response object
 */
exports.post = function(request, response) {
	var apiKey = '';
	var data = request.body;
	var bucketData = {};

	if(data.apiKey != undefined) { apiKey = data.apiKey; }
	bucketData.bucketName = data.bucketName;
	bucketData.projectedCapacity = data.projectedCapacity;
	bucketData.userId = data.userId;

	buckets.insertBucket(apiKey, bucketData, response);

}

/**
 * Handles a request to delete a bucket.
 *
 * @param request - An express request object.
 * @param response - An express response object
 */
exports.delete = function(request, response) {
	var apiKey = '';
	var data = request.body;
	var bucketData = {};

	if(data.apiKey != undefined) { apiKey = data.apiKey; }
	if(data.userId != undefined) { bucketData.userId = data.userId; }
	bucketData.bucketId = request.params.bucketId;

	buckets.deleteBucket(apiKey, bucketData, response);
}