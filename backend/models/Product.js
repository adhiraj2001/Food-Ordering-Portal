const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

// Create Schema
const ProductSchema = new Schema({
	name: {
		type: String,
		required: true
    },
    shop: {
        type: String,
        required: true
    },
    vendor_email: {
        type: String,
        required: true
    },
    // image: {
    //     data: Buffer,
    //     type: String
    // },
    type: {
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
    status: {
        type: String,
        default: "Waiting"
    },
    add_on: {
        type: Array,
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    rate_count: {
        type: Number,
        default: 0
    }
});

ProductSchema.plugin(mongoose_fuzzy_searching, { fields: ["name"] });
module.exports = Product = mongoose.model("product", ProductSchema);
