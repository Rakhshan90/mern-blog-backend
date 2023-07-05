const express = require('express');
const dbConnect = require('./config/db/dbConnect');
const dotenv = require('dotenv');
const { userRegisterCtrl, userLoginCtrl } = require('./controller/userCtrl');
const usersRouter = require('./router/usersRoute');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();
const app = express(); 

//Db connect 
dbConnect()

//middleware fucnction in express.js 
app.use(express.json());


//register
// app.post('/api/users/register', userRegisterCtrl)
app.use('/api/users', usersRouter);

//login
app.post('/api/users/login', (req, res)=>{
    //business logic
    res.send({user: "users logged in"});
})

//get user
app.get('/api/users', (req, res)=>{
    //business logic
    res.send({user: "Fetch all users"});
})



//error handler 
app.use(notFound)
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server listening on ${PORT}`))

