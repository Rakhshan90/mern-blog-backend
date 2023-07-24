const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createCategoryCtrl, fetchAllCategoriesCtrl, fetchCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } = require('../controller/categoryCtrl');
const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, createCategoryCtrl);
categoryRouter.get('/', authMiddleware, fetchAllCategoriesCtrl);
categoryRouter.get('/:id', authMiddleware, fetchCategoryCtrl);
categoryRouter.put('/:id', authMiddleware, updateCategoryCtrl);
categoryRouter.delete('/:id', authMiddleware, deleteCategoryCtrl);

module.exports = categoryRouter;