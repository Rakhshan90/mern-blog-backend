const express = require('express');
const { createPostCtrl, fetchPostsCtrl, fetchPostCtrl, updatePostCtrl, deletePostCtrl, likeToPostCtrl, dislikeToPostCtrl } = require('../controller/postCtrl');
const authMiddleware = require('../middleware/authMiddleware');
const { photoUpload } = require('../middleware/photoUpload');

const postRouter = express.Router();

postRouter.post('/', 
authMiddleware, 
photoUpload.single('image'),
createPostCtrl);

postRouter.put('/like', authMiddleware ,likeToPostCtrl);
postRouter.put('/dislike', authMiddleware ,dislikeToPostCtrl);
postRouter.get('/', fetchPostsCtrl);
postRouter.get('/:id', fetchPostCtrl);
postRouter.put('/:id', authMiddleware, updatePostCtrl);
postRouter.delete('/:id', authMiddleware, deletePostCtrl);








module.exports = postRouter;