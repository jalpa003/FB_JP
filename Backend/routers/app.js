const router = require('express').Router();
const middleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const authRoutes = require('../controller/authController');
const candidateRoutes = require('../controller/candidate');
const employerRoutes = require('../controller/employer');
const jobsRoutes = require('../controller/jobs');
const pricingRoutes = require('../controller/pricing');

//authentication Routes
router.post('/candidate_registration', authRoutes.candidateRegistration);
router.post('/employer_registration', authRoutes.employerRegistartion);
router.post('/user_login', authRoutes.logIn);
router.post('/forgot_password', authRoutes.forgotPassword);
router.post('/reset_password', authRoutes.resetPassword);

//User Routes
router.get('/get_users', middleware.verifyToken, authRoutes.getAllUsers);
router.get('/get_single_user/:userId', middleware.verifyToken, authRoutes.getUserDetails);

//Candidate Profile Routes
router.post(
  '/complete_candidate_profile',
  middleware.verifyToken,
  uploadMiddleware([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  candidateRoutes.completeCandidateProfile
);
router.post('/upload_avatar', middleware.verifyToken, uploadMiddleware([{ name: 'image', maxCount: 1 },]), candidateRoutes.uploadAvatar);
router.delete('/delete_avatar', middleware.verifyToken, candidateRoutes.deleteAvatar);
router.post('/upload_resume', middleware.verifyToken, uploadMiddleware([{ name: 'resume', maxCount: 1 },]), candidateRoutes.uploadResume);
router.delete('/delete_resume', middleware.verifyToken, candidateRoutes.deleteResume);
router.get('/get_candidate_profile', middleware.verifyToken, candidateRoutes.getCandidateById);
router.get('/job-search', middleware.verifyToken, jobsRoutes.searchJobs);

//Employer Profile Routes
router.post('/employer-profile', middleware.verifyToken, employerRoutes.createEmployerProfile);
router.get('/get_single_employee', middleware.verifyToken, employerRoutes.getSingleEmployeeById);
router.post('/create_job', middleware.verifyToken, jobsRoutes.createJobPosting);
router.get('/all_jobs/empId', middleware.verifyToken, jobsRoutes.getAllJobsByEmployerID);
router.get('/get_single_job/:jobId', middleware.verifyToken, jobsRoutes.getJobById)
router.put('/update_job/:jobId', middleware.verifyToken, jobsRoutes.editJobByID)
router.delete('/delete_job/:jobId', middleware.verifyToken, jobsRoutes.deleteJobByID)
router.post('/close_job/:jobId', middleware.verifyToken, jobsRoutes.closeJob);
router.get('/all_jobs', middleware.verifyToken, jobsRoutes.getAllJobs);
router.get('/job_details/:jobId', middleware.verifyToken, jobsRoutes.getJobDetails);

router.post('/create_emp_profile', middleware.verifyToken, employerRoutes.createEmployerProfile);
router.get('/get_all_employees', middleware.verifyToken, employerRoutes.getAllEmployers);
router.get('/get_employee/:employeeId', middleware.verifyToken, employerRoutes.getSingleEmployeeById);
router.put('/update_employee/:employeeId', middleware.verifyToken, employerRoutes.updateEmployee);
router.delete('/delete_employee/:employeeId', middleware.verifyToken, employerRoutes.deleteEmployee);

router.get('/pricing-plans', pricingRoutes.getPricingPlans);

module.exports = router;