const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User,validateUser} = require('models/user');


//User authentication route - If the user object is valid and is in DB -
//We return generated token back to the Frontend.
router.post('/', async(req, res) => {
    //Validating the input data from the User login form in the Frontend.
    const {error} = validateUserAuthent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Async request waiting for the server response from the user email check
    let user = await User.findOne({userEmail: req.body.userEmail});
    if(!user) return res.status(404).send('Invalid user email');

    //Async request waiting for BCRYPT to compare the given password to the encrypted password in the DB
    const validPassword = await bcrypt.compare(req.body.userPassword, user.userPassword);
    if(!validPassword) return res.status(401).send('Invalid user password');

    //Generating the User token and returning to frontend
    const token = user.generateUserToken();
    res.header('x-auth-token',token).send(token);
})


//Function for Joi validation of the login input
function validateUserAuthent(user){
    const schema = Joi.object({
        userEmail: Joi.string().required().min(5).max(50),
        userPassword: Joi.string().required().min(8).max(255)
    });
    return schema.validate(user);
}






module.exports = router;
