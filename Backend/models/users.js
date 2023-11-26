const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [emailRegex, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'password must have at least 6 characters'],
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['candidate', 'employer'],
    },
    isProfileComplete: {
        type: Boolean,
        required: true,
        default: false
    },
    confirmationToken: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//encrypt password before saving to db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //skip this middleware if the password is not modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare user password
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}



const User = mongoose.model('User', userSchema);

module.exports = User;
