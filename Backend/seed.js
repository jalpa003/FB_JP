const mongoose = require('mongoose');
const seedData = require('./models/seedData');
const Pricing = require('./models/pricing');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        seedDatabase();
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Seed database function
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Pricing.deleteMany();

        // Insert seed data
        await Pricing.insertMany(seedData);

        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed');
    }
};