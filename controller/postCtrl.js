const Post = require("../model/Post");
const expressAsyncHandler = require('express-async-handler');
const validateMongoId = require("../util/validateMongoId");


// --------------------------------------//
//          ---   Creating Post      --- //
// --------------------------------------//
const createPostCtrl = expressAsyncHandler( async(req, res)=>{
    const user = req.body.user;
    validateMongoId(user);
    try {
        const post = await Post.create(req.body);
        res.json(post);
    } catch (error) {
        res.json(error);
    }
    
    
})

module.exports = {createPostCtrl}