const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
});

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
