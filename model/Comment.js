const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: [true, "Post is required"],
    },
    user:{
        type: Object,
        required: [true, "User is required"],
    },
    description:{
        type: String,
        required: [true, "Comment Description is required"],
    }
}, 
{
    timestamps: true,
})

//compile comment schema into model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;