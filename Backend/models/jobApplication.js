const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    additionalQuestionsResponses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdditionalQuestion'
        },
        response: {
            type: String,
            enum: ['Yes', 'No'],
            required: true
        }
    }]
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
