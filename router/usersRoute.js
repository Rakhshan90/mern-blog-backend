const express = require('express');
const { userRegisterCtrl, userLoginCtrl, usersFetchCtrl, deleteUserCtrl, fetchUserDetailsCtrl, profilePhotoCtrl, updateUserCtrl, updateUserPasswordCtrl, followingUserCtrl, unfollowUserCtrl, blockUserCtrl, unBlockUserCtrl, generateVerificationTokenCtrl, accountVerificationCtrl, forgotPasswordTokenCtrl, passwordResetCtrl, profilePhotoUploadCtrl } = require('../controller/userCtrl');
const authMiddleware = require('../middleware/authMiddleware');
const {photoUpload, profilePhotoResize } = require('../middleware/photoUpload');

const usersRouter = express.Router();


usersRouter.post('/register', userRegisterCtrl);
usersRouter.post('/login', userLoginCtrl);
usersRouter.put('/profile-photo-upload', 
authMiddleware,
photoUpload.single('image'),
profilePhotoResize,
profilePhotoUploadCtrl);
usersRouter.get('/', authMiddleware, usersFetchCtrl);
//password reset
usersRouter.post('/forgot-password-token', forgotPasswordTokenCtrl);
usersRouter.put('/reset-password', passwordResetCtrl);
usersRouter.put('/password', authMiddleware ,updateUserPasswordCtrl);
usersRouter.put('/follow', authMiddleware ,followingUserCtrl);
//account verification
usersRouter.post('/generate-verify-email-token', authMiddleware,generateVerificationTokenCtrl);
usersRouter.put('/verify-token', authMiddleware, accountVerificationCtrl);
usersRouter.put('/unfollow', authMiddleware ,unfollowUserCtrl);
usersRouter.put('/block-user/:id', authMiddleware ,blockUserCtrl);
usersRouter.put('/unblock-user/:id', authMiddleware ,unBlockUserCtrl);
usersRouter.get('/profile/:id',authMiddleware ,profilePhotoCtrl);
usersRouter.put('/', authMiddleware ,updateUserCtrl);
usersRouter.delete('/:id', deleteUserCtrl);
usersRouter.get('/:id', fetchUserDetailsCtrl);


module.exports = usersRouter;