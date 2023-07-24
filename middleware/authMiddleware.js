const expressAsyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const authMiddleware = expressAsyncHandler( async(req, res, next)=>{
    let token;
    //upon any request, check if there is any token 
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]; 
        try {
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                //find the user by id
                const user = await User.findById(decoded?.id).select("-password");
                //Attach user to the request object
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not authorize token expired, Login again");
        }
    }
    else{
        throw new Error("There is no token attached to the header");
    }
})

module.exports = authMiddleware;