const Candidate = require('../models/candidates');
const User = require('../models/users');

module.exports.completeCandidateProfile = async (req, res) => {
    const { headline, phone, showPhoneToEmployers, address, willingToRelocate, resume, profilePicture, distance, jobTraining, experienceLevel, languageSkills } = req.body;
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