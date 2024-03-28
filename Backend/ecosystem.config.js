module.exports = {
    apps: [
        {
            name: "backend",
            script: "server.js",
            watch: true,
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        },
        {
            name: "jobPostDurationCron",
            script: "middleware/jobPostDurationCron.js",
            watch: true,
            cron_restart: "0 0 * * *", // Run the cron job every day at midnight
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
};