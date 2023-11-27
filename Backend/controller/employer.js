const Employer = require('../models/employers');
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
        user.isProfileComplete = true;

        const userProfile = await user.save();

        if (userProfile) {
            res.status(200).json({ message: 'Employer profile completed successfully' });
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

        // Use Mongoose's populate to get details from the referenced User model
        const employer = await User.findOne({ _id: userId })
        // .populate('EmployerProfile', 'phone companyName numberOfEmployees fAndBIndustry');

        if (!employer) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        res.status(200).json({ success: true, employer });
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