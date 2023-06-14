const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReviewSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	review: {
		type: String,
		required: true
	},
	vendor_mail: {
		type: String,
		required: true
	},
	user_mail: {
		type: String,
		required: true
	}
});

module.exports = Review = mongoose.model("review", ReviewSchema);