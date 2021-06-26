const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const {userSchema} = require('./user');

const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    commentDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    user: {
        type: userSchema,
        required: true
    },
    recipeId: {
        type: ObjectId,
        required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        commentText: Joi.string().required().min(10).max(1000),
        userId: Joi.objectId().required(),
        recipeId: Joi.objectId().required()
    });
    return schema.validate(comment);
}

exports.Comment = Comment;
exports.validateComment = validateComment;
exports.commentSchema = commentSchema;
