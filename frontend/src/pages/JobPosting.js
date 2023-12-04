import React, { useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '../component/Paper';
import AppAppBar from '../component/AppAppBar';
import Typography from '@mui/material/Typography';
import RFTextField from '../form/RFTextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobPostingForm = () => {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);

    const validate = (values) => {
        const errors = {};
        // Check for required fields
        if (!values.jobTitle) {
            errors.jobTitle = 'Job Title is required';
        }

        if (!values.jobDescription) {
            errors.jobDescription = 'Job Description is required';
        }
        if (!values.jobType) {
            errors.jobType = 'Job Type is required';
        }
        if (!values.jobLocation) {
            errors.jobLocation = 'Job Location is required';
        }

        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            // Make API request
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/create_job`, values,
                { headers: { 'Authorization': `${token}` } });

            if (response.status === 201) {
                toast.success(response.data.message)
                setSent(true);

                setTimeout(() => {
                    navigate('/job-listing');
                }, 1500);
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            const errorData = error.response.data;
            console.log(errorData.messages);
            toast.error(errorData.messages)
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
                            Job Posting
                        </Typography>

                        <Form
                            onSubmit={handleSubmit}
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
                                        Job Requirements
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Job Location"
                                                name="jobLocation"
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
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* <Field
                                        name="uploadFile"
                                        component={TextField}
                                        fullWidth
                                        label="Upload a PDF or DOCX"
                                        type="file"
                                    /> */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={9}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobRequirements.smartServe"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Smart Serve"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobRequirements.culinaryTraining"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Culinary Training"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobRequirements.redSeal"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Red Seal"
                                            />
                                        </Grid>
                                    </Grid>
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
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.weekDayAvailability"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Week Day Availability"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.weekendAvailability"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="WeekEnd Availability"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.dayShift"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Day Shifts"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.eveningShift"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Evening Shifts"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.onCall"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="On Call"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="workSchedule.holidays"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Holidays"
                                            />
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant='h6' style={{ marginTop: '20px' }}>
                                                Supplemental Pay
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="supplementalPay.overtime"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Overtime"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="supplementalPay.bonusPay"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Bonus Pay"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="supplementalPay.tips"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Tips"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="supplementalPay.signingBonus"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Signing Bonus"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="supplementalPay.retentionBonus"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Retention Bonus"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h6" gutterBottom>
                                        Benefits Offered
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={5} sm={10}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.dentalCare"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Dental Care"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.extendedHealthCare"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Extended Health Care"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.lifeInsurance"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Life Insurance"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.rrspMatch"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="RRSP Match"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.paidTimeOff"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Paid Time Off"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.onSiteParking"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="On Site Parking"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.profitSharing"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Profit Sharing"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.flexibleSchedule"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Flexible Schedule"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.employeeAssistanceProgram"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Employee Assistance Program"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.discountedOrFreeFoodBeverage"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Discounted or Free Food/ Beverages"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.tuitionReimbursement"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Tuition Reimbursement"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.wellnessProgram"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Wellness Program"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="benefitsOffered.relocationAssistance"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Relocation Assistance"
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* Communication Settings */}
                                    <Typography variant="h5" gutterBottom>
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
                                    </Grid>
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
                                        {submitting ? 'In progress…' : 'Submit Job Posting'}
                                    </FormButton>
                                </Box>
                            )}
                        </Form>
                    </Paper>
                </Container>
            </Box>
            <ToastContainer />
        </React.Fragment >

    );
};

export default withRoot(JobPostingForm);
