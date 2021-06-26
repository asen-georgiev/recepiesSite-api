const express = require("express");
const router = express.Router();
const _ = require('lodash');
const {Comment, validateComment} = require('../models/comment')
const {User} = require('../models/user')


router.post('/', async (req, res) => {
    const {error} = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send('There is no registered User with the given ID');

    let comment = new Comment({
        commentText: req.body.commentText,
        user: {
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            userPassword: user.userPassword,
            userPicture: user.userPicture,
            userAddress: user.userAddress,
            userTelephone: user.userTelephone
        },
        recipeId: req.body.recipeId
    });
    await comment.save();
    res.send(_.pick(comment, ['commentText', 'user.userName', 'user.userPicture', 'recipeId']));
})

//Retrieving all the comments by Recie ID
router.get('/by-recipe/:id', async (req, res) => {
    const comments = await Comment.find({recipeId: req.params.id});
    let reqRecipeId = req.params.id;
    if (!comments) return res.status(404).send(`There are NO comments for Recipe with ID: ${reqRecipeId}`);
    res.send(comments);
})


//Retrievind all comments by User ID - user rights only.
router.get('/by-user/:id', async (req, res) => {
    const comments = await Comment.find({"user._id": req.params.id});
    let reqUserId = req.params.id;
    if (!comments) return res.status(404).send(`There are NO comments from User with ID: ${reqUserId}`);
    res.send(comments);
})


//Retrieving all the Comment objects from the DB - admin rights only.
router.get('/', async (req, res) => {
    const comments = await Comment.find().sort('recipeId');
    res.send(comments);
})


//Deleting single Comment object - authorization only.
router.delete('/:id', async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    let reqCommentId = req.params.id;
    if (!comment) return res.status(404).send(`Comment with ID: ${reqCommentId} was not found!`);
    res.send(comment);
})


//Updating single Comment - authorization only.
router.put('/:id', async (req, res) => {
    const {error} = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await Comment.findByIdAndUpdate(req.params.id, {
        commentText: req.body.commentText,
        user: {
            _id: req.body.user._id,
            userName: req.body.user.userName,
            userEmail: req.body.user.userEmail,
            userPassword: req.body.user.userPassword,
            userPicture: req.body.user.userPicture,
            userAddress: req.body.user.userAddress,
            userTelephone: req.body.user.userTelephone
        },
        recipeId: req.body.recipeId
    }, {new: true});

    if (!comment) return res.status(404).send('Comment with the given ID was not found!');
})


module.exports = router;
