const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImg = async imageBuffer =>{
    try {
        const data = await cloudinary.uploader.upload(imageBuffer,
            {
                resource_type: "auto",
            });
        return {
            url: data?.secure_url,
        };
    } catch (error) {
        return error;
    }
}

module.exports = cloudinaryUploadImg;