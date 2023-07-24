const expressAsyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
const Filter = require('bad-words');
const EmailMsg = require("../model/EmailMessaging");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
    const {to, subject, message} = req.body;
    //get message 
    const emailMsg = subject + " " + message;
    //prevent profane/bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(emailMsg);
    if(isProfane){
        throw new Error('Message sent failed, because it contains profane/bad words');
    }
    try {
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });
    
        //build message
        const msg = {
            from: process.env.EMAIL, // sender address
            to, // list of receivers
            subject, // Subject line
            text: message, // plain text body
        }

        await transporter.sendMail(msg);

        //save email to db
        await EmailMsg.create({
            sentBy: req?.user?._id,
            from: req?.user?.email,
            to,
            subject,
            message,
        });
        res.json('email sent');
    } catch (error) {
        res.json(error);
    }
})

module.exports = sendEmailMsgCtrl;