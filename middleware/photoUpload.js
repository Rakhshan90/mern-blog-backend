const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb)=>{
    //check file type
    if(file.mimetype.startsWith("image")){
        //continue asynchronous operation of multer middleware 
        //cb -> callback
        cb(null, true);
    }
    else{
        //rejected
        //cb -> callback
        cb({message: "unsupported file format"}, false);
    }
};

const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 1000000}
})


//Profile photo resizing
const profilePhotoResize  = async(req, res, next)=>{
    //check if there is no file exist
    if(!req.file) return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    // console.log("Resizing", req.file);

    await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(path.join(`public/images/profiles/${req.file.filename}`));
    next();
};

//post image resizing
const postImgResize  = async(req, res, next)=>{
    //check if there is no file exist
    if(!req.file) return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    // console.log("Resizing", req.file);

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(path.join(`public/images/posts/${req.file.filename}`));
    next();
};

module.exports = {photoUpload, profilePhotoResize, postImgResize };