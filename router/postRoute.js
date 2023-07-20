const express = require('express');
const { createPostCtrl, fetchPostsCtrl, fetchPostCtrl, updatePostCtrl, deletePostCtrl } = require('../controller/postCtrl');
const authMiddleware = require('../middleware/authMiddleware');
const { photoUpload, postImgResize } = require('../middleware/photoUpload');

const postRouter = express.Router();

postRouter.post('/', 
authMiddleware, 
photoUpload.single('image'),
postImgResize,
createPostCtrl);

postRouter.get('/', fetchPostsCtrl);
postRouter.get('/:id', fetchPostCtrl);
postRouter.put('/:id', authMiddleware, updatePostCtrl);
postRouter.delete('/:id', authMiddleware, deletePostCtrl);








module.exports = postRouter;