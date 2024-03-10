const JobApplication = require('../models/jobApplication');
const Candidate = require('../models/candidates');
const User = require('../models/users');
const Job = require('../models/jobs');
const path = require('path');
const fs = require('fs');

module.exports.createJobApplication = async (req, res) => {
    const { jobId } = req.body;
    const additionalQuestionsResponses = JSON.parse(req.body.additionalQuestionsResponses);
    const applicantId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(applicantId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the candidate profile exists
        const candidateProfile = await Candidate.findOne({ user: applicantId });
        if (!candidateProfile) {
            return res.status(400).json({ message: 'Candidate profile does not exist' });
        }

        // Check if jobId is provided
        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required for job application' });
        }

        // Check if the user has already applied for this job
        const existingApplication = await JobApplication.findOne({
            applicant: applicantId,
            job: jobId,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Handle resume upload with async/await
        const newResumeFilename = req.files?.["resume"]?.[0]?.filename || "";
        // if (!newResumeFilename) {
        //     return res.status(400).json({ message: 'Resume is required for job application' });
        // }

        // If there's an existing resume, delete it from the uploads directory
        if (candidateProfile.resume) {
            const currentResumePath = path.join(__dirname, '../uploads/resumes', candidateProfile.resume);
            await fs.unlinkSync(currentResumePath);
        }

        // Update the candidate profile with the new resume filename
        candidateProfile.resume = newResumeFilename;
        await candidateProfile.save();

        // Create a new job application
        const jobApplication = new JobApplication({
            applicant: applicantId,
            job: jobId,
            resume: newResumeFilename,
            additionalQuestionsResponses: additionalQuestionsResponses,
        });

        // Save the job application to the database
        const savedApplication = await jobApplication.save();

        // Add the applicant to the appliedUsers field in the corresponding job
        await Job.findByIdAndUpdate(jobId, { $push: { appliedUsers: applicantId } });

        res.status(201).json({ message: 'Job application submitted successfully', application: savedApplication });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error applying for the job' });
    }
}