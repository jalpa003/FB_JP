const mongoose = require('mongoose');
const seedData = require('./models/seedData');
const Pricing = require('./models/pricing');
const { AdditionalQuestions, defaultQuestions } = require('./models/additionalQuestions');
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
        await AdditionalQuestions.deleteMany();
        await Pricing.deleteMany();

        // Map default questions to objects
        const questionsObjects = defaultQuestions.map(question => ({ question }));

        // Insert seed data
        await AdditionalQuestions.insertMany(questionsObjects);
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