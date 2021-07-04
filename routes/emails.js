const express = require("express");
const router = express.Router();
const {Email, validateEmail} = require('../models/email');
const _ = require("lodash");


router.post('/', async(req, res) => {
    const {error} = validateEmail(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let email = new Email(req.body);
    await email.save();
    res.send(email);
});


//Retrieving all the emails
router.get('/', async(req, res) => {
    const emails = await Email.find().sort('-_id');
});


router.delete('/:id',async(req, res) => {
    const email = await Email.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!email) return res.status(404).send(`Email with ID: ${reqId} was not found!`);
    res.send(email);
});

module.exports = router;
