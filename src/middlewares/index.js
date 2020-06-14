const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('../lib/keys');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'syntaxerror',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;