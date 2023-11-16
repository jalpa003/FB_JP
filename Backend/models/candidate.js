const mongoose = require('mongoose');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const candidateProfile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true, 
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    headline: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    showPhoneToEmployers: Boolean,
    email: {
        type: String,
        required: true,
        trim: true,
        match: [emailRegex, 'Please enter a valid email address'],
    },
    address: String,
    willingToRelocate: Boolean,
    resume: String, // File path or URL
    profilePicture: String, // File path or URL
    distance: {
        type: Number,
        min: [0, 'Distance should be a non-negative value'],
        required: [true, 'Distance is required'],
    },
    jobTraining: [String],
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Principal'],
    },
    languageSkills: [String],
});

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfile);

module.exports = CandidateProfile;
