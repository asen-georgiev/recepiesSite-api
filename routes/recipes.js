const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {Recipe, validateRecipe} = require("../models/recipe");


//Creating single Recipe object - admin rights only
router.post('/',async(req, res) => {
    const {error} = validateRecipe(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let recipe = await Recipe.findOne({recipeTitle: req.body.recipeTitle});
    const reqRecipeTitle = req.body.recipeTitle;
    if(recipe) return res.status(409).send(`Recipe with title ${reqRecipeTitle} already exists!`);

    recipe = new Recipe(req.body);
    await recipe.save();
    res.send(recipe);
})



//Retrieving all the Recipes objects from the DB - no token needed
router.get('/', async(req, res) => {
    const recipes = await Recipe.find().sort('recipeDate');
    res.send(recipes);
})



//Retrieving single Recipe object from the DB - no token needed;
router.get('/:id', async(req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe) return res.status(404).send('Recipe with the given ID was not found');
    res.send(recipe);
})



//Updating single Recipe object - admin rights only
router.put('/;id',async(req, res) => {
    const{error} = validateRecipe(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const recipe = await Recipe.findByIdAndUpdate(req.params.id,{
        recipeTitle: req.body.recipeTitle,
        recipeText: req.body.recipeText,
        recipeType: req.body.recipeType,
        recipePictures: req.body.recipePictures,
        recipeProducts: req.body.recipeProducts
    },{new:true});

    if(!recipe) return res.status(404).send('Recipe with the given ID was not found!');
})



//Deleting single Recipe object - admin rights only
router.delete('/:id',async(req, res) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    let reqRecipeId = req.params.id;
    if(!recipe) return res.status(404).send(`Recipe with ID ${reqRecipeId} was not found!`);
    res.send(recipe);
})


module.exports = router;
