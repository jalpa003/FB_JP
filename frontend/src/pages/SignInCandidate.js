import React, { useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '../component/Typography';
// import AppFooter from './AppFooter';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';

function CandidateSignIn() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);

    const validate = (values) => {
        const errors = required(['email', 'password'], values);

        if (!errors.email) {
            const emailError = email(values.email);
            if (emailError) {
                errors.email = emailError;
            }
        }
        if (values.password && values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            // Make API request to candidate sign-in endpoint
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user_login`, values);
            if (response.status === 200) {
                // Store the token in localStorage
                localStorage.setItem('token', response.data.token);

                // Decode the token to get user information
                const decodedToken = jwt_decode(response.data.token);

                // Check if the user's profile is completed
                if (decodedToken.isProfileComplete) {
                    // Profile is complete, redirect to /job-posting
                    toast.success(response.data.message);
                    setSent(true);

                    // Delay the redirect
                    setTimeout(() => {
                        navigate('/all-jobs');
                    }, 1500);
                } else {
                    // Profile is not complete, redirect to /candidate-profile
                    toast.info('Complete your profile to access job posting.');
                    setSent(true);

                    // Delay the redirect
                    setTimeout(() => {
                        navigate('/candidate-profile');
                    }, 1500);
                }
            } else {
                // Show error toast
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData);
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Candidate Sign In
                    </Typography>
                    <Typography variant="body2" align="center">
                        {'Not a candidate yet? '}
                        <Link href="/sign-up/candidate" align="center" underline="always">
                            Sign Up here
                        </Link>
                    </Typography>
                </React.Fragment>
                <Form
                    onSubmit={handleSubmit}
                    subscription={{ submitting: true }}
                    validate={validate}
                >
                    {({ handleSubmit: handleSubmit2, submitting }) => (
                        <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
                            <Field
                                autoComplete="email"
                                autoFocus
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="email"
                                required
                                size="large"
                            />
                            <Field
                                fullWidth
                                size="large"
                                component={RFTextField}
                                disabled={submitting || sent}
                                required
                                name="password"
                                autoComplete="current-password"
                                label="Password"
                                type="password"
                                margin="normal"
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
                                sx={{ mt: 3, mb: 2 }}
                                disabled={submitting || sent}
                                size="large"
                                color="secondary"
                                fullWidth
                            >
                                {submitting || sent ? 'In progress…' : 'Sign In'}
                            </FormButton>
                        </Box>
                    )}
                </Form>
                <Typography align="center">
                    <Link underline="always" href="/forget-password">
                        Forgot password?
                    </Link>
                </Typography>
            </AppForm>
            {/* <AppFooter /> */}
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(CandidateSignIn);
