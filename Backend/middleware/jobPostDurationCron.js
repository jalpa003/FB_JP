const { MongoClient } = require('mongodb');
require('dotenv').config();
const cron = require('node-cron');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function decrementJobPostDuration() {
    try {
        await client.connect();

        const database = client.db('test');
        const employerCollection = database.collection('employerprofiles');
        const jobCollection = database.collection('jobs');

        // Find employers with jobPostDuration = 0
        const employersWithZeroDuration = await employerCollection.find({ 'subscription.jobPostDuration': 0 }).toArray();

        // Close all jobs posted by employers with jobPostDuration = 0
        for (const employer of employersWithZeroDuration) {
            await jobCollection.updateMany(
                { user: employer.user, status: 'Open' },
                { $set: { status: 'Closed', isClosed: true, closedAt: new Date(), closeReason: 'no_longer_needed' } }
            );
        }

        // Find employers with jobPostDuration > 0
        const employersWithPositiveDuration = await employerCollection.find({ 'subscription.jobPostDuration': { $gt: 0 } }).toArray();

        // Update all jobs posted by employers with jobPostDuration > 0
        for (const employer of employersWithPositiveDuration) {
            await jobCollection.updateMany(
                { user: employer.user, status: 'Closed', isClosed: true, closeReason: 'no_longer_needed' },
                { $set: { status: 'Open', isClosed: false, closedAt: null, closeReason: null } }
            );
        }

        // Decrement jobPostDuration for all employers
        const result = await employerCollection.updateMany(
            { 'subscription.jobPostDuration': { $gt: 0 } },
            { $inc: { 'subscription.jobPostDuration': -1 } }
        );

        console.log(`${result.modifiedCount} documents updated.`);
    } catch (error) {
        console.error('Error decrementing job post durations:', error);
    } finally {
        await client.close();
    }
}

// Schedule the cron job to run every day at midnight (00:00) in Canada time zone
cron.schedule('0 0 * * *', async () => {
    console.log('Running job post duration cron job...');
    await decrementJobPostDuration();
}, {
    timezone: 'America/Toronto'
});