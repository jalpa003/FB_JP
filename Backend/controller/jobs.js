const JobPost = require('../models/jobs');

module.exports.createJobPosting = async (req, res) => {
    try {
        // Get user ID from the token
        const userId = req.user.id;

        // Create a new job posting
        const newJob = new JobPost({
            user: userId,
            ...req.body, // Use the request body to populate the job fields
        });

        const saveJob = await newJob.save();
        if (!saveJob) throw Error("Failed to create a job posting");
        res.status(201).json({ message: 'Job posted successfully' });
    }
    catch (error) {
        console.error(error);
        handleRegistrationError(error, res);
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