const express = require('express');
const dbConnect = require('./config/db/dbConnect');
const dotenv = require('dotenv');
const { userRegisterCtrl, userLoginCtrl } = require('./controller/userCtrl');
const usersRouter = require('./router/usersRoute');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const postRouter = require('./router/postRoute');

dotenv.config();
const app = express(); 

//Db connect 
dbConnect()

/*
This express middleware is responsible for parsing the incoming json data into req.body .It makes data available to req.body 
*/ 
app.use(express.json());



//User route
app.use('/api/users', usersRouter);

//Post route
app.use('/api/post', postRouter);




//error handler 
app.use(notFound)
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server listening on ${PORT}`))

