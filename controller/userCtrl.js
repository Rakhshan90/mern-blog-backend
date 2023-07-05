const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

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









module.exports = {userRegisterCtrl};