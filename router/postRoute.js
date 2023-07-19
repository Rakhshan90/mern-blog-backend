const express = require('express');
const { createPostCtrl } = require('../controller/postCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const postRouter = express.Router();

postRouter.post('/', authMiddleware, createPostCtrl);









module.exports = postRouter;