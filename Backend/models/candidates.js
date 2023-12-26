const mongoose = require('mongoose');

const candidateProfile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    headline: {
        type: String,
        trim: true,
    },
    desiredJobTitle: {
        type: String,
        trim: true,
    },
    desiredJobType: {
        type: String,
        enum: ['FT', 'PT', 'Temp', 'Apprentice'],
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
    jobTraining: {
        smartServe: {
            type: Boolean,
            default: false
        },
        culinaryTraining: {
            type: Boolean,
            default: false
        },
        redSeal: {
            type: Boolean,
            default: false
        },
        workplaceSafety: {
            type: Boolean,
            default: false
        },
        customerService: {
            type: Boolean,
            default: false
        },
        barTending: {
            type: Boolean,
            default: false
        },
        barista: {
            type: Boolean,
            default: false
        },
        fineDining: {
            type: Boolean,
            default: false
        }
    },
    experienceLevel: {
        type: String,
        enum: ['<1', '1-3', '3-5', '5-7', '7-10', '10+'],
    },
    languageSkills: [String],
}, { timestamps: true });

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfile);

module.exports = CandidateProfile;
