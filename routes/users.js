const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {User, validateUser} = require('../models/user');


//Async function for creating User object - no authentication token needed. It returns token at registration.
router.post('/',async(req, res) => {
    //Validating the User input data with Joi
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking in the DB if there is user registered with the same email
    let user = await User.findOne({userEmail: req.body.userEmail});
    const reqEmail = req.body.userEmail;
    if(user) return res.status(409).send(`User with email: ${reqEmail} already exists!`);

    //Creating User object for the DB
    user = new User(req.body);

    //Generating salt with the BCRYPT
    const salt = await bcrypt.genSalt(10);
    user.userPassword = await bcrypt.hash(user.userPassword,salt);

    //Saving the User object in the DB
    await user.save();

    //If User is successfully registered we generate token and return this token to the Frontend
    const token = user.generateUserToken();
    res.header('x-auth-token',token).send(token);
})


//Retrieve single User object from the DB by the ID from the request
router.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User with the given ID was not found!');
    res.send(user);
})


//Retrieving all the User objects from the DB
router.get('/',async(req, res) => {
    const users = await User.find().sort('userName');
    if(!users) return res.status(404).send('There are no registered Users in the DB');
    res.send(users.map(user => _.pick(user,['_id','userName','userPicture','userAddress','userTelephone'])));
})


//Updating single User object
router.put('/:id', async(req, res) => {
    //Validating User update input with Joi validation schema
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Generating salt for the update password
    const salt = await bcrypt.genSalt(10);

    //Finding User to update in the DB by the route id parameter
    const user = await User.findByIdAndUpdate(req.params.id,{
        userName: req.body.userName,
        userPassword: await bcrypt.hash(req.body.userPassword,salt),
        userEmail: req.body.userEmail,
        userPicture: req.body.userPicture,
        userAddress: req.body.userAddress,
        userTelephone: req.body.userTelephone
    },
        {new: true});

    if(!user) return res.status(404).send("The user with the given ID was not found");
    res.send(user);
})


//Deleting single User from the DB
router.delete('/:id', async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send('User with the given ID was not found');
    res.send(user);
})


module.exports = router;
