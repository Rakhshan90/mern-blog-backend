const express = require('express');
const { userRegisterCtrl, userLoginCtrl, usersFetchCtrl, deleteUserCtrl, fetchUserDetailsCtrl, profilePhotoCtrl, updateUserCtrl, updateUserPasswordCtrl } = require('../controller/userCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const usersRouter = express.Router();


usersRouter.post('/register', userRegisterCtrl);
usersRouter.post('/login', userLoginCtrl);
usersRouter.get('/', authMiddleware, usersFetchCtrl);
usersRouter.put('/password', authMiddleware ,updateUserPasswordCtrl);
usersRouter.get('/profile/:id',authMiddleware ,profilePhotoCtrl);
usersRouter.put('/:id', authMiddleware ,updateUserCtrl);
usersRouter.delete('/:id', deleteUserCtrl);
usersRouter.get('/:id', fetchUserDetailsCtrl);


module.exports = usersRouter;