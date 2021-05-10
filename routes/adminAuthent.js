const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {Admin, validateAdmin} = require('../models/admin');


//Root for admin authentication
router.post('/',async(req, res) => {
    const {error} = validateAdminAuthent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Async request for email check in the DB
    let admin = await Admin.findOne({adminEmail: req.body.adminEmail});
    if(!admin) return res.status(404).send('Invalid admin email!');

    //Async request waitinig for bcrypt check if the input password is equal for the password in the DB
    const validAdminPassword = await bcrypt.compare(req.body.adminPassword, admin.adminPassword);
    if(!validAdminPassword) return res.status(401).send('Invalid admin password!');

    //Generating and sending token to frontend
    const token = admin.generateAdminToken();
    res.header('x-auth-token',token).send(token);
})


//Function validating the request body sent by the Frontend;
function validateAdminAuthent(admin){
    const schema = Joi.object({
        adminEmail: Joi.string().required().min(5).max(50),
        adminPassword: Joi.string().required().min(8).max(255)
    })
    return schema.validate(admin);
}


module.exports = router;
