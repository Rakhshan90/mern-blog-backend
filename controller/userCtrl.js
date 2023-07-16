const nodemailer = require("nodemailer");
const { generateToken } = require('../config/token/generateToken');
const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const validateMongoId = require('../util/validateMongoId');
const crypto = require('crypto');

// --------------------------------------//
//          --- Register --- //
// --------------------------------------//
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
    // ---   business logic ---//

    //check if user already registered
    const userExists = await User.findOne({ email: req?.body?.email })
    if (userExists) throw new Error("User Already registered");
    try {
        const user = await User.create({
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            password: req?.body?.password
        })
        res.json(user);
    } catch (err) {
        res.json(err);
    }
    // res.json({user: "User registered"});
});

// --------------------------------------//
//          --- Login --- //
// --------------------------------------//
const userLoginCtrl = expressAsyncHandler(async (req, res) => {
    //Destructuring email and password 
    const { email, password } = req.body;
    //check if user is exist
    const userFound = await User.findOne({ email })

    //check if user's password exist
    if (userFound && (await userFound.isPasswordMatch(password))) {
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
    else {
        res.status(401)
        throw new Error("Invalid Login Credentials");
    }


})


// --------------------------------------//
//          --- Fetch all users --- //
// --------------------------------------//
const usersFetchCtrl = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.json(err);
    }
})

// --------------------------------------//
//          --- Delete user --- //
// --------------------------------------//
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid or not
    validateMongoId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser)
    } catch (err) {
        res.json(err);
    }
});

// --------------------------------------//
//          --- Fetch user details ---   //
// --------------------------------------//
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid or not
    validateMongoId(id);
    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (err) {
        res.json(err);
    }
})

// --------------------------------------//
//          --- user profile --- //
// --------------------------------------//
const profilePhotoCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid or not
    validateMongoId(id);
    try {
        const profile = await User.findById(id);
        res.json(profile);
    } catch (err) {
        res.json(err);
    }
})

// --------------------------------------//
//          --- update user --- //
// --------------------------------------//
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
    // console.log(req.user);
    const { _id } = req?.user;
    //check if user id is valid or not
    validateMongoId(_id);
    const UpdatedUser = await User.findByIdAndUpdate(_id, {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
    },
        { new: true, runValidators: true });

    res.json(UpdatedUser);
});


// --------------------------------------//
//          --- update user password --- //
// --------------------------------------//
const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
    //destructure login user from req object
    const { _id } = req.user;
    console.log(_id);
    //check if user id is valid or not
    validateMongoId(_id);
    //destructure input password from req.body
    const { password } = req.body;
    //find user by _id
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    else {
        res.json(user);
    }

});

// --------------------------------------//
//      ---     Following User       --- //
// --------------------------------------//
const followingUserCtrl = expressAsyncHandler(async (req, res) => {
    //1. Find user that you want to follow and update its followers field.
    //2. Find login user and update its following field.
    const { followId } = req.body;
    const loginUserId = req.user.id;

    //Find the target user and check if the login id already exists
    const targetUser = await User.findById(followId);
    const alreadyFollowingUser = targetUser?.followers?.find(user =>
        user?.toString() === loginUserId.toString());
    if (alreadyFollowingUser) throw new Error("You have already followed this user")

    //1. Find user that you want to follow and update its followers field.
    await User.findByIdAndUpdate(
        followId,
        {
            $push: { followers: loginUserId },
            isFollowing: true,
        },
        { new: true })

    //2. Find login user and update its following field.
    await User.findByIdAndUpdate(
        loginUserId,
        {
            $push: { following: followId },
        },
        { new: true })

    res.json("You have successfully followed this user");
})

// --------------------------------------//
//      ---     Unfollowing User     --- //
// --------------------------------------//
const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
    const { unFollowId } = req.body;
    const loginUserId = req.user.id;

    await User.findByIdAndUpdate(
        unFollowId,
        {
            $pull: { followers: loginUserId },
            isFollowing: false,
        },
        { new: true });

    await User.findByIdAndUpdate(
        loginUserId,
        {
            $pull: { following: unFollowId },
        },
        { new: true });
    res.json("You have successfully unfollowed this user");
})

// --------------------------------------//
//      ---       Block User         --- //
// --------------------------------------//
const blockUserCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    const user = await User.findByIdAndUpdate(
        id,
        {
            isBlocked: true,
        },
        { new: true });
    res.json(user);
})
// --------------------------------------//
//      ---      unBlock User        --- //
// --------------------------------------//
const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    const user = await User.findByIdAndUpdate(
        id,
        {
            isBlocked: false,
        },
        { new: true });
    res.json(user);
})

// ------------------------------------------//
// --- Generate Email verification token --- //
// ------------------------------------------//

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
    const loginUser = req.user.id;
    const user = await User.findById(loginUser);
    console.log(user);
    try {
        //generate token
        const verificationToken = await user?.createAccountVerificationToken();
        //save user
        await user.save();
        console.log(verificationToken);
        //Build your message
        const resetURL = `If your were requested to verify your account, please verify your account within 10 mins, otherwise ignore this meassage <a href="https://localhost:3000/verify-account/${verificationToken}">Click to verify your account<a/>`;
        const testAccount = await nodemailer.createTestAccount();
        const transporter = await nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'maye.pfeffer@ethereal.email',
                pass: '3nK3e65pYUydrcPFPb'
            }
        });
        const info = await transporter.sendMail({
            from: '"Rakhshan ahmad" <ha8740650@gmail.com>', // sender address
            to: "ha8740650@bbdnitm.ac.in", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: resetURL, // html body
        });
        console.log("Message sent: %s", info.messageId);
        res.json(resetURL);
    } catch (err) {
        res.json(err);
    }

});

// ------------------------------------------//
// ---  Account verification --- //
// ------------------------------------------//
const accountVerificationCtrl = expressAsyncHandler(async (req, res)=>{
    const {token} = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log(hashedToken);

    //find this user by token
    const foundUser = await User.findOne({
        accountVerificationToken: hashedToken,
        accountVerificationTokenExpires: {$gt: new Date()},
    });
    if(!foundUser) throw new Error("Token is expired, try again later");
    //set the property
    foundUser.isAccountVerified = true;
    foundUser.accountVerificationToken = undefined;
    foundUser.accountVerificationTokenExpires = undefined;
    await foundUser.save();
    res.json(foundUser);
})

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    usersFetchCtrl,
    deleteUserCtrl,
    fetchUserDetailsCtrl,
    profilePhotoCtrl,
    updateUserCtrl,
    updateUserPasswordCtrl,
    followingUserCtrl,
    unfollowUserCtrl,
    blockUserCtrl,
    unBlockUserCtrl,
    generateVerificationTokenCtrl,
    accountVerificationCtrl,
};