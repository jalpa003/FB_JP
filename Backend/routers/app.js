const router = require('express').Router();
const middleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const authRoutes = require('../controller/authController');

//authentication Routes
router.post('/candidate_register', uploadMiddleware,authRoutes.candidateRegistration);
router.post('/employer_registration', authRoutes.employerRegistartion);
router.post('/user_login', authRoutes.logIn);
router.get('/get_users', middleware.verifyToken, authRoutes.getAllUsers);
router.get('/get_single_user/:userId', middleware.verifyToken, authRoutes.getUserDetails);

module.exports = router;