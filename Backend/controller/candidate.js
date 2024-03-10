const Candidate = require('../models/candidates');
const User = require('../models/users');
const path = require('path');
const fs = require('fs');

module.exports.completeCandidateProfile = async (req, res) => {
    const { firstName, lastName, password, headline, phone, showPhoneToEmployers, address, willingToRelocate, desiredJobTitle, desiredJobType, desiredSchedule, desiredPayAmount, desiredPayType, distance, jobTraining, experienceLevel, languageSkills } = req.body;
    const userId = req.user.id;
    try {
        // Check if the user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        user.firstName = firstName;
        user.lastName = lastName;

        // Check if a new password is provided
        if (password) {
            user.password = password; // You may want to hash the password before saving
        }

        // Save the updated user details
        user = await user.save();

        // Check if the candidate profile already exists
        let candidateProfile = await Candidate.findOne({ user: userId });

        if (candidateProfile) {
            // Candidate profile already exists, update the details
            candidateProfile.headline = headline;
            candidateProfile.phone = phone;
            candidateProfile.showPhoneToEmployers = showPhoneToEmployers;
            candidateProfile.address = address;
            candidateProfile.willingToRelocate = willingToRelocate;
            candidateProfile.desiredJobType = desiredJobType;
            candidateProfile.desiredJobTitle = desiredJobTitle;
            candidateProfile.desiredSchedule = desiredSchedule;
            candidateProfile.desiredPayAmount = desiredPayAmount;
            candidateProfile.desiredPayType = desiredPayType;
            candidateProfile.distance = distance;
            candidateProfile.jobTraining = jobTraining;
            candidateProfile.experienceLevel = experienceLevel;
            // Check if languageSkills is an array before calling map
            if (Array.isArray(languageSkills)) {
                candidateProfile.languageSkills = languageSkills.map(skill => skill.trim());
            } else {
                candidateProfile.languageSkills = [languageSkills.trim()];
            }
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
                desiredJobTitle,
                desiredJobType,
                desiredSchedule,
                desiredPayAmount,
                desiredPayType,
                distance,
                jobTraining,
                experienceLevel,
                languageSkills: languageSkills.split(',').map(skill => skill.trim()), // Split by comma and trim whitespace
            });

            // Save the new candidate profile
            candidateProfile = await candidateProfile.save();
        }

        // Handle resume upload with async/await
        const resumeUpload = req.files?.["resume"]?.[0]?.filename || "";
        if (resumeUpload) {
            candidateProfile.resume = resumeUpload;
            await candidateProfile.save();
        }

        // Handle profile picture upload with async/await
        const profileUpload = req.files?.["image"]?.[0]?.filename || "";
        if (profileUpload) {
            candidateProfile.profilePicture = profileUpload;
            await candidateProfile.save();
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

module.exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile already exists
        let candidateProfile = await Candidate.findOne({ user: userId });

        // Handle profile picture upload with async/await
        const avatarUpload = req.files?.["image"]?.[0]?.filename || "";
        if (avatarUpload) {
            // If the candidate profile doesn't exist, show error message
            if (!candidateProfile) {
                throw new Error("No candidate profile found");
            }

            candidateProfile.profilePicture = avatarUpload;
            await candidateProfile.save();
        }

        res.status(200).json({ message: 'Profile Picture uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading Profile Picture.' });
    }
};

module.exports.deleteAvatar = async (req, res) => {
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile exists
        const candidateProfile = await Candidate.findOne({ user: userId });
        if (!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Get the avatar file name
        const avatarFileName = candidateProfile.profilePicture;

        // Remove the avatar file
        if (avatarFileName) {
            const avatarPath = path.join(__dirname, `../uploads/images/${avatarFileName}`);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // Update the candidate profile to remove the avatar reference
        candidateProfile.profilePicture = null;
        await candidateProfile.save();

        res.status(200).json({ message: 'Profile Picture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting the avatar' });
    }
};

module.exports.deleteResume = async (req, res) => {
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile exists
        const candidateProfile = await Candidate.findOne({ user: userId });
        if (!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Get the resume filename
        const resumeFileName = candidateProfile.resume;

        // Delete the resume file from the uploads directory
        if (resumeFileName) {
            const resumePath = path.join(__dirname, '../uploads/resumes', resumeFileName);
            await fs.promises.unlink(resumePath);
        }

        // Remove the resume reference from the candidate profile
        candidateProfile.resume = null;
        await candidateProfile.save();

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting the resume' });
    }
};

//upload resume
module.exports.uploadResume = async (req, res) => {
    try {
        // Check if the user is authenticated and get the user ID
        const userId = req.user.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile exists
        const candidateProfile = await Candidate.findOne({ user: userId });
        if (!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Get the current resume filename, if any
        const currentResume = candidateProfile.resume;

        // If there's a current resume, delete it from the uploads directory
        if (currentResume) {
            const currentResumePath = path.join(__dirname, '../uploads/resumes', currentResume);
            fs.unlinkSync(currentResumePath);
        }

        // Update the candidate profile with the new resume filename
        const newResumeFilename = req.files?.["resume"]?.[0]?.filename || "";
        if (newResumeFilename) {
            candidateProfile.resume = newResumeFilename;
            await candidateProfile.save();
        }

        res.status(200).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading the resume' });
    }
}

module.exports.getResume = async (req, res) => {
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile exists
        const candidateProfile = await Candidate.findOne({ user: userId });
        if (!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Get the resume filename from the candidate profile
        const resumeFileName = candidateProfile.resume;

        if (!resumeFileName) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Read the resume file from the uploads directory
        const resumePath = path.join(__dirname, '../uploads/resumes', resumeFileName);
        // Check if the resume file exists
        if (!fs.existsSync(resumePath)) {
            return res.status(404).json({ message: 'Resume file not found' });
        }

        // Send the resume file as a response
        res.sendFile(resumePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving the resume' });
    }
};

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