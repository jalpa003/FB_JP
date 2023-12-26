const Candidate = require('../models/candidates');
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up storage for profile pictures
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        const fileName = req.body.firstName + '_' + uuidv4() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

// Set up storage for resumes
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        const fileName = req.body.firstName + '_' + uuidv4() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const uploadProfilePicture = multer({
    storage: profilePictureStorage,
}).single('profilePicture');

const uploadResume = multer({
    storage: resumeStorage,
}).single('resume');

module.exports.completeCandidateProfile = async (req, res) => {
    const { headline, phone, showPhoneToEmployers, address, willingToRelocate, desiredJobTitle, desiredJobType, resume, profilePicture, distance, jobTraining, experienceLevel, languageSkills } = req.body;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile already exists
        let candidateProfile = await Candidate.findOne({ user: userId });

        if (candidateProfile) {
            // Candidate profile already exists, update the details
            candidateProfile.headline = headline;
            candidateProfile.phone = phone;
            candidateProfile.showPhoneToEmployers = showPhoneToEmployers;
            candidateProfile.address = address;
            candidateProfile.willingToRelocate = willingToRelocate;
            candidateProfile.resume = resume;
            candidateProfile.desiredJobType = desiredJobType;
            candidateProfile.desiredJobTitle = desiredJobTitle;
            candidateProfile.profilePicture = profilePicture;
            candidateProfile.distance = distance;
            candidateProfile.jobTraining = jobTraining;
            candidateProfile.experienceLevel = experienceLevel;
            candidateProfile.languageSkills = languageSkills;

            // Save the updated candidate profile
            candidateProfile = await candidateProfile.save();
        }
        else {
            // Candidate profile does not exist, create a new one
            candidateProfile = new Candidate({
                user: userId,
                headline,
                phone,
                showPhoneToEmployers,
                address,
                willingToRelocate,
                resume,
                desiredJobTitle,
                desiredJobType,
                profilePicture,
                distance,
                jobTraining,
                experienceLevel,
                languageSkills
            });

            // Save the new candidate profile
            candidateProfile = await candidateProfile.save();
        }

        // Update the user's profile completion status
        user.isProfileComplete = true;

        const userProfile = await user.save();

        if (userProfile) {
            res.status(200).json({ message: 'Candidate profile completed successfully' });
        }
        else {
            res.status(500).json({ message: 'Error completing candidate profile' });
        }
    } catch (error) {
        console.error(error);
        handleRegistrationError(error, res);
    }
};

module.exports.getCandidateById = async (req, res) => {
    try {
        const userId = req.user.id;

        const candidate = await Candidate.findOne({ user: userId }).populate('user');
        if (!candidate) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Candidate not found' });
            }

            // Return user details if employer not found
            const userDetails = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };
            return res.status(200).json({ success: true, userDetails });
        }
        // Merge user details into the employer object
        const candidateWithUserDetails = {
            ...candidate.toObject(),
            ...candidate.user.toObject(),
            user: undefined,
        };

        res.status(200).json({ success: true, candidateWithUserDetails });
    }
    catch (err) {
        console.log(err)
    }
}


function handleRegistrationError(error, res) {
    if (error.name === 'ValidationError') {
        // Extract validation error messages
        const validationErrors = Object.values(error.errors).map((error) => error.message);

        res.status(400).json({ error: 'Validation Error', messages: validationErrors });
    } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}