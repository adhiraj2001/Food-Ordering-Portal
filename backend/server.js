const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// const passport = require('passport');

const PORT = process.env.PORT || 4000;
const DB_NAME = 'test1';

// const connectionString = 'mongodb://127.0.0.1:27017/' + DB_NAME;
const connectionString = 'mongodb://mongo:27017/' + DB_NAME;    // for docker container

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//* Connect to MongoDB Atlas
// const db = require('./config/keys').mongoURI;
// mongoose.connect(db)
//     .then(() => console.log('MongoDB Connected...'))
//     .catch(err => console.log(err));


//* Connection to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log('Error: ' + err));

// const connection = mongoose.connection;
// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully !");
// });

//* Passport middleware
// app.use(passport.initialize());

//* Passport config
// require("./config/passport_buyer")(passport);
// require("./config/passport_vendor")(passport);

//* routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");

var BuyerRouter = require("./routes/BuyerAPI");
var VendorRouter = require("./routes/VendorAPI");
var ProductRouter = require("./routes/ProductAPI");
var OrderRouter = require("./routes/OrderAPI");


//* setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);

app.use("/buyers", BuyerRouter);
app.use("/vendors", VendorRouter);
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);

app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
