import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppAppBar from '../component/AppAppBar';
import Paper from '@mui/material/Paper';
import FormButton from '../form/FormButton';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import withRoot from '../withRoot';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobListing = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Fetch the list of jobs for the logged-in employer
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/all_jobs/empId`, {
                    headers: { 'Authorization': `${token}` },
                });
                setJobs(response.data.jobs || []);
            } catch (error) {
                toast.error(
                    error?.response?.status === 401 ? "Please login again" : "Failed to load job listing",
                )
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    const handleEditJob = (jobId) => {
        // Redirect to the job editing page with jobId
        navigate(`/edit-job/${jobId}`);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/delete_job/${jobId}`, {
                headers: { 'Authorization': `${token}` },
            });

            toast.success(response.data.message);
            // Update the job list after deletion
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        } catch (error) {
            const errorData = error.response.data;
            toast.error(errorData.messages)
            console.error('Error deleting job:', error);
        }
    };
    const handleCreateJob = () => {
        navigate('/job-posting');
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    display: 'flex',
                    backgroundImage: 'url(/images/productCurvyLines.png)',
                    justifyContent: 'center',
                    minHeight: '90vh',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h4" gutterBottom marked="center" align="center" sx={{ mt: 3, mb: 2 }}>
                        Your Job Listings
                    </Typography>
                    {jobs.length === 0 ? (
                        <Typography variant="body1" align="center">
                            You haven't posted any jobs yet. Click the button below to create a new job.
                        </Typography>
                    ) : (
                        jobs.map((job) => (
                            <Paper key={job._id} elevation={3} sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" mb={2}>
                                    {job.jobTitle}
                                </Typography>
                                <Typography>Description: {job.jobDescription}</Typography>
                                <Typography>Location: {job.jobLocation}</Typography>
                                <Typography>Posted on: {new Date(job.createdAt).toLocaleDateString()}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton
                                        color="primary"
                                        aria-label="edit job"
                                        onClick={() => handleEditJob(job._id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        aria-label="delete job"
                                        onClick={() => handleDeleteJob(job._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))
                    )}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <FormButton variant="contained" color="primary" onClick={handleCreateJob}>
                            Create a New Job
                        </FormButton>
                    </Box>
                </Container>
            </Box>
            <ToastContainer />
        </React.Fragment>
    );
};

export default withRoot(JobListing);