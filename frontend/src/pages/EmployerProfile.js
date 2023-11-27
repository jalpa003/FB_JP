import React, { useState, useEffect } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode as jwt_decode } from 'jwt-decode';

function EmployerProfile() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);
    const [existingDetails, setExistingDetails] = useState({});


    useEffect(() => {
        // Fetch existing details when the component mounts
        const fetchExistingDetails = async () => {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token');

                // Decode the token to get user information
                const decodedToken = jwt_decode(token);

                // Extract the user ID from decoded information
                const employeeId = decodedToken.id;

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_employee/${employeeId}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                if (response.status === 200) {
                    setExistingDetails(response.data.employers[0]);
                }
            } catch (error) {
                console.error(error);
                // Handle error or set default values if needed
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

            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            // Make API request to complete employer profile
            const response = await axios.post('http://localhost:3003/employer-profile', values,
                { headers: { 'Authorization': `${token}` } });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    // Redirect to the desired page after successful completion
                    navigate('/job-posting');
                }, 2500);
            } else {
                // Show error toast
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData.messages[0]);
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Employer Profile
                    </Typography>

                    <Typography variant="subtitle1" align="center">
                        Complete your employer profile to get started.
                    </Typography>
                </React.Fragment>
                <Form
                    initialValues={existingDetails} // Set initial values from existing details
                    onSubmit={handleSubmit}
                    subscription={{ submitting: true }}
                    validate={validate}
                >
                    {({ handleSubmit: handleSubmit2, submitting }) => (
                        <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 2 }}>
                            {/* Add your form fields here */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        autoFocus
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        autoComplete="given-name"
                                        fullWidth
                                        label="First name"
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
                                        label="Last name"
                                        name="lastName"
                                        required
                                    />
                                </Grid>
                            </Grid>
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
                                autoComplete="tel"
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                required
                            />
                            <Field
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Company Name"
                                name="companyName"
                            />
                            <Field
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Number of Employees"
                                name="numberOfEmployees"
                                select
                                SelectProps={{ native: true }}
                            >
                                <option value="">Select</option>
                                <option value="1-15">1 to 15</option>
                                <option value="16-30">16 to 30</option>
                                <option value="31-60">31 to 60</option>
                                <option value="61-99">61 to 99</option>
                                <option value="100+">100+</option>
                            </Field>
                            <Field
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="F&B Industry"
                                name="fAndBIndustry"
                                select
                                SelectProps={{ native: true }}
                            >
                                <option value="">Select</option>
                                <option value="Restaurant/Pub">Restaurant/Pub</option>
                                <option value="Bar/Nightclub">Bar/Nightclub</option>
                                <option value="Fine Dining">Fine Dining</option>
                                <option value="Banquet Hall">Banquet Hall</option>
                                <option value="Resort">Resort</option>
                                <option value="Tavern">Tavern</option>
                                <option value="Retirement Home">Retirement Home</option>
                                <option value="Café/Bistro">Café/Bistro</option>
                                <option value="Catering">Catering</option>
                            </Field>
                            <Field
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Company Description"
                                name="companyDescription"
                                multiline
                                rows={4}
                            />
                            <Field
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Street Address"
                                name="streetAddress"
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
                                {submitting ? 'In progress…' : sent ? 'Success!' : 'Complete Profile'}
                            </FormButton>
                        </Box>
                    )}
                </Form>
            </AppForm>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(EmployerProfile);
