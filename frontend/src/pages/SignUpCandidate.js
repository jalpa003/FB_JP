import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Field, Form, FormSpy } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CandidateSignUp() {
    const navigate = useNavigate();
    const [sent, setSent] = React.useState(false);

    const validate = (values) => {
        const errors = required(['firstName', 'lastName', 'email', 'password'], values);

        if (!errors.email) {
            const emailError = email(values.email);
            if (emailError) {
                errors.email = emailError;
            }
        }

        if (values.password && values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            // Make API request to candidate sign-up endpoint
            const response = await axios.post('http://localhost:3003/candidate_registration', values);
            if (response.status === 201) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    // Redirect to login page
                    navigate('/sign-in/candidate');
                }, 1500);
            }
            else {
                // Show error toast
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData.message);
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Sign Up as Candidate
                    </Typography>

                    <Typography variant="body2" align="center">
                        <Link href="/sign-in/candidate" underline="always">
                            Already have an account? Sign in as a candidate.
                        </Link>
                    </Typography>
                </React.Fragment>
                <Form
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
                                fullWidth
                                component={RFTextField}
                                disabled={submitting || sent}
                                required
                                name="password"
                                autoComplete="new-password"
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
                                sx={{ mt: 2, mb: 2 }}
                                disabled={submitting || sent}
                                color="secondary"
                                fullWidth
                            >
                                {submitting ? 'In progress…' : sent ? 'Success!' : 'Sign Up'}
                            </FormButton>
                        </Box>
                    )}
                </Form>
            </AppForm>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(CandidateSignUp);
