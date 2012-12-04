var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bucketSchema = new Schema({
	bucketName: {type: String, required: true},
	creationTimestamp: {type: Date, default: Date.now()},
	currentTotal: {type: Number, default: 0},
	projectedCapacity: {type: Number, required: true},
	userId: {type: String, required: true}
});

var bucketModel = mongoose.model('bucket', bucketSchema);

exports.insertBucket = function(bucketData, res) {
	new bucketModel(bucketData).save(function(err, newBucket) {
		if (err) {
			console,log(err);
			res.send(400);
			return;
		}
		res.send(201, newBucket);
	});
}