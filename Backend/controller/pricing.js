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
        // Retrieve pricing details from your database based on the priceId
        const priceId = await determinePriceId(selectedPlan);

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