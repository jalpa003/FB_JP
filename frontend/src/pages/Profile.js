import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CandidateProfile() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);
    const [existingDetails, setExistingDetails] = useState({});

    useEffect(() => {
        const fetchExistingDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_candidate_profile`, {
                    headers: { Authorization: `${token}` }
                });

                if (response.status === 200) {
                    setExistingDetails(response.data.candidateWithUserDetails || response.data.userDetails);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while retrieving your profile information!")
            }
        };

        fetchExistingDetails();
    }, []);

    const validate = (values) => {
        // Implement your validation logic here if needed
        const errors = {};
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/complete_candidate_profile`, values,
                { headers: { 'Authorization': `${token}` } });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    navigate('/all-jobs'); // Adjust the redirect path accordingly
                }, 2500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData.messages);
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    display: 'flex',
                    backgroundImage: 'url(/images/productCurvyLines.png)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        background="light"
                        sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 6 } }}
                    >
                        <React.Fragment>
                            <Typography variant="h4" gutterBottom marked="center" align="center">
                                Candidate Profile
                            </Typography>

                            <Typography variant="subtitle1" align="center">
                                Complete your candidate profile to enhance your opportunities.
                            </Typography>
                        </React.Fragment>
                        <Form
                            initialValues={existingDetails}
                            onSubmit={handleSubmit}
                            subscription={{ submitting: true }}
                            validate={validate}
                        >
                            {({ handleSubmit: handleSubmit2, submitting }) => (
                                <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                autoFocus
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                autoComplete="given-name"
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                autoComplete="family-name"
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Headline"
                                        name="headline"
                                    />
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        required
                                    />
                                    <Field
                                        autoComplete="email"
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Email"
                                        margin="normal"
                                        name="email"
                                        required
                                    />
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Address"
                                        name="address"
                                    />
                                    {/* <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        label="Upload Resume"
                                        name="resume"
                                        fullWidth
                                        type="file"
                                    /> */}
                                    {/* <Field
                                type="checkbox"
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Viewable by Employers?"
                                name="viewableResumeByEmployers"
                            /> */}
                                    {/* <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        type="file"
                                        label="Upload Profile Picture"
                                        name="profilePicture"
                                        fullWidth
                                    /> */}
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Desired Job Title"
                                        name="desiredJobTitle"
                                    />
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Desired Job Type"
                                        name="desiredJobType"
                                        select
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select</option>
                                        <option value="FT">Full Time</option>
                                        <option value="PT">Part Time</option>
                                        <option value="Temp">Temporary</option>
                                        <option value="Apprentice">Apprentice</option>
                                    </Field>
                                    <Typography variant="h6" gutterBottom>
                                        Job Training
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.smartServe"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Smart Serve"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.culinaryTraining"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Culinary Training"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.redSeal"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Red Seal"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.workplaceSafety"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Workplace Safety"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.customerService"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Customer Service"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.barTending"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Bartending"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.barista"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Barista"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.fineDining"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Fine Dining"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Experience Level"
                                        name="experienceLevel"
                                        select
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select</option>
                                        <option value="<1">Less than 1 year</option>
                                        <option value="1-3">1 to 3 years</option>
                                        <option value="3-5">3 to 5 years</option>
                                        <option value="5-7">5 to 7 years</option>
                                        <option value="7-10">7 to 10 years</option>
                                        <option value="10+">More than 10 years</option>
                                    </Field>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Language Skills"
                                        name="languageSkills"
                                    />
                                    {/* Form feedback for errors */}
                                    <FormSpy subscription={{ submitError: true }}>
                                        {({ submitError }) =>
                                            submitError ? (
                                                <FormFeedback error sx={{ mt: 2 }}>
                                                    {submitError}
                                                </FormFeedback>
                                            ) : null
                                        }
                                    </FormSpy>
                                    <FormButton
                                        sx={{ mt: 2, mb: 2 }}
                                        disabled={submitting || sent}
                                        color="secondary"
                                        fullWidth
                                    >
                                        {submitting ? 'In progress…' : sent ? 'Success!' : existingDetails.isProfileComplete ? 'Save Profile' : 'Complete Profile'}
                                    </FormButton>
                                </Box>
                            )}
                        </Form>
                    </Paper>
                </Container>
            </Box>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(CandidateProfile);