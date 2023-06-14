const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");
const Buyer = mongoose.model("buyer");
const keys = require("./keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            Buyer.findById(jwt_payload.id)
                .then(item => {
                    if (item) {
                        return done(null, item);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
	);
};