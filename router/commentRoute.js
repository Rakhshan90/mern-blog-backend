const express = require('express');
const { createCommentCtrl, fetchCommentsCtrl, fetchCommentCtrl, updateCommentCtrl, deletePostCtrl } = require('../controller/commentCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const commentRouter = express.Router();

commentRouter.post('/', authMiddleware, createCommentCtrl);
commentRouter.get('/',authMiddleware, fetchCommentsCtrl);
commentRouter.get('/:id',authMiddleware, fetchCommentCtrl);
commentRouter.put('/:id',authMiddleware, updateCommentCtrl);
commentRouter.delete('/:id',authMiddleware, deletePostCtrl);
module.exports = commentRouter;