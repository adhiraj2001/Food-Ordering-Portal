const express = require("express");
const router = express.Router();

const Check = require("validator");
const isEmpty = require("is-empty");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load User model
const Vendor = require("../models/Vendor");
const keys = require("../config/keys");

const ObjectID = require('mongodb').ObjectId;


var valid = (data) => {

    // error object
    let errors = {};
	
    if (!Check.isLength(data.email + "", { min: 1 })) {
		errors.email = "Email is invalid";
    }
    else if (!Check.isEmail(data.email + "")) {
		errors.email = "Email is invalid";
    }

     if (!Check.isLength(data.password + "", { min: 6 })) {
		errors.password = "Password should be of atleast length 6.";
    }

    if (!Check.isInt(data.contact_no + "")) {
        errors.contact_no = "Contact No. should be an Integer";
    }
    else if ((data.contact_no + 0) <= 0) {
        errors.contact_no = "Contact No. should be a positive integer";
    }
    else if (!Check.isLength((data.contact_no + ""), { min:10, max: 10 })) {
        errors.contact_no = "Contact No. required of length 10";
    }

	// // Password checks
	// if (Check.isEmpty(data.password)) {
	// 	errors.password = "Password field is required";
	// }
    
    return { isValid: isEmpty(errors), errors };
};


//* @route GET request
//* @desc Getting all the users
//* @access Public
router.get("/", function (req, res) {
    Vendor.find()
        .then(items => res.json(items))
        .catch(err => console.log(err));
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

//* @route POST api/vendors/register
//* @desc Register buyer
//* @access Public
router.post("/register", (req, res) => {

    const { isValid, errors } = valid(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Vendor.findOne({ $or: [{ email: req.body.email }, { shop: req.body.shop }] })
        .then(items => {
            if (items) {
                if (items.email === req.body.email) {
                    return res.status(400).json({ email: "Email already exists" });
                }
                else if (items.shop === req.body.shop) {
                    return res.status(400).json({ shop: "Shop name already exists" });
                }
            }
            else {
                const newVendor = new Vendor({
                    manager: req.body.manager,
                    shop: req.body.shop,
                    email: req.body.email,
                    password: req.body.password,
                    contact_no: req.body.contact_no,
                    op_time: req.body.op_time,
                    ed_time: req.body.ed_time
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newVendor.password, salt, (err, hash) => {
                        if (err) throw err;

                        newVendor.password = hash;

                        newVendor.save()
                            .then(item => {
                                res.status(200).json(item);
                            })
                            .catch(err => {
                                res.status(400).send(err);
                            });
                    });
                });
            }
        });
});


//* @route POST api/buyers/register
//* @desc Register buyer
//* @access Public
router.post("/login", (req, res) => {

	// Find user by email
    Vendor.findOne({ email: req.body.email }).then(items => {
        
		// Check if user email exists
		if (!items) {
			return res.status(404).json({ error: "Vendor Email not found" });
        }

        // Check password
        bcrypt.compare(req.body.password, items.password)
            .then(isMatch => {
                if (isMatch) {
                    res.json(items);
                }
                else {
                    res.status(400).json({
                        error: "Vendor  Password Incorrect"
                    });
                }
            })
            .catch(err => {
                res.status(400).send({ password: "Password did not match.", error: err });
            });
        
	});
});


//* @route POST /vendors/find
//* @desc Find vendor
//* @access Public
router.post("/find", (req, res) => {

	// Find user by email
    Vendor.findOne({ email: req.body.email }).then(items => {
        
		// Check if user email exists
        if (items) {
            res.status(200).json(items);
        }
        else {
            res.status(404).json({ error: "Vendor Email not found" });
        }
        
	});
});


//* @route POST /vendors/update
//* @desc Update vendor
//* @access Public
router.post("/update", (req, res) => {

    const { isValid, errors } = valid(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Vendor.updateOne(
        { email: req.body.email },  // <-- find stage
            { $set: {                // <-- set stage
                manager: req.body.manager,
                shop: req.body.shop,
                email: req.body.email,      // <-- id not _id
                password: req.body.password,
                contact_no: req.body.contact_no,
                op_time: req.body.op_time,
                ed_time: req.body.ed_time
            } 
        }   
    )
    .then(items => {
        res.status(200).json(req.body);
    })
    .catch(err => {
        res.status(400).json({ email: "Vendor Email doesn't exist", error: err });
    });
});

module.exports = router;
