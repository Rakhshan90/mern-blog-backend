const expressAsyncHandler = require("express-async-handler");
const Comment = require("../model/Comment");
const validateMongoId = require("../util/validateMongoId");
const blockUser = require("../util/blockUser");


// --------------------------------------//
//       ---   Creating Comment      --- //
// --------------------------------------//
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
    //1. Get login user
    const user = req.user;
    //check if user is bloged make sure user cannot create a new comment
    blockUser(user);
    //2. Get the post and comment description
    const { postId, description } = req.body;
    //3. Now create the comment
    try {
        const comment = await Comment.create({
            post: postId,
            // user: user,
            user,
            // description: description
            description,
        });
        res.json(comment);
    } catch (error) {
        res.json(error);
    }

})

// --------------------------------------//
//       ---   Fetch all Comments    --- //
// --------------------------------------//
const fetchCommentsCtrl = expressAsyncHandler(async (req, res) => {
    try {
        const comments = await Comment.find({}).sort("-created");
        res.json(comments);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//       ---   Fetch single Comment  --- //
// --------------------------------------//
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const comment = await Comment.findById(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }

})

// --------------------------------------//
//       ---  update single Comment  --- //
// --------------------------------------//
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const comment = await Comment.findByIdAndUpdate(id,
            {
                user: req?.user,
                description: req?.body?.description
            },
            { new: true, runValidators: true })
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
})

// --------------------------------------//
//       ---  Delete single Comment  --- //
// --------------------------------------//
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    try {
        const comment = await Comment.findByIdAndDelete(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
})


module.exports =
{
    createCommentCtrl,
    fetchCommentsCtrl,
    fetchCommentCtrl,
    updateCommentCtrl,
    deletePostCtrl,
};