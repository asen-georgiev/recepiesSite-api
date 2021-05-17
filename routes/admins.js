const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {Admin, validateAdmin} = require('../models/admin');


//Creating the Admin object - validating, then existence check, saving and returning token to the user
router.post('/', async (req, res) => {
    //Validating the input data from the user with Joi function
    const {error} = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking in the DB if there is Admin registered with the same email
    let admin = await Admin.findOne({adminEmail: req.body.adminEmail});
    const reqEmail = req.body.adminEmail;
    if (admin) return res.status(409).send(`Admin with email: ${reqEmail} already exists!`);

    //Creating the new Admin object
    admin = new Admin(req.body);

    //Generating SALT from Bcrypt and hashing the password in the DB
    const salt = await bcrypt.genSalt(10);
    admin.adminPassword = await bcrypt.hash(admin.adminPassword, salt);

    //Saving the Admin object to DB
    await admin.save();

    //If admin is successfully registered API will return token in the header to the user
    const token = admin.generateAdminToken();
    res.header('x-auth-token', token).send(token);
})


//Retrieving all Admin users from DB
router.get('/', async (req, res) => {
    const admins = await Admin.find().sort('adminName');
    res.send(admins.map(admin => _.pick(admin,['_id','adminName','adminEmail','isAdmin'])));
})


//Retrieving single Admin user by ID
router.get('/:id', async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).send('Admin with the given ID was not found!');
    res.send(admin);
})


//Updating single Admin object in the DB
router.put('/:id', async (req, res) => {
    const {error} = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const admin = await Admin.findByIdAndUpdate(req.params.id, {
            adminName: req.body.adminName,
            adminEmail: req.body.adminEmail,
            adminPassword: await bcrypt.hash(req.body.adminPassword, salt),
            isAdmin: req.body.isAdmin
        },
        {new: true});

    if (!admin) return res.status(404).send("The admin with the given ID was not found");
    res.send(admin)
})


//Deleting single Admin object
router.delete('/:id', async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).send('Admin with the given ID was not found');
    res.send(admin);
})


module.exports = router;
