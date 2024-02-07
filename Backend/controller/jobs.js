const JobPost = require('../models/jobs');
const CandidateProfile = require('../models/candidates');
const EmployerProfile = require('../models/employers');
const { getDateFilter, handleRegistrationError, getWageFilter, getWorkAvailabilityFilter } = require('../middleware/jobUtils');
module.exports.createJobPosting = async (req, res) => {
    try {
        // Get user ID from the token
        const userId = req.user.id;

        // Fetch employer's profile to get the industry type
        const employerProfile = await EmployerProfile.findOne({ user: userId });

        if (!employerProfile) {
            return res.status(404).json({ message: "Employer profile not found." });
        }

        // Create a new job posting
        const newJob = new JobPost({
            user: userId,
            industryType: employerProfile.fAndBIndustry,
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
        const jobs = await JobPost.find({ user: req.user.id }).populate({
            path: 'appliedUsers',
            model: 'User',
            select: 'firstName lastName',
            options: { strictPopulate: false },
        });

        if (!jobs) throw Error("No jobs found");

        // Fetch the resume from CandidateProfile for each applied user
        const populatedJobs = await Promise.all(jobs.map(async (job) => {
            const populatedUsers = await Promise.all(job.appliedUsers.map(async (appliedUser) => {
                const candidateProfile = await CandidateProfile.findOne({ user: appliedUser._id });
                return {
                    _id: appliedUser._id,
                    firstName: appliedUser.firstName,
                    lastName: appliedUser.lastName,
                    resume: candidateProfile ? candidateProfile.resume : null,
                };
            }));

            return { ...job._doc, appliedUsers: populatedUsers };
        }));

        res.status(200).json({ jobs: populatedJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: error.message });
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

//reopen job
module.exports.reopenJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Find the job by ID
        const job = await JobPost.findById(jobId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the job is already open
        if (!job.isClosed) {
            return res.status(400).json({ message: 'Job is already open' });
        }

        // Update the job to mark it as open
        job.isClosed = false;
        job.closeReason = null;
        job.closedAt = null;
        await job.save();

        res.status(200).json({ message: 'Job reopened successfully' });
    } catch (error) {
        console.error('Error reopening job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
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
            const [city, province] = req.query.jobLocation.split(',').map((item) => item.trim());
            searchParams['jobLocation.city'] = { $regex: new RegExp(city, 'i') };
            searchParams['jobLocation.province'] = { $regex: new RegExp(province, 'i') };
        }

        // Check if there is a date posted filter
        if (req.query.datePosted) {
            const dateFilter = getDateFilter(req.query.datePosted);
            if (dateFilter) {
                searchParams.createdAt = dateFilter;
            }
        }

        // Check if there is a job type filter
        if (req.query.jobType && ['fullTime', 'partTime', 'internship', 'casual', 'seasonal'].includes(req.query.jobType)) {
            searchParams.jobType = req.query.jobType;
        }

        // Check if there is an industry type filter
        if (req.query.industryType && ['Fine Dinning', 'Fast Food', 'Cafés', 'Catering', 'Bakeries', 'Pubs and Bars', 'Brewers, Winneries & Distilleries', 'Casual Dinning', 'Banquet Facilities'].includes(req.query.industryType)) {
            searchParams.industryType = req.query.industryType;
        }

        // Exclude closed jobs
        searchParams.isClosed = { $ne: true };

        // Check if there is a distance filter
        if (req.query.distance) {
            // Implement distance filtering logic based on your requirements
            // You may need geospatial queries if you have location data in your database
        }

        // Check if there is a wage estimation filter
        if (req.query.pay && req.query.payRate) {
            const wageFilter = getWageFilter(req.query.payRate, req.query.pay);
            if (wageFilter) {
                Object.assign(searchParams, wageFilter);
            }
        }

        // Check if there is a work availability filter
        if (req.query.workAvailability) {
            const workAvailabilityFilter = getWorkAvailabilityFilter(req.query.workAvailability);
            if (workAvailabilityFilter) {
                Object.assign(searchParams, workAvailabilityFilter);
            }
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

//fetch locations from db (city,province)
module.exports.fetchLocations = async (req, res) => {
    try {
        const uniqueLocations = await JobPost.aggregate([
            {
                $match: {
                    'jobLocation.city': { $exists: true, $ne: null },
                    'jobLocation.province': { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        city: '$jobLocation.city',
                        province: '$jobLocation.province',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    location: {
                        $concat: ['$_id.city', ', ', '$_id.province'],
                    },
                },
            },
        ]);

        res.json({ locations: uniqueLocations });
    } catch (error) {
        console.error('Error fetching unique locations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};