const Pricing = require('../models/pricing');

module.exports.getPricingPlans = async (req, res) => {
    try {
        const pricingPlans = await Pricing.find();
        res.json(pricingPlans);
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}