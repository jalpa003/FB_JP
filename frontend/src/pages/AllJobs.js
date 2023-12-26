import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import AppAppBar from '../component/AppAppBar';
import axios from 'axios';

const JobListing = () => {
    const [jobs, setJobs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        // Fetch the list of jobs based on pagination and filters
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/all_jobs?limit=10&page=${currentPage}&filter=${filter}`, {
                    headers: { 'Authorization': `${token}` },
                });
                setJobs(response.data.data || []);
                setTotalPages(response.data.meta.totalPages || 1);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, [currentPage, filter]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
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

    const handleApply = (jobId) => {
        // Placeholder for handling job applications
        console.log(`Applying to job with ID: ${jobId}`);
        // Implement your logic for applying to the job
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
                    Job Listings
                </Typography>
                <Box>
                    {/* Job listings */}
                    {jobs.map((job) => (
                        <Paper key={job._id} elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" mb={2}>
                                {job.jobTitle}
                            </Typography>
                            <Typography>Description: {job.jobDescription}</Typography>
                            <Typography>Location: {job.jobLocation}</Typography>
                            <Typography>Type: {job.jobType}</Typography>
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
                </Box>
                {/* Job details Dialog */}
                <Dialog open={!!selectedJob} onClose={handleCloseDialog} maxWidth="md">
                    <DialogTitle>{selectedJob?.jobTitle}</DialogTitle>
                    <DialogContent>
                        {/* Display job details here */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Description</Typography>
                                <DialogContentText>{selectedJob?.jobDescription}</DialogContentText>
                                <Typography variant="h6">Location</Typography>
                                <DialogContentText>{selectedJob?.jobLocation}</DialogContentText>
                                <Typography variant="h6">Type</Typography>
                                <DialogContentText>{formatKeyForDisplay(selectedJob?.jobType)}</DialogContentText>
                                <Typography variant="h6">Experience</Typography>
                                <DialogContentText>{selectedJob?.experience}</DialogContentText>
                                <Typography variant="h6">Hours per Week</Typography>
                                <DialogContentText>{selectedJob?.hoursPerWeek}</DialogContentText>
                                <Typography variant="h6">Status</Typography>
                                <DialogContentText>{selectedJob?.status}</DialogContentText>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Preferred Start Date</Typography>
                                <Typography>{new Date(selectedJob?.preferredStartDate).toLocaleDateString()}</Typography>
                                <Typography variant="h6">Is Closed</Typography>
                                <DialogContentText>{selectedJob?.isClosed ? 'Yes' : 'No'}</DialogContentText>

                                {/* Display true values from jobRequirements */}
                                <Typography variant="h6" mt={2}>Job Requirements:</Typography>
                                {Object.entries(selectedJob?.jobRequirements || {}).map(([key, value]) => value && (
                                    <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                                ))}
                                <Typography variant="h6" mt={2}>Work Schedule:</Typography>
                                {Object.entries(selectedJob?.workSchedule || {}).map(([key, value]) => value && (
                                    <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                                ))}
                                <Typography variant="h6" mt={2}>Supplemental Pay:</Typography>
                                {Object.entries(selectedJob?.supplementalPay || {}).map(([key, value]) => value && (
                                    <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                                ))}
                                <Typography variant="h6" mt={2}>Benefits Offered:</Typography>
                                {Object.entries(selectedJob?.benefitsOffered || {}).map(([key, value]) => value && (
                                    <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                                ))}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider sx={{ my: 2 }} />
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                        <Button onClick={() => handleApply(selectedJob?._id)} color="primary" variant="contained">
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </React.Fragment>
    );
};

export default JobListing;
