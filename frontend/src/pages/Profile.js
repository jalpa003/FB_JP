import React from 'react';
// import { Field, Form, FormSpy } from 'react-final-form';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import AppForm from '../component/AppForm';
// import RFTextField from '../form/RFTextField';
// import FormButton from '../form/FormButton';
// import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {

    return (
        <React.Fragment>
            <AppAppBar />
            <AppForm>
                <React.Fragment>
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Candidate Profile
                    </Typography>
                </React.Fragment>
            </AppForm>
        </React.Fragment>
    );
};

export default withRoot(Profile);