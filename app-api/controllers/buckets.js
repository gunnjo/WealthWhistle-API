var buckets = require('../models/buckets.js');

exports.post = function(req, res) {
	var data = req.body;
	var bucketData = {};

	bucketData.bucketName = data.bucketName;
	bucketData.projectedCapacity = data.projectedCapacity;
	bucketData.userId = data.userId;

	buckets.insertBucket(bucketData, res);

}