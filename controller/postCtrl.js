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
    const { _id } = req.user;
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
        const post = await Post.create({
            ...req.body,
            image: imgUpload?.url,
            user: _id,
        });
        res.json(post);
        //remove uploaded image from backend not cloudinary
        fs.unlinkSync(localpath);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//        ---   Fetch all Posts      --- //
// --------------------------------------//
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
    const hasCategory = req.query.category
    try {
        if(hasCategory){
            const posts = await Post.find({category:hasCategory}).populate('user')
            .populate('comments')
            res.json(posts);
        }
        else{
            const posts = await Post.find({}).populate('user').populate('comments')
            res.json(posts);
        }
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---   Fetch Post details      --- //
// --------------------------------------//
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const post = await Post.findById(id).populate('user').populate('dislikes').populate('likes').populate('comments');
        //update number of views on post
        await Post.findByIdAndUpdate(id,
            {
                $inc: { numOfViews: 1 },
            }, { new: true }
        )
        res.json(post);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---      Update Post          --- //
// --------------------------------------//
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const updatedPost = await Post.findByIdAndUpdate(id,
            {
                ...req.body,
                user: req.user?._id,
            },
            { new: true })
        res.json(updatedPost);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---      Delete Post          --- //
// --------------------------------------//
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        res.json(deletedPost);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//     ---      Like to Post         --- //
// --------------------------------------//
const likeToPostCtrl = expressAsyncHandler(async (req, res) => {
    //1. find post that user want to like
    const { postId } = req.body;
    const post = await Post.findById(postId);
    //2. find login user
    const loginUserId = req?.user?._id;
    //3. find is this user has liked this post?
    const isLiked = post?.isLiked
    //4. check if this user has disliked this post
    const alreadyDisliked = post?.dislikes?.find(
        userId => userId?.toString() === loginUserId?.toString()
    );
    //5. remove the user from dislikes array if exists
    if (alreadyDisliked) {
        const post = await Post.findByIdAndUpdate(postId,
            {
                $pull: { dislikes: loginUserId },
                isDisLiked: false,
            },
            { new: true })
        res.json(post);
    }
    //toggle
    //6. remove the user if he has already liked the post
    if (isLiked) {
        const post = await Post.findByIdAndUpdate(postId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true })
        res.json(post);
    }
    else {
        //add to likes
        const post = await Post.findByIdAndUpdate(postId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true })
        res.json(post);
    }
});

// --------------------------------------//
//     ---      dislike to Post      --- //
// --------------------------------------//
const dislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
    //1. find the post that user want to dislike
    const { postId } = req.body;
    const post = await Post.findById(postId);
    //2. find the user
    const loginUserId = req?.user?._id;
    //3. find is this user has disliked this post?
    const isDisLiked = post?.isDisLiked
    //4. check if this user has liked this post
    const alreadyLiked = post?.likes?.find(
        userId => userId?.toString() === loginUserId?.toString()
    )
    //5. remove this user from likes array if exists
    if (alreadyLiked) {
        const post = await Post.findByIdAndUpdate(postId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            }, {new: true})
        res.json(post);
    }
    //toggle
    //6. remove the user if he has already disliked the post
    if(isDisLiked){
        const post = await Post.findByIdAndUpdate(postId, 
            {
                $pull: {dislikes: loginUserId},
                isDisLiked: false,
            }, {new: true})
        res.json(post);
    }
    else{
        const post = await Post.findByIdAndUpdate(postId, 
            {
                $push: {dislikes: loginUserId},
                isDisLiked: true,
            }, {new: true})
        res.json(post);
    }

});

module.exports =
{
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl,
    likeToPostCtrl,
    dislikeToPostCtrl,
}
