import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import AppAppBar from '../component/AppAppBar';
import FilterBar from '../component/FilterBar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobDetailsDialog from '../component/JobDetailsDialog';

const JobListing = () => {
    const [jobs, setJobs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filters, setFilters] = useState({
        datePosted: '',
        jobType: '',
        location: '',
        distance: '',
        industryType: '',
        pay: '',
        payRate: '',
        workAvailability: '',
    });
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const jobTitleParam = queryParams.get('jobTitle') || '';
    const jobLocationParam = queryParams.get('jobLocation') || '';
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
    const [resumeDetails, setResumeDetails] = useState(null);
    const [jobIdToApply, setJobIdToApply] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of jobs based on pagination, filters, jobTitle, and jobLocation
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                // Encode the industryType before appending it to the URL
                const encodedIndustryType = encodeURIComponent(filters.industryType);

                const apiUrl = `${process.env.REACT_APP_API_URL}/all_jobs?limit=10&page=${currentPage}&datePosted=${filters.datePosted}&jobType=${filters.jobType}&jobTitle=${jobTitleParam}&jobLocation=${filters.location}&industryType=${encodedIndustryType}&pay=${filters.pay}&payRate=${filters.payRate}&workAvailability=${filters.workAvailability}`;
                const response = await axios.get(apiUrl, {
                    headers: { 'Authorization': `${token}` },
                });
                setJobs(response.data.data || []);
                setTotalPages(response.data.meta.totalPages || 1);
                setError(null);
            } catch (error) {
                // Display error toast message
                const errorData = error.response.data;
                console.error('Error fetching jobs:', errorData);
                setJobs([]);
                setTotalPages(1);
                toast.error(errorData.messages)
            }
        };
        fetchJobs();
    }, [currentPage, filters, jobTitleParam, jobLocationParam, location.search]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const handleShowMore = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/job_details/${jobId}`, {
                headers: { 'Authorization': `${token}` },
            });

            setSelectedJob(response.data || null);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleApply = async (jobId) => {
        // Check if the user is logged in
        const isLoggedIn = localStorage.getItem('token');

        if (isLoggedIn) {
            try {
                const token = localStorage.getItem('token');

                // Check candidate profile to see if resume is uploaded
                const responseProfile = await axios.get(`${process.env.REACT_APP_API_URL}/get_candidate_profile`, {
                    headers: { 'Authorization': `${token}` },
                });

                const candidateProfile = responseProfile.data;

                // Open the dialog to display resume and upload options
                setResumeDialogOpen(true);
                setResumeDetails({ resume: candidateProfile.candidateWithUserDetails.resume });
                setJobIdToApply(jobId);

            } catch (error) {
                const errorData = error.response.data;
                toast.error(errorData.message);
                console.error(errorData.message);
            }
        } else {
            toast.info('Please log in or sign up to apply for jobs.');
            setTimeout(() => {
                navigate('/Sign Up');
            }, 3000);
        }
    };

    // Dialog to display resume and upload options
    const ResumeDialog = () => {
        const [selectedResume, setSelectedResume] = useState(null);
        const { resume: existingResume } = resumeDetails || {};
        const [uploadNewResume, setUploadNewResume] = useState(!existingResume);

        const handleResumeChange = (event) => {
            setSelectedResume(event.target.files[0]);
            setUploadNewResume(true); // Set to true when a new resume is selected
        };

        const handleApplyWithResume = async () => {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();

                // Append existing resume to form data if upload new resume is not selected
                if (!uploadNewResume && existingResume) {
                    // If using the existing resume, append its content
                    const existingResumeFile = await fetch(`${process.env.REACT_APP_API_URL}/get_resume`, {
                        method: 'GET',
                        headers: { 'Authorization': `${token}` },
                    });

                    const existingResumeBlob = await existingResumeFile.blob();
                    formData.append('resume', existingResumeBlob, existingResume);
                } else if (uploadNewResume) {
                    // Append selected resume to form data if upload new resume is selected
                    formData.append('resume', selectedResume);
                }

                // Append job ID and upload option to form data
                formData.append('jobId', jobIdToApply);
                formData.append('uploadNewResume', uploadNewResume);

                // Make an API call to apply for the job with the selected resume
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/apply_job`,
                    formData,
                    { headers: { 'Authorization': `${token}`, 'Content-Type': 'multipart/form-data' } }
                );

                if (response.status === 201) {
                    toast.success(response.data.message);
                    setCurrentPage(1);
                } else {
                    toast.error(response.data.message);
                }

                // Close the dialog
                setResumeDialogOpen(false);
            } catch (error) {
                const errorData = error.response.data;
                toast.error(errorData.message);
                console.error(errorData.message);
            }
        };

        return (
            <Dialog open={resumeDialogOpen} onClose={() => setResumeDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Your Resume</DialogTitle>
                <DialogContent>
                    {existingResume && (
                        <div>
                            <Typography variant="h5">Existing Resume Details:</Typography>
                            <Typography>Name: {existingResume}</Typography>
                        </div>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h5">Upload New Resume:</Typography>

                    <input type="file" accept=".pdf, .doc, .docx" onChange={handleResumeChange} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setResumeDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleApplyWithResume} color="primary" variant="contained">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const handleCloseDialog = () => {
        setSelectedJob(null);
    };

    // Function to format keys for display
    const formatKeyForDisplay = (key) => {
        // Check if key is defined
        if (!key) {
            return '';
        }

        // Convert camelCase to Title Case
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom marked="center" align="center" sx={{ mt: 3, mb: 2 }}>
                    {/* Job Listings */}
                </Typography>
                {/* Filter bar */}
                <FilterBar onFilterChange={handleFilterChange} />
                <Box>
                    {/* Job listings */}
                    {jobs.map((job) => (
                        <Paper key={job._id} elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" mb={2}>
                                {job.jobTitle}
                            </Typography>
                            <Typography>Description: {job.jobDescription}</Typography>
                            <Typography>
                                Location: {job.jobLocation ? `${job.jobLocation.streetAddress}, ${job.jobLocation.city}, ${job.jobLocation.province} ${job.jobLocation.postalCode}` : 'N/A'}
                            </Typography>
                            <Typography>Type: {formatKeyForDisplay(job.jobType)}</Typography>
                            <Typography>{formatKeyForDisplay(selectedJob?.jobType)}</Typography>
                            <Typography>Industry Type: {job.industryType ? job.industryType : 'N/A'}</Typography>
                            {job.showWageRate && (
                                <Typography>
                                    Pay: ${job.payAmount} {job.payRate === 'perHour' ? 'per hour' : 'per year'}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="outlined" color="primary" onClick={() => handleShowMore(job._id)}>
                                    Show More
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => handleApply(job._id)}>
                                    Apply
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                    {/* Pagination */}
                    {jobs.length > 0 && (
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                        />
                    )}
                    {jobs.length === 0 && error && (
                        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'red' }}>
                            {error}
                        </Typography>
                    )}
                    {/* Display message when there are no jobs */}
                    {jobs.length === 0 && !error && (
                        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                            No jobs found with the given search criteria.
                        </Typography>
                    )}
                </Box>
                {/* Job details Dialog */}
                <JobDetailsDialog
                    selectedJob={selectedJob}
                    handleCloseDialog={handleCloseDialog}
                    handleApply={handleApply}
                />
                <ResumeDialog />
            </Container>
            <ToastContainer />
        </React.Fragment>
    );
};

export default JobListing;