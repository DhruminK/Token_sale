// config/passport.js

// IMPORTING THE NECESSARY PACKAGES ----------
var LocalStrategy = require('passport-local').Strategy;

// Load up the user model
let User = require('../app/models/User');

// expose this function to our app 
module.exports = passport => {

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {

            User.findOne({ 'local.email': email }, (err, user) => {
                if (err) {
                    throw err;
                }
                if (user) {
                    return done(null, false, { success: false });
                } else {
                    let newUser = new User();
                    newUser.local.email = email;

                    if (req.body.username) {
                        newUser.local.username = req.body.username;
                    }
                    if (req.body.f_name) {
                        newUser.local.first_name = req.body.f_name;
                    }
                    if (req.body.l_name) {
                        newUser.local.last_name = req.body.l_name;
                    }

                    newUser.local.password = newUser.generateHash(password);

                    User.count({}, (err, count) => {

                        if(err) {
                            throw err;
                        }
                        newUser.uuid = newUser.generateUUID(count);

                        newUser.save(err => {
                            if (err) {
                                throw err;
                            }
                            done(null, newUser);
                        });
                    });
                }
            })

        }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    (req, email, password, done) => {
        User.findOne({ 'local.email' : email}, (err, user) => {
            if(err) {
                throw err;
            }
            if(!user) {
                return done(null, false, { user: false });
            }
            if(!user.validPassword(password, user.local.password)) {
                return done(null, false, { success: false });
            }
            user.local.password = null;
            return done(null, user);
        }).select('+local.password');
    }))
};
