const mongoose = require('mongoose');

const defaultQuestions = [
    "Are you legally eligible to work in Canada?",
    "Are you 18-years of age or older?",
    "Do you have reliable transportation?",
    "How many years of Food & Beverage experience do you have?",
    "Are you available to work evenings and weekends?",
    "Do you have your Food Handler’s Certificate?",
    "Do you have your Smart Serve Certificate?",
    "Have you ever been convicted of a felony related to theft, violence, or drug offenses?",
    "Are you comfortable working in a fast-paced environment?",
    "Have you ever been terminated from a job for misconduct or performance issues?",
    "Are you able to lift heavy objects or stand for long periods?",
    "Do you have experience using POS systems?",
    "Do you have the required qualifications listed in the job ad?",
    "Are you available to start within the timeframe specified?"
];

const additionalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    }
});

const AdditionalQuestions = mongoose.model('AdditionalQuestion', additionalQuestionsSchema);

module.exports = { AdditionalQuestions, defaultQuestions };
