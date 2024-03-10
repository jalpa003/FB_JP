const Employer = require('../models/employers');
const Candidate = require('../models/candidates');
const User = require('../models/users');
const mongoose = require('mongoose')

//create employee profile
module.exports.createEmployerProfile = async (req, res) => {
    const { phone, companyName, numberOfEmployees, fAndBIndustry, companyDescription, streetAddress } = req.body;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the employer profile already exists
        let employerProfile = await Employer.findOne({ user: userId });

        const requiredFields = [phone, companyName, numberOfEmployees, fAndBIndustry, companyDescription, streetAddress];
        if (requiredFields.some((field) => !field)) {
            // If any required field is missing, set isProfileComplete to false
            user.isProfileComplete = false;
        }

        if (employerProfile) {
            // Employer profile already exists, update the details
            employerProfile.phone = phone;
            employerProfile.companyName = companyName;
            employerProfile.numberOfEmployees = numberOfEmployees;
            employerProfile.fAndBIndustry = fAndBIndustry;
            employerProfile.companyDescription = companyDescription;
            employerProfile.streetAddress = streetAddress;

            // Save the updated employer profile
            employerProfile = await employerProfile.save();
        } else {
            // Employer profile does not exist, create a new one
            employerProfile = new Employer({
                user: userId,
                phone,
                companyName,
                numberOfEmployees,
                fAndBIndustry,
                companyDescription,
                streetAddress,
            });

            // Save the new employer profile
            employerProfile = await employerProfile.save();
        }

        // Update the user's profile completion status
        if (requiredFields.every((field) => !!field)) {
            user.isProfileComplete = true;
        }

        const userProfile = await user.save();

        if (userProfile) {
            res.status(200).json({ message: 'Employer profile saved successfully' });
        } else {
            res.status(500).json({ message: 'Error completing employer profile' });
        }
    } catch (error) {
        console.error(error);
        handleRegistrationError(error, res);
    }
}

module.exports.getAllEmployers = async (req, res) => {
    try {
        // Sorting
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc' ? -1 : 1;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        // Filters
        const filters = {};
        if (req.query.department) {
            filters.department = req.query.department;
        }

        // Search
        const searchQuery = req.query.search;
        const searchFilter = searchQuery
            ? { $text: { $search: searchQuery } }
            : {};

        const employees = await Employer
            .find({ ...filters, ...searchFilter })
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize);

        const totalEmployees = await Employer.countDocuments({ ...filters, ...searchFilter });

        res.status(200).json({
            success: true,
            employees,
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / pageSize),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

//get single employee by id
module.exports.getSingleEmployeeById = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the employer details
        const employer = await Employer.findOne({ user: userId }).populate('user');

        // If employer not found, find user details
        if (!employer) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Return user details if employer not found
            const userDetails = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };

            return res.status(200).json({ success: true, userDetails });
        }

        // Merge user details into the employer object
        const employerWithUserDetails = {
            ...employer.toObject(),
            ...employer.user.toObject(),
            user: undefined,
        };

        res.status(200).json({ success: true, employerWithUserDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

//update employee
module.exports.updateEmployee = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ success: false, message: 'Invalid employee ID' });
        }
        const employee = await Employer.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        let updatedFields = {};
        for (let field in req.body) {
            if (req.body[field]) {
                updatedFields[field] = req.body[field];
            }
        }
        const newUpdatedEmployee = await Employer.findByIdAndUpdate(employeeId, updatedFields, { new: true });
        if (!updatedFields) {
            return res.status(400).json({ success: false, message: 'Please provide new data to update' });
        }
        const updatedEmployer = await Employer.findOneAndUpdate(
            { _id: employeeId },
            { $set: updatedFields },
            { new: true }
        );
        if (!updatedEmployer) {
            return res.status(404).json({ success: false, message: "Employee was not updated" })
        }
        res.status(201).json({ success: true, updatedEmployer });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
}

//delete employee
module.exports.deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        // Validate if the employeeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ success: false, message: 'Invalid employeeId' });
        }

        const deletedEmployee = await Employer.findByIdAndDelete(employeeId);

        if (deletedEmployee) {
            res.status(200).json({ success: true, message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

//get candidate profile
module.exports.getCandidates = async (req, res) => {
    try {
        let query = {};

        // Filter by desired job title
        if (req.query.desiredJobTitle) {
            query.desiredJobTitle = req.query.desiredJobTitle;
        }

        // Filter by desired job type
        if (req.query.desiredJobType) {
            query.desiredJobType = req.query.desiredJobType;
        }

        // Filter by experience level
        if (req.query.experienceLevel) {
            // Handle special cases for '<1' and '10+'
            if (req.query.experienceLevel === '<1') {
                query.experienceLevel = { $lt: '1' };
            } else if (req.query.experienceLevel === '10+' || req.query.experienceLevel === '10%2B') {
                query.experienceLevel = { $gte: '10' };
            } else {
                query.experienceLevel = req.query.experienceLevel;
            }
        }

        // Filter by language skills
        if (req.query.languageSkills) {
            // Split the language skills string into an array
            const languageSkillsArray = req.query.languageSkills.split(',').map(skill => skill.trim());
            // Match candidates who have at least one of the specified language skills, case-insensitive
            query.languageSkills = { $in: languageSkillsArray.map(skill => new RegExp(skill, 'i')) };
        }

        if (req.query.location) {
            let [city, province] = req.query.location.split(',');

            // If only the province is provided, set it as the province and leave city empty
            if (!province) {
                province = city;
                city = '';
            }

            // Trim leading and trailing whitespace
            city = city.trim();
            province = province.trim();

            // Create regular expressions for case-insensitive matching
            const cityRegex = new RegExp(city, 'i');
            const provinceRegex = new RegExp(province, 'i');

            // Construct the query to search for the city and/or province
            if (city && province) {
                // If both city and province are provided, search for both
                query['address.city'] = cityRegex;
                query['address.province'] = provinceRegex;
            } else if (province) {
                // If only province is provided, search for province only
                query['address.province'] = provinceRegex;
            }
        }

        // Filter by job training
        if (req.query.jobTraining) {
            const training = req.query.jobTraining;
            query[`jobTraining.${training}`] = true;
        }

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const candidates = await Candidate.find(query)
            .populate('user', 'firstName lastName email')
            .select('phone profilePicture resume desiredSchedule')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const totalCount = await Candidate.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            candidates,
            meta: {
                totalCount,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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