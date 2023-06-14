const express = require("express");
const router = express.Router();

const Check = require("validator");
const isEmpty = require("is-empty");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load User model
const Order = require("../models/Order");
const keys = require("../config/keys");

const ObjectID = require('mongodb').ObjectId;


//* @route GET request
//* @desc Getting all the users
//* @access Public
router.get("/", function (req, res) {
    Order.find()
        .then(items => res.json(items))
        .catch(err => console.log(err));
});


//* @route POST /order/add
//* @desc add order
//* @access Public
router.post("/add", (req, res) => {
    const newOrder = new Order({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        type: req.body.type,
        vendor_email: req.body.vendor_email,
        buyer_email: req.body.buyer_email,
        shop: req.body.shop
    });

    newOrder.save()
        .then(item => {
            return res.status(200).json(item);
        })
        .catch(err => {
            return res.status(400).send(err);
        });
});

router.post("/update", (req, res) => {

    Order.updateOne(
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
            res.status(400).json({ error: "Order not Found!", order: req.body });
        }
        else {
            res.status(200).json(items);
        }
    })
    .catch(err => {
        res.status(400).json({ email: "Buyer Email doesn't exist", error: err });
    });
});


//* @route POST /product/view
//* @desc view all products
//* @access Public
router.post("/view_buyer", (req, res) => {
    Order.find({ buyer_email: req.body.buyer_email })
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});


//* @route POST /product/view
//* @desc view all products
//* @access Public
router.post("/view_vendor", (req, res) => {
    Order.find({ vendor_email: req.body.vendor_email })
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

module.exports = router;