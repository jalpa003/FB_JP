import * as React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import { email, required } from '../form/validation';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import axios from 'axios';
import withRoot from '../withRoot';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const [sent, setSent] = React.useState(false);

    const validate = (values) => {
        const errors = required(['email'], values);

        if (!errors.email) {
            const emailError = email(values.email);
            if (emailError) {
                errors.email = emailError;
            }
        }

        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot_password`, values);

            if (response.status === 200) {
                setSent(true);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData.message || 'An error occurred');
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Forgot your password?
                    </Typography>
                    <Typography variant="body2" align="center">
                        {"Enter your email address below and we'll " +
                            'send you a link to reset your password.'}
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
                                autoFocus
                                autoComplete="email"
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="email"
                                required
                                size="large"
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
                                {submitting ? 'In progress…' : sent ? 'Success!' : 'Send reset link'}
                            </FormButton>
                        </Box>
                    )}
                </Form>
            </AppForm>
             <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(ForgotPassword);