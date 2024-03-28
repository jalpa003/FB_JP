import React, { useState, useEffect } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '../component/Paper';
import AppAppBar from '../component/AppAppBar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import RFTextField from '../form/RFTextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import JobRequirementsCheckboxGroup from '../component/JobRequirementsCheckboxGroup';
import WorkScheduleCheckboxGroup from '../component/WorkScheduleCheckboxGroup';
import SupplementalPayCheckboxGroup from '../component/SupplementalPayCheckboxGroup';
import BenefitsOfferedSection from '../component/BenefitsOfferedCheckbox';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdditionalQuestions from '../component/AdditionalQuestions';

const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
];

const EditJobPostingForm = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [sent, setSent] = useState(false);
    const [showWageRate, setShowWageRate] = useState(true);
    const [initialValues, setInitialValues] = useState({});
    const [consentToAddQuestions, setConsentToAddQuestions] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    useEffect(() => {
        // Fetch existing job details when the component mounts
        const fetchJobDetails = async () => {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token');

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_single_job/${jobId}`, {
                    headers: { Authorization: `${token}` },
                });

                if (response.status === 200) {
                    setShowWageRate(response.data.job.showWageRate || false);
                    setInitialValues(response.data.job);

                    // Check if selected questions exist and update the switch state accordingly
                    if (response.data.job.selectedQuestions && response.data.job.selectedQuestions.length > 0) {
                        setConsentToAddQuestions(true);
                        setSelectedQuestions(response.data.job.selectedQuestions);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('An error occurred while retrieving job details!');
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const validate = (values) => {
        const errors = {};
        if (values.showWageRate) {
            if (!values.payAmount) {
                errors.payAmount = 'Pay Amount is required';
            }
            if (!values.payRate) {
                errors.payRate = 'Pay Rate is required';
            }
        }

        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            if (!values.jobTitle || !values.jobDescription || !values.jobType || !values.jobLocation) {
                toast.error('Please fill in all required fields before submitting the form.');
                return;
            }

            // Check additional validation
            if (values.hoursPerWeek !== undefined && values.hoursPerWeek < 0) {
                toast.error('Hours per week must be a positive number');
                return;
            }

            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            // Prepare payload including selected questions
            const payload = {
                ...values,
                showWageRate,
                selectedQuestions,
            };

            // Make API request to update the job posting
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/update_job/${jobId}`, payload,
                { headers: { Authorization: `${token}` } }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    navigate(`/job-listing`);
                }, 1500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const errorData = error.response.data;
            console.log(errorData.messages);
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
                        <Typography variant="h4" gutterBottom marked="center" align="center">
                            Edit Job Posting
                        </Typography>

                        <Form
                            onSubmit={handleSubmit}
                            initialValues={initialValues}
                            subscription={{ submitting: true }}
                            validate={validate}
                        >
                            {({ handleSubmit: handleSubmit2, submitting }) => (
                                <Box component="form" onSubmit={handleSubmit2} noValidate>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Job Title"
                                                name="jobTitle"
                                                fullWidth
                                                autoFocus
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        label="Job Description"
                                        name="jobDescription"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        required
                                    />
                                    <Typography variant="h5" gutterBottom>
                                        Location
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Street Address"
                                                name="jobLocation.streetAddress"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="City"
                                                name="jobLocation.city"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Province"
                                                name="jobLocation.province"
                                                fullWidth
                                                select
                                                SelectProps={{ native: true }}
                                                required
                                            >
                                                <option value="">Select</option>
                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Postal Code"
                                                name="jobLocation.postalCode"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        {/* hoursPerWeek */}
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Hours Per Week"
                                                name="hoursPerWeek"
                                                fullWidth
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h5" gutterBottom>
                                        Required Training/Experience
                                    </Typography>
                                    <JobRequirementsCheckboxGroup />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Experience"
                                                name="experience"
                                                fullWidth
                                                select
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Select</option>
                                                <option value="1-3">1-3 Years</option>
                                                <option value="3-5">3-5 Years</option>
                                                <option value="5-7">5-7 Years</option>
                                                <option value="7-10">7-10 Years</option>
                                                <option value="10+">10+ Years</option>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Language Requirements"
                                                name="languageRequirements"
                                                type="text"
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* Job Type */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Job Type"
                                                name="jobType"
                                                fullWidth
                                                select
                                                SelectProps={{ native: true }}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="fullTime">Full-time</option>
                                                <option value="partTime">Part-time</option>
                                                <option value="internship">Internship</option>
                                                <option value="casual">Casual</option>
                                                <option value="seasonal">Seasonal</option>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                name="preferredStartDate"
                                                label="Preferred Start Date"
                                                type="date"
                                                fullWidth
                                            >
                                            </Field>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="h6" color="primary" gutterBottom style={{ marginTop: 10 }}>
                                                Work Schedule
                                            </Typography>
                                            <WorkScheduleCheckboxGroup />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                name="numberOfPositions"
                                                label="Number of Positions"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                fullWidth
                                            >
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                name="applicationDeadline"
                                                label="Application Deadline"
                                                type="date"
                                                fullWidth
                                            ></Field>
                                        </Grid>
                                    </Grid>
                                    {/* Pay Rate Details */}
                                    <Typography variant="h6" gutterBottom>
                                        Pay Rate
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={showWageRate}
                                                        onChange={(e) => setShowWageRate(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Show Pay Rate"
                                            />
                                        </Grid>
                                        {showWageRate && (
                                            <>
                                                <Grid item xs={12} sm={4}>
                                                    <Field
                                                        component={RFTextField}
                                                        disabled={submitting || sent}
                                                        label="Pay Amount"
                                                        name="payAmount"
                                                        fullWidth
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Field
                                                        component={RFTextField}
                                                        disabled={submitting || sent}
                                                        label="Pay Rate"
                                                        name="payRate"
                                                        fullWidth
                                                        select
                                                        SelectProps={{ native: true }}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="perHour">Per Hour</option>
                                                        <option value="perYear">Per Year</option>
                                                    </Field>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant='h6' style={{ marginTop: '20px' }}>
                                                Supplemental Pay
                                            </Typography>
                                            <SupplementalPayCheckboxGroup />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h6" gutterBottom>
                                        Benefits Offered
                                    </Typography>
                                    <BenefitsOfferedSection />
                                    {/* Communication Settings */}
                                    {/* <Typography variant="h5" gutterBottom>
                                        Communication Settings
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                fullWidth
                                                label="Add Emails"
                                                name="communicationEmail"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                fullWidth
                                                label="Add Phone Numbers"
                                                name="communicationPhone"
                                            />
                                        </Grid>
                                    </Grid> */}
                                    <AdditionalQuestions
                                        jobId={jobId}
                                        consentToAddQuestions={consentToAddQuestions}
                                        setConsentToAddQuestions={setConsentToAddQuestions}
                                        setSelectedQuestions={setSelectedQuestions}
                                        selectedQuestions={selectedQuestions}
                                    />

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
                                        disabled={submitting}
                                        color="secondary"
                                        fullWidth
                                    >
                                        {submitting ? 'In progress…' : 'Update Job Posting'}
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
};

export default withRoot(EditJobPostingForm);