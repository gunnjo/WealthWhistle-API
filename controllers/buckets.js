var buckets = require('../models/buckets.js');

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

exports.delete = function(request, response) {
	var apiKey = '';
	var data = request.body;
	var bucketData = {};

	if(data.apiKey != undefined) { apiKey = data.apiKey; }
	if(data.userId != undefined) { bucketData.userId = data.userId; }
	bucketData.bucketId = request.params.bucketId;

	buckets.deleteBucket(apiKey, bucketData, response);
}