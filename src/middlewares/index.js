const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const multer = require('multer');
const { database } = require('../lib/keys');

const setUserID = (req, res, next) => {
    /*
    if(req.session) {
        console.log(req.session)
        const userID = req.session.passport.user;
        req.locals.userid = userID;
    }*/
    next();
}

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'ron',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(setUserID);

module.exports = app;