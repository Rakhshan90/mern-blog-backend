const Post = require("../model/Post");
const Filter = require('bad-words');
const fs = require('fs');
const expressAsyncHandler = require('express-async-handler');
const validateMongoId = require("../util/validateMongoId");
const User = require("../model/User");
const cloudinaryUploadImg = require("../util/cloudinary");


// --------------------------------------//
//          ---   Creating Post      --- //
// --------------------------------------//
const createPostCtrl = expressAsyncHandler(async (req, res) => {
    console.log(req.file);
    const { _id } = req.user;
    // const user = req.body.user;
    // validateMongoId(user);
    const filter = new Filter();
    const profaneTitle = filter.isProfane(req.body.title);
    const profaneDescription = filter.isProfane(req.body.description);
    // console.log({profaneTitle, profaneDescription});
    if (profaneTitle || profaneDescription) {
        await User.findByIdAndUpdate(_id,
            {
                isBlocked: true,
            });
        throw new Error("Creating post failed because it contains profane words and you have been blocked");
    }
    //Get the path to img
    const localpath = `public/images/posts/${req.file.filename}`;

    //upload to cloudinary 
    const imgUpload = await cloudinaryUploadImg(localpath);
    try {
        // const post = await Post.create({
        //     ...req.body,
        //     image: imgUpload?.url,
        //     user: _id,
        // });
        res.json(imgUpload);
        //remove uploaded image 
        fs.unlinkSync(localpath);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//        ---   Fetch all Posts      --- //
// --------------------------------------//
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user')
        res.json(posts);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---   Fetch Post details      --- //
// --------------------------------------//
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoId(id);
    try {
        const post = await Post.findById(id).populate('user');
        //update number of views on post
        await Post.findByIdAndUpdate(id,
            {
                $inc: {numOfViews: 1},
            }, {new: true}
        )
        res.json(post);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---      Update Post          --- //
// --------------------------------------//
const updatePostCtrl = expressAsyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongoId(id);
    try {
        const updatedPost = await Post.findByIdAndUpdate(id, 
            {
                ...req.body,
                user: req.user?._id,
            }, 
            {new: true})
        res.json(updatedPost);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---      Update Post          --- //
// --------------------------------------//
const deletePostCtrl = expressAsyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongoId(id);
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        res.json(deletedPost);
    } catch (error) {
        res.json(error);   
    }
})


module.exports =
{
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl,
}