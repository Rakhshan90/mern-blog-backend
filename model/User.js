const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//schema 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    profilePhoto:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    bio:{
        type: String,
    },
    email:{
        type: String,
        required: [true, "email is required"],
    },
    password:{
        type: String,
        required : [true, "password is required"],
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    postCount:{
        type: Number,
        default: 0,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Blogger'],
    },
    isFollowing:{
        type: Boolean,
        default: false,
    },
    isUnFollowing:{
        type: Boolean,
        default: false,
    },
    isAccountVerified:{
        type: Boolean,
        default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    followers:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    following:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    active:{
        type: Boolean,
        default: false,
    },
},
    {
        toJSON: {
          virtuals: true,
        },
        toObject: {
          virtuals: true,
        },
        timestamps: true,
      }
);

//Hash password
userSchema.pre('save', async function(next){
    if (!this.isModified("password")) {
        next();
    }
    //hash password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

//Match password
userSchema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


//compile schema into model
const User = mongoose.model('User', userSchema);
module.exports = User;