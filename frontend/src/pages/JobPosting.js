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
        
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            // Convert checkbox values to boolean
            // const transformedValues = {
            //     ...values,
            //     jobRequirements: {
            //         smartServe: !!values.jobRequirements.smartServe,
            //         culinaryTraining: !!values.jobRequirements.culinaryTraining,
            //         redSeal: !!values.jobRequirements.redSeal,
            //     },
            //     workSchedule: {
            //         weekDayAvailability: !!values.workSchedule.weekDayAvailability,
            //         weekendAvailability: !!values.workSchedule.weekendAvailability,
            //         dayShift: !!values.workSchedule.dayShift,
            //         eveningShift: !!values.workSchedule.eveningShift,
            //         onCall: !!values.workSchedule.onCall,
            //         holidays: !!values.workSchedule.holidays,
            //     },
            //     supplementalPay: {
            //         overtime: !!values.supplementalPay.overtime,
            //         bonusPay: !!values.supplementalPay.bonusPay,
            //         tips: !!values.supplementalPay.tips,
            //         signingBonus: !!values.supplementalPay.signingBonus,
            //         retentionBonus: !!values.supplementalPay.retentionBonus,
            //     },
            //     benefitsOffered: {
            //         dentalCare: !!values.benefitsOffered.dentalCare,
            //         extendedHealthCare: !!values.benefitsOffered.extendedHealthCare,
            //         lifeInsurance: !!values.benefitsOffered.lifeInsurance,
            //         rrspMatch: !!values.benefitsOffered.rrspMatch,
            //         paidTimeOff: !!values.benefitsOffered.paidTimeOff,
            //         onSiteParking: !!values.benefitsOffered.onSiteParking,
            //         employeeAssistanceProgram: !!values.benefitsOffered.employeeAssistanceProgram,
            //         discountedOrFreeFoodBeverage: !!values.benefitsOffered.discountedOrFreeFoodBeverage,
            //         tuitionReimbursement: !!values.benefitsOffered.tuitionReimbursement,
            //         wellnessProgram: !!values.benefitsOffered.wellnessProgram,
            //         profitSharing: !!values.benefitsOffered.profitSharing,
            //         relocationAssistance: !!values.benefitsOffered.relocationAssistance,
            //         flexibleSchedule: !!values.benefitsOffered.flexibleSchedule,
            //     },
            // };

            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            console.log(token);

            // Make API request
            const response = await axios.post('http://localhost:3003/create_job', values,
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

                        {/* Your Form Content */}
                        <Form
                            onSubmit={handleSubmit}
                            subscription={{ submitting: true }}
                            validate={validate}
                        >
                            {({ handleSubmit: handleSubmit2, submitting }) => (
                                <Box component="form" onSubmit={handleSubmit2} noValidate>
                                    {/* <Typography variant="h6" gutterBottom marked="center" align='center'>
                                        Describe the Job
                                    </Typography> */}
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
                                                required
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
                                                        component={Checkbox}
                                                        name="jobRequirements.smartServe"
                                                    />
                                                }
                                                label="Smart Serve"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="jobRequirements.culinaryTraining"
                                                    />
                                                }
                                                label="Culinary Training"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="jobRequirements.redSeal"
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
                                                        component={Checkbox}
                                                        name="workSchedule.weekDayAvailability"
                                                    />
                                                }
                                                label="Week Day Availability"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="workSchedule.weekendAvailability"
                                                    />
                                                }
                                                label="WeekEnd Availability"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="workSchedule.dayShift"
                                                    />
                                                }
                                                label="Day Shifts"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="workSchedule.eveningShift"
                                                    />
                                                }
                                                label="Evening Shifts"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="workSchedule.onCall"
                                                    />
                                                }
                                                label="On Call"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="workSchedule.holidays"
                                                    />
                                                }
                                                label="Holidays"
                                            />
                                        </Grid>
                                        {/* <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                label="Salary"
                                                name="salary"
                                                type="number"
                                                fullWidth
                                            >
                                            </Field>
                                        </Grid> */}
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
                                                        component={Checkbox}
                                                        name="supplementalPay.overtime"
                                                    />
                                                }
                                                label="Overtime"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="supplementalPay.bonusPay"
                                                    />
                                                }
                                                label="Bonus Pay"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="supplementalPay.tips"
                                                    />
                                                }
                                                label="Tips"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="supplementalPay.signingBonus"
                                                    />
                                                }
                                                label="Signing Bonus"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="supplementalPay.retentionBonus"
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
                                                        component={Checkbox}
                                                        name="benefitsOffered.dentalCare"
                                                    />
                                                }
                                                label="Dental Care"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.extendedHealthCare"
                                                    />
                                                }
                                                label="Extended Health Care"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.lifeInsurance"
                                                    />
                                                }
                                                label="Life Insurance"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.rrspMatch"
                                                    />
                                                }
                                                label="RRSP Match"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.paidTimeOff"
                                                    />
                                                }
                                                label="Paid Time Off"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.onSiteParking"
                                                    />
                                                }
                                                label="On Site Parking"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.profitSharing"
                                                    />
                                                }
                                                label="Profit Sharing"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.flexibleSchedule"
                                                    />
                                                }
                                                label="Flexible Schedule"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.employeeAssistanceProgram"
                                                    />
                                                }
                                                label="Employee Assistance Program"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.discountedOrFreeFoodBeverage"
                                                    />
                                                }
                                                label="Discounted or Free Food/ Beverages"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.tuitionReimbursement"
                                                    />
                                                }
                                                label="Tuition Reimbursement"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.wellnessProgram"
                                                    />
                                                }
                                                label="Wellness Program"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        component={Checkbox}
                                                        name="benefitsOffered.relocationAssistance"
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
