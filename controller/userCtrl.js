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
        res.json(userFound);
    }
    else{
        res.status(401)
        throw new Error("Invalid Login Credentials");
    }


})


//


module.exports = {userRegisterCtrl, userLoginCtrl};