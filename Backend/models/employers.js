const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    companyName: String,
    numberOfEmployees: String,
    fAndBIndustry: String,
    companyDescription: String,
    streetAddress: String,

}, { timestamps: true });

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

module.exports = EmployerProfile;
