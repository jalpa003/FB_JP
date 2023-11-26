const User = require('../models/users');
const Candidate = require('../models/candidates');
const jwt = require("jsonwebtoken");
const upload = require('../middleware/upload');

//create user registration api
module.exports.candidateRegistration = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if the email is already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already exist!' });
    }

    try {
        // Create a new candidate user
        const newCandidate = new User({
            email,
            password,
            role: 'candidate',
            firstName,
            lastName
        });

        // Save the user to the database
        const saveUser = await newCandidate.save();
        if (saveUser) {
            res.status(201).json({ message: `Welcome ${firstName}! Your account has been created successfully.` });
        }
    } catch (error) {
        console.error(error);
        handleRegistrationError(error, res);
    }
}

module.exports.employerRegistartion = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already exist!' });
    }

    try {
        // Create a new employer user
        const newEmployer = new User({
            email,
            password,
            role: 'employer',
            firstName,
            lastName
        });

        // Save the user to the database
        const save = await newEmployer.save();
        if (save) {
            res.status(201).json({ message: `${firstName} You have successfully registered! Please log in with your credentials.` })
        }
    } catch (error) {
        console.log(error);
        handleRegistrationError(error, res);
    }
}

module.exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).send('Please provide an email');
    } else if (!password) {
        return res.status(400).send('Please provide a password');
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatched = await user.isCorrectPassword(password);
        if (!isMatched) {
            return res.status(400).send('Invalid email or password');
        }

        //add token 
        const payload =
        {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        //sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: error.toString() })
    }
}

//get all users with pagination and filters
module.exports.getAllUsers = async (req, res) => {
    const pageSize = +req.query.size || 5;
    const currentPage = +req.query.page || 0;
    const filter = req.query.filter || '';
    //sort if nit queried then || dec order by createdAt
    const sort = req.query.sort || '-createdAt';
    const search = req.query.search || '';
    const role = req.query.role || '';
    const totalItems = await User.countDocuments();
    const users = await User.find({
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } }
        ]
    })
        .skip(pageSize * currentPage)
        .limit(pageSize)
        .sort(sort)
        .exec();

    res.status(200).json({
        statusCode: 200,
        data: users,
        totalCount: totalItems,
        limit: pageSize,
        offset: currentPage,
        currentPage: currentPage,
        totalPages: Math.ceil(totalItems / pageSize),
    });
};

//get single user details
module.exports.getUserDetails = async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: "No such user found" });
        } else {
            res.status(200).send(user);
        }
    } catch (err) {
        console.log("Error in getUserDetails", err);
        res.status(500).json({ error: err });
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