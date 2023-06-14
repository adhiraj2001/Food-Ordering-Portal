const express = require("express");
const router = express.Router();

const Check = require("validator");
const isEmpty = require("is-empty");

// Load User model
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");

const ObjectID = require('mongodb').ObjectId;

var valid = data => {

    // error object
    let errors = {};

    if (!Check.isInt(data.price + "")) {
        errors.price = "Price should be an Integer";
    }
    else if (data.price + 0 <= 0) {
        errors.price = "Price should be a positive Integer";
    }
    
    if (!Check.isInt(data.quantity + "")) {
        errors.quantity = "Quantity should be an Integer";
    }
    else if ((data.quantity + 0) <= 0) {
        errors.quantity = "Quantity should be a positive Integer";
    }

    if (((data.type + "") != "Veg") && ((data.type + "") != "Non-Veg")) {
        errors.type = "Product Type can only be 'Veg' or 'Non-Veg'";
    }

	// // Password checks
	// if (Check.isEmpty(data.password)) {
	// 	errors.password = "Password field is required";
	// }
    
    return { isValid: isEmpty(errors), errors };
};

//* @route GET request 
//* @desc Getting all the products
//* @access Public
router.get("/", function (req, res) {
    Product.find()
        .then(items => res.json(items))
        .catch(err => console.log(err));
});


//* @route POST /product/create
//* @desc create product
//* @access Public
router.post("/add", (req, res) => {

    const { errors, isValid } = valid(req.body);
    
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
    
    Product.findOne({ email: req.body.vendor_email, name : req.body.name })
        .then(items => {
            if (items) {
                return res.status(400).json({ email: "This Items already exists for the current vendor." });
            }
            else {
                const newProduct = new Product({
                    name: req.body.name,
                    shop: req.body.shop,
                    vendor_email: req.body.vendor_email,
                    type: req.body.type,
                    price: req.body.price,
                    quantity: req.body.quantity
                });
                
                newProduct.save()
                    .then(item => {
                        res.status(200).json(item);
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });           
            }
        });
});

//* @route POST /buyers/update
//* @desc Update buyer
//* @access Public
router.post("/update", (req, res) => {

    const { isValid, errors } = valid(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Product.updateOne(
        { "_id": ObjectID(req.body._id) },  // <-- find stage
            { $set: {                // <-- set stage
                name: req.body.name,
                shop: req.body.shop,
                vendor_email: req.body.vendor_email,
                type: req.body.type,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status
            }
        }   
    )
    .then(items => {
        if (items.nModified == 0) {
            res.status(400).json({ error: "Product not Found!", product: req.body });
        }
        else {
            res.status(200).json(items);
        }
    })
    .catch(err => {
        res.status(400).json({ email: "Buyer Email doesn't exist", error: err });
    });
});

//* @route POST /buyers/update
//* @desc Update buyer
//* @access Public
router.post('/delete', (req, res) => {
    Product.findById(ObjectID(req.body._id))
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});



//* @route POST /product/view
//* @desc view all products
//* @access Public
router.post("/view", (req, res) => {
    Product.find({ vendor_email: req.body.vendor_email })
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

module.exports = router;