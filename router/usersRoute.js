const express = require('express');
const { userRegisterCtrl, userLoginCtrl, usersFetchCtrl, deleteUserCtrl } = require('../controller/userCtrl');

const usersRouter = express.Router();

//Register routes
usersRouter.post('/register', userRegisterCtrl);
usersRouter.post('/login', userLoginCtrl);
usersRouter.get('/', usersFetchCtrl);
usersRouter.delete('/:userId', deleteUserCtrl);





module.exports = usersRouter;