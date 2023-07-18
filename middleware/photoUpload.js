const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb)=>{
    //check file type
    if(file.mimetype.startsWith("image")){
        cb(null, true);
    }
    else{
        //rejected
        cb({message: "unsupported file format"}, false);
    }
};

const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 1000000}
})


//image resizing
const profilePhotoResize  = async(req, res, next)=>{
    //check if there is no file exist
    if(!req.file) return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    console.log("Resizing", req.file);

    await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(path.join(`public/images/${req.file.filename}`));
    next();
};

module.exports = {photoUpload, profilePhotoResize };