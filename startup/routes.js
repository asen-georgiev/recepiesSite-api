const express = require("express");
const admins = require('../routes/admins');
const adminauthent = require('../routes/adminAuthent');
const comments = require('../routes/comments');
const images = require('../routes/images');
const recipes = require('../routes/recipes');
const users = require('../routes/users');
const userauthent = require('../routes/userAuthent');


module.exports = function (app) {
    app.use(express.json());
    app.use(express.static('gallery'));
    app.use(express.urlencoded({extended:true}));
    app.use('/api/admins',admins);
    app.use('/api/adminauthent',adminauthent);
    app.use('/api/comments',comments)
    app.use('/api/images',images);
    app.use('/api/recipes',recipes);
    app.use('/api/users',users);
    app.use('/api/userauthent',userauthent);
}
