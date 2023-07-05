const express = require('express');
const { userRegisterCtrl } = require('../controller/userCtrl');

const usersRouter = express.Router();

//Register routes
usersRouter.post('/register', userRegisterCtrl);






module.exports = usersRouter;