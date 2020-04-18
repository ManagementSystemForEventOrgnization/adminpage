
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const cookieSession = require('cookie-session');
const morgan = require('morgan'); 
const express = require('express');
const keys = require('./key');


module.exports = app => {

    //app.use(morgan('dev'));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.set('view engine', "ejs");
    app.set("views", "./views/layouts");
    app.use(expressLayouts);
    app.set('layout extractScripts', true)
    app.set('layout extractStyles', true)

    app.use(
        cookieSession({
            maxAge: 1 * 12 * 60 * 60 * 1000,
            keys: [keys.cookieKey]
        })
    );
}