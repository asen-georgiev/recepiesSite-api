const express = require("express");
const admins = require('../routes/admins');
const adminauthent = require('../routes/adminAuthent');
const users = require('../routes/users');


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use('/api/admins',admins);
    app.use('/api/adminauthent',adminauthent);
    app.use('/api/users',users);
}
