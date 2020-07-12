const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validateDriver, createDriver, getDriverByEmail } = require('../services/driver/lib');
const { validateUser, createUser, getUserByEmail } = require('../services/user/lib');
const bcrypt = require('bcrypt-nodejs');
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
            console.log("hey")
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
            console.log("HOLA")
            return done( null, newDriver );
        } catch(error) {
            return done( null, false, { error: true, message: error });
        }
    } else {
        return done( null, false, { error: true, message: "Invalid data provided" });
    }
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const user = await getUserByEmail(username);
        console.log(user);
        if(!user) return done( null, false );
        console.log(user.Password);
        if(bcrypt.compareSync(password, user.Password)) {
            user.id  = user.UserID;
            return done( null, user );
        } else {
            console.log('invalid password');
            return done( null, false, { error: true, message: 'Invalid credentials' });
        }
    } catch(error) {
        console.log(error)
        return done( null, false, { error: true, message: error });
    }
}));

passport.use('local-login-driver', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const driver = await getDriverByEmail(username);
        if(!driver) return done( null, false );
        if(await bcrypt.compareSync(password, driver.Password))
            return done( null, driver );
        else
            return done( null, false, { error: true, message: 'Invalid credentials' });
    } catch(error) {
        return done( null, false, { error: true, message: error });
    }
}));

passport.serializeUser((connection, done) => {
    console.log("serialized")
    done(null, connection.id);
});

passport.deserializeUser(async (id, done) => {
    console.log("desirialize")
    let rows;
    rows = await db.query("SELECT * FROM User WHERE UserID = ?", id);
    /*
    if(connection.type = 'driver') {
        rows = await db.query("SELECT * FROM Driver WHERE DriverID = ?", connection.id);
    } else {
        rows = await db.query("SELECT * FROM User WHERE UserID = ?", connection.id);
    } */
   done(null, rows[0]);
})
