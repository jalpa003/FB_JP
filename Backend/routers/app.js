const router = require('express').Router();
const middleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const authRoutes = require('../controller/authController');
const candidateRoutes = require('../controller/candidate');
const employerRoutes = require('../controller/employer');
const jobsRoutes = require('../controller/jobs');

//authentication Routes
router.post('/candidate_registration', uploadMiddleware, authRoutes.candidateRegistration);
router.post('/employer_registration', authRoutes.employerRegistartion);
router.post('/user_login', authRoutes.logIn);

//User Routes
router.get('/get_users', middleware.verifyToken, authRoutes.getAllUsers);
router.get('/get_single_user/:userId', middleware.verifyToken, authRoutes.getUserDetails);

//Candidate Profile Routes
router.post('/canidate-profile', middleware.verifyToken, candidateRoutes.completeCandidateProfile);

//Employer Profile Routes
router.post('/employer-profile', middleware.verifyToken, employerRoutes.createEmployerProfile);
router.get('/get_single_employee', middleware.verifyToken, employerRoutes.getSingleEmployeeById);
router.post('/create_job', middleware.verifyToken, jobsRoutes.createJobPosting);
router.get('/all_jobs/empId', middleware.verifyToken, jobsRoutes.getAllJobsByEmployerID);
router.delete('/delete_job/:jobId', middleware.verifyToken, jobsRoutes.deleteJobByID)

router.post('/create_emp_profile', middleware.verifyToken, employerRoutes.createEmployerProfile)
router.get('/get_all_employees', middleware.verifyToken, employerRoutes.getAllEmployers)
router.get('/get_employee/:employeeId', middleware.verifyToken, employerRoutes.getSingleEmployeeById)
router.put('/update_employee/:employeeId', middleware.verifyToken, employerRoutes.updateEmployee)
router.delete('/delete_employee/:employeeId', middleware.verifyToken, employerRoutes.deleteEmployee)

module.exports = router;