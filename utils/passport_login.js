var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const Account = mongoose.model('accounts');

module.exports = (app) => {

    passport.serializeUser((user, done) => {
        //2
         done(null, user);
    });

    passport.deserializeUser((id, done) => {
        // save req.user
        done(null, id);
    });

    var ls = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, async (username, password, done) => {
        //1
        if (!username || !password) {
            return done(null, false, { message: 'Invalid data' });
        }
        try {
            let account = await Account.findOne({ username, password });
            if (!account) {
                return done(null, false, { message: 'username || password incorrect' });
            }
            return done(null, account)
        } catch (error) {
            return done(null, false, { message: 'Something wrong' });
        }
    });

    passport.use(ls);

}
