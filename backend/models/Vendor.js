const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
	manager: {
		type: String,
		required: true
    },
    shop: {
        type: String,
        required: true
    },
	email: {
		type: String,
		required: true
    },
    password: {
        type: String,
        required: true
    },
    contact_no: {
        type: Number,
        required: true
    },
    op_time: {
        type: String,
        required: true
    },
    ed_time: {
        type: String,
        required: true
    },
	date: {
		type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model("vendor", VendorSchema);
