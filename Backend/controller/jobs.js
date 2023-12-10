const JobPost = require('../models/jobs');
module.exports.createJobPosting = async (req, res) => {
    try {
        // Get user ID from the token
        const userId = req.user.id;

        // Create a new job posting
        const newJob = new JobPost({
            user: userId,
            ...req.body,
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

//get all job posting by employer id
module.exports.getAllJobsByEmployerID = async (req, res) => {
    try {
        const jobs = await JobPost.find({ user: req.user.id });
        if (!jobs) throw Error("No jobs found");
        res.status(200).json({ jobs: jobs });
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
    }
};

//get single job post by id
module.exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Return the job
        res.status(200).json({ job });
    } catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message });
    }
};

//edit job posting by id
module.exports.editJobByID = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const updatedJob = req.body;
        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Check if the logged-in user is the owner of the job
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this job' });
        }
        const updatedJobPost = await JobPost.findByIdAndUpdate(jobId,
            updatedJob, { new: true });
        if (!updatedJobPost) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({message: "Job updated successfully"});
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
    }
};

//delete job 
module.exports.deleteJobByID = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the logged-in user is the owner of the job
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this job' });
        }

        const deletedJob = await JobPost.deleteOne({ _id: jobId });
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Deleted Successfully!" });
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
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