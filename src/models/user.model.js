const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        minlength: [3, "Fullname must be atleast 3 character"],
        maxlength: [60, "Fullname can not exceed 60 character"],
        trim: true,
    }, 

    email: {
        type: String,
        required: [true, "Email is required"],
        maxlength: [100, "Email length too long"],
        trim: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String, 
    }, 

    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },

    role: {
        type: String,
        enum: ["admin", "user", "creator"],
        default: "user"
    },

    lastLogin: {
        type: Date,
    },

    resetPasswordToken: String, 
    resetPasswordExpire: Date,

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);