const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
        // required: true
    },
    companyName: String,
    numberOfEmployees: String,
    fAndBIndustry: {
        type: String,
        enum: ['Fine Dining', 'Fast Food', 'Cafés', 'Catering', 'Bakeries', 'Pubs and Bars', 'Brewers, Winneries & Distilleries', 'Casual Dining', 'Banquet Facilities'],
        required: true
    },
    companyDescription: String,
    streetAddress: String,
    subscription: {
        planName: {
            type: String,
            enum: ['Free', 'Silver', 'Gold', 'Platinum'],
            default: 'Free',
        },
        priceId: String,
    },
}, { timestamps: true });

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

module.exports = EmployerProfile;
