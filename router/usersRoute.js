const express = require('express');
const { userRegisterCtrl, userLoginCtrl } = require('../controller/userCtrl');

const usersRouter = express.Router();

//Register routes
usersRouter.post('/register', userRegisterCtrl);
usersRouter.post('/login', userLoginCtrl);





module.exports = usersRouter;