import * as React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import withRoot from '../withRoot';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const navigate = useNavigate();
    const [sent, setSent] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const { token } = useParams();
    const decodedToken = decodeURIComponent(token);

    const handleMouseDown = (passwordType) => {
        if (passwordType === 'new') {
            setShowNewPassword(true);
        } else if (passwordType === 'confirm') {
            setShowConfirmPassword(true);
        }
    };

    const handleMouseUp = (passwordType) => {
        if (passwordType === 'new') {
            setShowNewPassword(false);
        } else if (passwordType === 'confirm') {
            setShowConfirmPassword(false);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.newPassword) {
            errors.newPassword = 'New Password is required';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset_password`, {
                resetPasswordToken: decodedToken,
                newPassword: values.newPassword,
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    // Redirect to login page
                    navigate('/Sign In');
                }, 1500);
            } else {
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
                        Reset Your Password
                    </Typography>
                    <Typography variant="body2" align="center">
                        Enter your new password below.
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
                                autoComplete="new-password"
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="New Password"
                                margin="normal"
                                name="newPassword"
                                required
                                size="large"
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle new password visibility"
                                                onMouseDown={() => handleMouseDown('new')}
                                                onMouseUp={() => handleMouseUp('new')}
                                                onMouseOut={() => handleMouseUp('new')}
                                            >
                                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Field
                                autoComplete="confirm-password"
                                component={RFTextField}
                                disabled={submitting || sent}
                                fullWidth
                                label="Confirm Password"
                                margin="normal"
                                name="confirmPassword"
                                required
                                size="large"
                                type={showConfirmPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle confirm password visibility"
                                                onMouseDown={() => handleMouseDown('confirm')}
                                                onMouseUp={() => handleMouseUp('confirm')}
                                                onMouseOut={() => handleMouseUp('confirm')}
                                            >
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
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
                                {submitting || sent ? 'In progress…' : 'Reset Password'}
                            </FormButton>
                        </Box>
                    )}
                </Form>
            </AppForm>
            <ToastContainer />
        </React.Fragment>
    );
}

export default withRoot(ResetPassword);