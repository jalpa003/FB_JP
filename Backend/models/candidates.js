const mongoose = require('mongoose');

const candidateProfile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
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
    showPhoneToEmployers: {
        type: Boolean,
        default: true
    },
    address: String,
    willingToRelocate: {
        type: Boolean,
        default: false
    },
    resume: String,
    profilePicture: String,
    distance: {
        type: Number,
        min: [0, 'Distance should be a non-negative value'],
        default: 0
    },
    jobTraining: [String],
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Principal'],
    },
    languageSkills: [String],
}, { timestamps: true });

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfile);

module.exports = CandidateProfile;
