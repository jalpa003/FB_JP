const Pricing = require('../models/pricing');
const Employer = require('../models/employers');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.getPricingPlans = async (req, res) => {
    try {
        const pricingPlans = await Pricing.find();
        res.json(pricingPlans);
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.createCheckoutSession = async (req, res) => {
    const { selectedPlan } = req.body;

    if (!selectedPlan) {
        return res.status(400).json({ message: 'Missing selectedPlan' });
    }

    try {
        // Determine the priceId, maxJobPostsAllowed, and jobPostDuration based on the selected plan
        const { priceId, maxJobPostsAllowed, jobPostDuration } = await determineSubscriptionDetails(selectedPlan);

        // Check if the customer already exists
        let customer = await stripe.customers.list({
            email: req.user.email,
            limit: 1,
        });

        if (customer.data.length === 0) {
            // Create a new customer if not found
            customer = await stripe.customers.create({
                email: req.user.email,
            });
        } else {
            // Retrieve the existing customer
            customer = customer.data[0];
        }

        // Check if the user is already subscribed to the plan
        const existingSubscription = await stripe.subscriptions.list({
            customer: customer?.id,
            limit: 1,
        });

        if (existingSubscription.data.length > 0) {
            return res.status(400).json({ success: false, message: 'You already have an active subscription. If you need assistance or want to make changes, please contact our support team.' });
        }

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customer?.id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/employer-profile`,
            cancel_url: `${process.env.CLIENT_URL}/***`,
        });

        // Update user profile with subscription details
        await Employer.findOneAndUpdate(
            { user: req.user.id },
            {
                $set: {
                    'subscription.planName': selectedPlan,
                    'subscription.priceId': priceId,
                    'subscription.maxJobPostsAllowed': maxJobPostsAllowed,
                    'subscription.jobPostDuration': jobPostDuration,
                },
            },
            { new: true }
        );
        console.log("selected plan--->", selectedPlan);
        console.log("priceId----->", priceId);

        res.json({ checkoutUrl: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.upgradeSubscription = async (req, res) => {
    try {
        let customer = await stripe.customers.list({
            email: req.user.email,
            limit: 1,
        });
        if (customer.data.length === 0) {
            return res.status(400).json({ success: false, message: 'No customer found.' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customer.data[0].id,
            return_url: `${process.env.CLIENT_URL}/employer-profile`,
        });
        res.json({ success: true, sessionUrl: session.url });
    }
    catch (err) {
        console.log(err);
    }
}

// Helper function to determine priceId based on the selected plan
const determinePriceId = async (selectedPlan) => {
    try {
        // Fetch the list of products from Stripe
        const products = await stripe.products.list();

        // Find the product that matches the selected plan
        const selectedProduct = products.data.find(product => product.name === selectedPlan);

        if (!selectedProduct) {
            throw new Error(`No such product: '${selectedPlan}'`);
        }

        // Fetch the prices from Stripe associated with the selected plan's product
        const prices = await stripe.prices.list({
            product: selectedProduct.id,
            limit: 1,
        });

        // Extract the price ID from the fetched prices
        const priceId = prices.data[0].id;

        return priceId;
    } catch (error) {
        console.error('Error fetching price:', error);
        throw error;
    }
};

// Helper function to determine subscription details based on the selected plan
const determineSubscriptionDetails = async (selectedPlan) => {
    try {
        // Determine subscription details based on the selected plan
        let priceId, maxJobPostsAllowed, jobPostDuration;
        switch (selectedPlan) {
            case 'Free':
                priceId = '';
                maxJobPostsAllowed = 1;
                jobPostDuration = 7;
                break;
            case 'Silver':
                priceId = 'price_1Ot0JUK3He90GfsAJfjEU2Cg';
                maxJobPostsAllowed = 3;
                jobPostDuration = 30;
                break;
            case 'Gold':
                priceId = 'price_1Ot0LeK3He90GfsABiiRN0HW';
                maxJobPostsAllowed = Number.MAX_SAFE_INTEGER;
                jobPostDuration = 90;
                break;
            case 'Platinum':
                priceId = 'price_1Ot0MMK3He90GfsAvbdHjMbA';
                maxJobPostsAllowed = Number.MAX_SAFE_INTEGER;
                jobPostDuration = 365;
                break;
            default:
                throw new Error(`Invalid plan: ${selectedPlan}`);
        }

        return { priceId, maxJobPostsAllowed, jobPostDuration };
    } catch (error) {
        console.error('Error determining subscription details:', error);
        throw error;
    }
};