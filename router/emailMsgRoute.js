const express = require('express');
const sendEmailMsgCtrl = require('../controller/emailMsgCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const emailMsgRouter = express.Router();

emailMsgRouter.post('/', authMiddleware, sendEmailMsgCtrl);


module.exports = emailMsgRouter;