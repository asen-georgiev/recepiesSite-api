const express = require('express');
const router = express.Router();
const multer = require("multer");
const{Upload,getImagesFromDirectory} = require('../models/image');


//Post request for uploading images to Gallery folder - no token needed
//In this case we will make it with authorization
router.post('/',(req, res) => {
    Upload(req,res,function(err){
        if(err instanceof multer.MulterError){
            return res.status(500).json(err);
        } else if (err){
            return res.status(500).json(err);
        }
        return res.status(200).send(req.file);
    });
})

//retrieving all the Images from gallery - admin rights only
router.get('/',(req, res) => {
    let images = getImagesFromDirectory('gallery');
    res.send(images);
})

module.exports = router;
