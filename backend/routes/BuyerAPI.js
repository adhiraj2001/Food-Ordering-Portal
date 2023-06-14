const express = require("express");
const router = express.Router();

const Check = require("validator");
const isEmpty = require("is-empty");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load User model
const Buyer = require("../models/Buyer");
const keys = require("../config/keys");

const ObjectID = require('mongodb').ObjectId;


var valid = data => {

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

    if (!Check.isLength(data.batch + "", { min:3, max: 3 })) {
        errors.batch = "Invalid syntax, syntax [UG1 - UG5]";
    }
    else if (((data.batch + "").substring(0, 2) != "UG") || ((data.batch + "").charAt(2) - '0' > 5)) {
        errors.batch = "Batch is valid from [UG1 to UG5]";
    }

    if (!((data.money || 0) >= 0)) {   
        errors.money = `Money should be a positive integer: ${(data.money || 0)}`;
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
    Buyer.find()
        .then(items => res.json(items))
        .catch(err => console.log(err));
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

//* @route POST /buyers/register
//* @desc Register buyer
//* @access Public
router.post("/register", (req, res) => {

    const { isValid, errors } = valid(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Buyer.findOne({ email: req.body.email })
        .then(items => {
            if (items) {
			    return res.status(400).json({ email: "Email already exists" });
            }
            else {
                const newBuyer = new Buyer({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    contact_no: req.body.contact_no,
                    age: req.body.age,
                    batch: req.body.batch
                });
                
                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newBuyer.password, salt, (err, hash) => {
                        if (err) throw err;

                        newBuyer.password = hash;

                        newBuyer.save()
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
    Buyer.findOne({ email: req.body.email }).then(items => {
        
		// Check if user email exists
		if (!items) {
			return res.status(404).json({ error: "Buyer Email not found" });
        }

        // Check password
        bcrypt.compare(req.body.password, items.password)
            .then(isMatch => {
                if (isMatch) {
                    res.json(items);
                }
                else {
                    res.status(400).json({
                        error: "Buyer Password Incorrect"
                    });
                }
            })
            .catch(err => {
                res.status(400).json({ password: "Password did not match.", error: err });
            });
        
	});
});


//* @route POST /buyers/find
//* @desc Find buyer
//* @access Public
router.post("/find", (req, res) => {

	// Find user by email
    Buyer.findOne({ email: req.body.email }).then(items => {
        
		// Check if user email exists
        if (items) {
            res.status(200).json(items);
        }
        else {
            res.status(404).json({ error: "Buyer Email not found", email: req.body.email });
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

    Buyer.updateOne(
        { email: req.body.email },  // <-- find stage
            { $set: {                // <-- set stage
                name: req.body.name,     
                email: req.body.email,      // <-- id not _id
                password: req.body.password,
                contact_no: req.body.contact_no,
                age: req.body.age,
                batch: req.body.batch,
                money: req.body.money
            } 
        }   
    )
    .then(items => {
        res.status(200).json(req.body);
    })
    .catch(err => {
        res.status(400).json({ email: "Buyer Email doesn't exist", error: err });
    });
});

module.exports = router;

