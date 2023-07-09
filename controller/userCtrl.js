const { generateToken } = require('../config/token/generateToken');
const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const validateMongoId  = require('../util/validateMongoId');

// --------------------------------------//
//          --- Register --- //
// --------------------------------------//


const userRegisterCtrl = expressAsyncHandler(async(req, res)=>{
    // ---   business logic ---//

    //check if user already registered
    const userExists = await User.findOne({email : req?.body?.email})
    if(userExists) throw new Error("User Already registered");
    try{
        const user = await User.create({
            firstName : req?.body?.firstName,
            lastName : req?.body?.lastName,
            email : req?.body?.email,
            password : req?.body?.password
        })
        res.json(user);
    }catch(err){
        res.json(err);
    }
    // res.json({user: "User registered"});
});

// --------------------------------------//
//          --- Login --- //
// --------------------------------------//
const userLoginCtrl = expressAsyncHandler( async(req, res)=>{
    //Destructuring email and password 
    const{email, password} = req.body;
    //check if user is exist
    const userFound = await User.findOne({email})

    //check if user's password exist
    if(userFound && (await userFound.isPasswordMatch(password))){
        res.json({
            _id: userFound?._id,
            firstName: userFound?.firstName,
            lastName: userFound?.lastName,
            email: userFound?.email,
            profilePhoto: userFound?.profilePhoto,
            isAdmin: userFound?.isAdmin,
            token: generateToken(userFound?._id),
        });
    }
    else{
        res.status(401)
        throw new Error("Invalid Login Credentials");
    }


})


// --------------------------------------//
//          --- Fetch all users --- //
// --------------------------------------//
const usersFetchCtrl = expressAsyncHandler(async(req, res)=>{
    try{
        const users = await User.find({});
        res.json(users);
    }catch(err){
        res.json(err);
    }
})

// --------------------------------------//
//          --- Delete user --- //
// --------------------------------------//
const deleteUserCtrl = expressAsyncHandler(async(req, res)=>{
    const {userId} = req.params;
    //check if user id is valid or not
    validateMongoId(userId);
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        res.json(deletedUser)
    }catch(err){
        res.json(err);
    }
});


module.exports = {
    userRegisterCtrl, 
    userLoginCtrl, 
    usersFetchCtrl, 
    deleteUserCtrl
};