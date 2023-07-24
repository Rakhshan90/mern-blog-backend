const express = require('express');
const createCategoryCtrl = require('../controller/categoryCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, createCategoryCtrl);

module.exports = categoryRouter;