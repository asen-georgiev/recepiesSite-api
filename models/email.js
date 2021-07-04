const mongoose = require("mongoose");
const Joi = require("joi");

const emailSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    subject: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10000
    }
})

const Email = mongoose.model('Email', emailSchema);

function validateEmail(email) {
    const schema = Joi.object({
        fullName: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(50).trim(true),
        subject: Joi.string().required().min(5).max(255),
        message: Joi.string().required().min(5).max(1000)
    });
    return schema.validate(email);
}

exports.Email = Email;
exports.validateEmail = validateEmail;
exports.emailSchema = emailSchema;
