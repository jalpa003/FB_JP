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
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import axios from 'axios';
import withRoot from '../withRoot';
import { useNavigate } from 'react-router-dom';
import AppliedUsersDialog from './AppliedUsersDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateJobButton = styled(FormButton)(({ theme }) => ({
    backgroundImage: 'linear-gradient(45deg, #FF4081 30%, #FF5C7F 90%)', // Pinkish gradient
    color: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 5px 2px rgba(255, 64, 129, .3)', // Pink shadow
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #FF5C7F 30%, #FF4081 90%)', // Darker pinkish gradient on hover
    },
    transition: 'background-image 0.3s',
}));



const JobListing = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    // State to manage the close dialog
    const [openCloseDialog, setOpenCloseDialog] = useState({ open: false, jobId: null, closeReason: '' });
    const [openAppliedUsersDialog, setOpenAppliedUsersDialog] = useState({ open: false, job: null });

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

    // Function to handle opening the close dialog
    const handleOpenCloseDialog = (jobId) => {
        setOpenCloseDialog({ open: true, jobId, closeReason: '' });
    };

    // Function to handle closing the close dialog
    const handleCloseDialog = () => {
        setOpenCloseDialog({ open: false, jobId: null, closeReason: '' });
    };

    // Function to handle selecting a close reason
    const handleSelectCloseReason = (event) => {
        setOpenCloseDialog((prevState) => ({ ...prevState, closeReason: event.target.value }));
    };

    // Function to handle closing a job
    const handleCloseJob = async () => {
        const { jobId, closeReason } = openCloseDialog;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/close_job/${jobId}`, { closeReason },
                { headers: { 'Authorization': `${token}` } }
            );

            toast.success(response.data.message);
            // Update the job list after closing
            setJobs((prevJobs) => prevJobs.map((job) => (job._id === jobId ? { ...job, closed: true } : job)));
            handleCloseDialog();

            // Reload the page after closing the job
            window.location.reload();
        } catch (error) {
            const errorData = error.response.data;
            toast.error(errorData.messages);
            console.error('Error closing job:', error);
        }
    };

    const handleReopenJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/reopen_job/${jobId}`,
                {},
                { headers: { 'Authorization': `${token}` } }
            );

            toast.success(response.data.message);
            // Update the job list after reopening
            setJobs((prevJobs) => prevJobs.map((job) => (job._id === jobId ? { ...job, closed: false } : job)));
            // Reload the page after reopening the job
            window.location.reload();
        } catch (error) {
            const errorData = error.response.data;
            toast.error(errorData.messages);
            console.error('Error reopening job:', error);
        }
    };


    const handleOpenAppliedUsersDialog = (job) => {
        setOpenAppliedUsersDialog({ open: true, job });
    };

    const handleCloseAppliedUsersDialog = () => {
        setOpenAppliedUsersDialog({ open: false, job: null });
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
                    {jobs.length > 0 && (
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <CreateJobButton onClick={handleCreateJob}>
                                <AddIcon />
                                Create a New Job
                            </CreateJobButton>
                        </Box>
                    )}
                    {jobs.length === 0 ? (
                        <Card
                            sx={{
                                maxWidth: 400,
                                borderRadius: 8,
                                overflow: 'hidden',
                                boxShadow: 8,
                                margin: 'auto',
                                marginTop: 10,
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image="http://tinyurl.com/yzd6pnfm"
                                alt="Create New Job Background"
                            />
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Ready to Post a New Job?
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Click the button below to create a new job listing and find the perfect candidate!
                                </Typography>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <CreateJobButton onClick={handleCreateJob}>
                                        Create a New Job
                                    </CreateJobButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        jobs.map((job) => (
                            <Paper key={job._id} elevation={3} sx={{ p: 3, mb: 3 }} disabled={job.isClosed}>
                                {job.isClosed && (
                                    <Typography variant="subtitle2" color="error">
                                        Closed Job - {job.closeReason}
                                    </Typography>
                                )}
                                <Typography variant="h6" mb={2}>
                                    {job.jobTitle}
                                </Typography>
                                <Typography>Description: {job.jobDescription}</Typography>
                                <Typography>
                                    Location: {job.jobLocation ? `${job.jobLocation.streetAddress}, ${job.jobLocation.city}, ${job.jobLocation.province} ${job.jobLocation.postalCode}` : 'N/A'}
                                </Typography>
                                <Typography>Industry: {job.industryType}</Typography>
                                {/* <Typography>Location: {job.jobLocation}</Typography> */}
                                <Typography>Posted on: {new Date(job.createdAt).toLocaleDateString()}</Typography>
                                <Typography variant="h5">
                                    Applied Users: {' '}
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={() => handleOpenAppliedUsersDialog(job)}
                                        color="primary"
                                    >
                                        View ({job.appliedUsers.length})
                                    </Link>
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Tooltip title="Edit Job" arrow>
                                        <IconButton color="primary" aria-label="edit job" onClick={() => handleEditJob(job._id)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Job" arrow>
                                        <IconButton color="error" aria-label="delete job" onClick={() => handleDeleteJob(job._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {!job.isClosed && (
                                        <Tooltip title="Close Job" arrow>
                                            <IconButton
                                                color="info"
                                                aria-label="close job"
                                                onClick={() => handleOpenCloseDialog(job._id)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {job.isClosed && (
                                        <Tooltip title="Reopen Job" arrow>
                                            <IconButton
                                                color="success"
                                                aria-label="reopen job"
                                                onClick={() => handleReopenJob(job._id)}
                                            >
                                                <RestoreIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Paper>
                        ))
                    )}
                    <AppliedUsersDialog
                        open={openAppliedUsersDialog.open}
                        handleClose={handleCloseAppliedUsersDialog}
                        job={openAppliedUsersDialog.job}
                    />
                    {/* Close Dialog */}
                    <Dialog open={openCloseDialog.open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Close Job</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Select a reason for closing the job:
                            </DialogContentText>
                            <Select value={openCloseDialog.closeReason} onChange={handleSelectCloseReason} fullWidth>
                                <MenuItem value="filled_through_tastetalent">Posting filled through tastetalent.com</MenuItem>
                                <MenuItem value="filled_internally">Posting filled internally</MenuItem>
                                <MenuItem value="filled_from_another_source">Posting filled from another source</MenuItem>
                                <MenuItem value="no_longer_needed">Posting no longer needed at this time</MenuItem>
                            </Select>
                        </DialogContent>
                        <DialogActions>
                            <FormButton onClick={handleCloseDialog} color="primary">
                                Cancel
                            </FormButton>
                            <FormButton onClick={handleCloseJob} color="primary">
                                Close Job
                            </FormButton>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <ToastContainer />
        </React.Fragment>
    );
};

export default withRoot(JobListing);