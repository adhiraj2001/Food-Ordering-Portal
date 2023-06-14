const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	vendor_email: {
		type: String,
		required: true
	},
	buyer_email: {
		type: String,
		required: true
	},
	shop: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: "Placed"
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Order = mongoose.model("order", OrderSchema);