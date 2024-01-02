const JobPost = require('../models/jobs');
module.exports.createJobPosting = async (req, res) => {
    try {
        // Get user ID from the token
        const userId = req.user.id;

        // Create a new job posting
        const newJob = new JobPost({
            user: userId,
            ...req.body,
        });

        const saveJob = await newJob.save();
        if (!saveJob) throw Error("Failed to create a job posting");
        res.status(201).json({ message: 'Job posted successfully' });
    }
    catch (error) {
        console.error(error);
        handleRegistrationError(error, res);
    }
}

//get all job posting by employer id
module.exports.getAllJobsByEmployerID = async (req, res) => {
    try {
        const jobs = await JobPost.find({ user: req.user.id });
        if (!jobs) throw Error("No jobs found");
        res.status(200).json({ jobs: jobs });
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
    }
};

//get single job post by id
module.exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Return the job
        res.status(200).json({ job });
    } catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message });
    }
};

//edit job posting by id
module.exports.editJobByID = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const updatedJob = req.body;
        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Check if the logged-in user is the owner of the job
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this job' });
        }
        const updatedJobPost = await JobPost.findByIdAndUpdate(jobId,
            updatedJob, { new: true });
        if (!updatedJobPost) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
    }
};

//delete job 
module.exports.deleteJobByID = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if the job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the logged-in user is the owner of the job
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this job' });
        }

        const deletedJob = await JobPost.deleteOne({ _id: jobId });
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Deleted Successfully!" });
    }
    catch (error) {
        console.error(error);
        res.send({ statusCode: 500, message: error.message })
    }
};

//close a job
module.exports.closeJob = async (req, res) => {
    const { jobId } = req.params;
    const { closeReason } = req.body;
    try {
        let job = await JobPost.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to close this job' });
        }

        let updateData = {
            isClosed: true,
            closeReason: closeReason || null,
            closedAt: new Date(),
        };

        await JobPost.findByIdAndUpdate(jobId, updateData);
        res.status(200).json({ success: true, message: 'Job closed successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//show all jobs
module.exports.getAllJobs = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let skip = (page - 1) * limit;

        // Define search parameters
        const searchParams = {};

        // Check if there is a job title search query
        if (req.query.jobTitle) {
            searchParams.jobTitle = { $regex: new RegExp(req.query.jobTitle, 'i') };
        }

        // Check if there is a location search query
        if (req.query.jobLocation) {
            searchParams.jobLocation = { $regex: new RegExp(req.query.jobLocation, 'i') };
        }

        // get total count of jobs with search parameters
        const totalCount = await JobPost.countDocuments(searchParams);

        // find the data for pagination with search parameters
        const data = await JobPost.find(searchParams).sort('-createdAt').skip(skip).limit(limit);

        if (data.length === 0) {
            // Return an error response when no matching jobs are found
            return res.status(404).json({ message: "No jobs found with the given search criteria." });
        }

        // prepare meta data for pagination
        const meta = {
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            perPage: limit,
        };
        res.status(200).json({ data, meta });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

//fetch job details by job id
module.exports.getJobDetails = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if jobId is provided in the request
        if (!jobId || jobId === ":jobId") {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Fetch job details based on the jobId
        const jobDetails = await JobPost.findById(jobId);

        if (!jobDetails) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(jobDetails);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).send('Server Error');
    }
}

//search jobs by job title or location or both
module.exports.searchJobs = async (req, res) => {
    try {
        const { jobTitle, jobLocation, page = 1, limit = 10, sortBy, sortOrder } = req.query;

        // Construct the search criteria based on provided parameters
        const searchCriteria = {};
        if (jobTitle) {
            searchCriteria.jobTitle = { $regex: new RegExp(jobTitle, 'i') }; // Case-insensitive search
        }
        if (jobLocation) {
            searchCriteria.jobLocation = { $regex: new RegExp(jobLocation, 'i') };
        }

        // Construct the options for pagination and sorting
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : undefined,
        };

        // Perform the search in your database based on jobTitle and location with pagination and sorting
        const searchResults = await JobPost.find(searchCriteria, null, options);

        // Count the total number of matching documents for pagination info
        const totalResults = await JobPost.countDocuments(searchCriteria);

        res.json({
            results: searchResults,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalResults,
                totalPages: Math.ceil(totalResults / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
function handleRegistrationError(error, res) {
    if (error.name === 'ValidationError') {
        // Extract validation error messages
        const validationErrors = Object.values(error.errors).map((error) => error.message);

        res.status(400).json({ error: 'Validation Error', messages: validationErrors });
    } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}