const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
    name: {
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
    age: {
        type: Number,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
	date: {
		type: Date,
        default: Date.now
    },
    money: {
        type: Number,
        default: 30
    }
});

module.exports = User = mongoose.model("buyer", BuyerSchema);
