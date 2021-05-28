const mongoose = require('mongoose');
const Joi = require('joi');

const recipeSchema = new mongoose.Schema({
    recipeTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    recipeText: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 5000
    },
    recipeType: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    recipePictures: {
        type: [String]
    },
    recipeProducts: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
    },
    recipeDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const Recipe = mongoose.model('Recipe',recipeSchema);

function validateRecipe(recipe){
    const schema = Joi.object({
        recipeTitle: Joi.string().required().min(5).max(100),
        recipeText: Joi.string().required().min(50).max(5000),
        recipeType: Joi.string().required().min(3).max(30),
        recipePictures: Joi.array().items(Joi.string()).allow(''),
        recipeProducts: Joi.string().required().min(5).max(500)
    });
    return schema.validate(recipe);
}

exports.Recipe = Recipe;
exports.validateRecipe = validateRecipe;
exports.recipeSchema = recipeSchema;
