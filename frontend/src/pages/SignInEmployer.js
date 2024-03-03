import React, { useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';

function EmployerSignIn() {
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
            errors.password = "Password must be at least 6 characters.";
        }
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user_login`, values);
            if (response && response.status === 200) {
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
                        navigate('/job-posting');
                    }, 1500);
                } else {
                    // Profile is not complete, redirect to /employer-profile
                    toast.info('Complete your profile to access job posting.');
                    setSent(true);

                    // Delay the redirect
                    setTimeout(() => {
                        navigate('/employer-profile');
                    }, 1500);
                }
            } else {
                // Show error toast
                toast.error(response ? response.data.message : 'Unknown error');
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response ? error.response.data : 'Unknown error';
            toast.error(errorData);
        }
    };

    //  variants for animations
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Typography variant="h4" gutterBottom marked="center" align="center">
                            Employer Sign In
                        </Typography>
                        <Typography variant="body2" align="center">
                            {'Not an employer yet? '}
                            <Link href="/sign-up/employer" align="center" underline="always">
                                Sign Up here
                            </Link>
                        </Typography>
                    </motion.div>
                </React.Fragment>
                <Form
                    onSubmit={handleSubmit}
                    subscription={{ submitting: true }}
                    validate={validate}
                >
                    {({ handleSubmit: handleSubmit2, submitting }) => (
                        <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
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
                            </motion.div>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
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
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
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
                            </motion.div>
                        </Box>
                    )}
                </Form>
                <Typography align="center">
                    <Link underline="always" href="/forget-password">
                        Forgot password?
                    </Link>
                </Typography>
            </AppForm>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(EmployerSignIn);