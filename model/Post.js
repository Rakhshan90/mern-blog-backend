const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Post category is required'],
        },
        isLiked: {
            type: Boolean,
            default: false,
        },
        isDisLiked: {
            type: Boolean,
            default: false,
        },
        numOfViews: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Author is required"],
        },
        description: {
            type: String,
            // required: [true, "Post Description is required"],
        },
        image: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2023/01/01/09/30/lonely-7689797_1280.jpg",
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

//compile schema into model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;