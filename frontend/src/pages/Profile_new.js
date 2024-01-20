import React, { useState, useEffect, useRef } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import Paper from '../component/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popover from '@mui/material/Popover';

const jobTitles = [
    'Chef',
    'Sous Chef',
    // ... (other job titles)
    'Restaurant Owner',
];

// Other utility functions...

function CandidateProfile() {
    // Existing code...

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        background="light"
                        sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 6 } }}
                    >
                        {/* Profile Header */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Avatar
                                alt="Avatar"
                                src={existingDetails.profilePicture ? imageUrl : 'https://shorturl.at/bhEW7'}
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            <Typography variant="h4" gutterBottom marked="center" align="center">
                                {`${existingDetails.firstName} ${existingDetails.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                {existingDetails.headline}
                            </Typography>
                        </Box>

                        {/* Profile Content */}
                        <Grid container spacing={2}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Contact Information
                                </Typography>
                                {/* Display other fields like phone, email, address, etc. */}
                                {/* ... */}
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Job Information
                                </Typography>
                                {/* Display job-related fields like desired job title, job type, etc. */}
                                {/* ... */}
                            </Grid>
                        </Grid>

                        {/* Additional Sections */}
                        {/* ... (e.g., Job Training, Experience Level, Language Skills) */}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <FormButton
                                sx={{ ml: 2 }}
                                disabled={submitting || sent}
                                color="secondary"
                            >
                                {submitting ? 'In progress…' : sent ? 'Success!' : existingDetails.isProfileComplete ? 'Save Profile' : 'Complete Profile'}
                            </FormButton>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(CandidateProfile);
