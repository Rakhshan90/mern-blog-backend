const expressAsyncHandler = require("express-async-handler");
const Category = require("../model/Category");

//create category
const createCategoryCtrl = expressAsyncHandler(async (req, res)=>{
    try {
        const category = await Category.create({
            user: req.user._id,
            title: req.body.title,
        })
        res.json(category);
    } catch (error) {
        res.json(error);
    }
})

//fetch all categories
// const categoriesCtrl = expressAsyncHandler(async (req, res)=>{
//     res.json("categories");
// })


module.exports = {createCategoryCtrl};