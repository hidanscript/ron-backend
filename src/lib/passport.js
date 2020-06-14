const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validateDriver, createDriver } = require('../services/driver/lib');
const { validateUser, createUser } = require('../services/user/lib');
const db = require('./db_connection');

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const userData = { ...req.body };

    if(validateUser(username, password, userData)) {
        try {
            const newUser = await createUser(username, password, userData);
            return done( null, newUser );
        } catch(error) {
            return done( null, false, { error: true, message: error });
        }
    } else {
        return done( null, false, { error: true, message: "Invalid data provided" });
    }
}));

passport.use('local-signup-driver', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const driverData = { ...req.body };

    if(validateDriver(driverData)) {
        try {
            const newDriver = await createDriver(driverData, username, password);
            return done( null, newDriver );
        } catch(error) {
            return done( null, false, { error: true, message: error });
        }
    } else {
        return done( null, false, { error: true, message: "Invalid data provided" });
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   const rows = await db.query("SELECT * FROM Rider WHERE RiderID = ?", id);
   done(null, rows[0]);
})
