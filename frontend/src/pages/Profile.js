import React, { useState, useEffect, useRef } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import Paper from '../component/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';
import withRoot from '../withRoot';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import DesiredScheduleInput from '../component/DesiredScheduleInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const jobTitles = [
    'Chef',
    'Sous Chef',
    'Line Cook',
    'Pastry Chef',
    'Baker',
    'Kitchen Manager',
    'Food and Beverage Manager',
    'Bartender',
    'Server',
    'Host/Hostess',
    'Catering Manager',
    'Event Planner',
    'Sommelier',
    'Mixologist',
    'Bar Manager',
    'Barista',
    'Dishwasher',
    'Busser',
    'Food Runner',
    'Prep Cook',
    'Food Expeditor',
    'Door Supervisor',
    'Culinary Instructor',
    'Restaurant Manager',
    'General Manager',
    'Shift Supervisor',
    'Restaurant Owner',
];

const sortedJobTitles = jobTitles.sort((a, b) => a.localeCompare(b));
function CandidateProfile() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);
    const [existingDetails, setExistingDetails] = useState({});
    const [phone, setPhone] = React.useState('');
    const [phoneError, setPhoneError] = useState('');
    const imageUrl = `${process.env.REACT_APP_API_URL}/uploads/images/${existingDetails.profilePicture}`;
    const resumeUrl = `${process.env.REACT_APP_API_URL}/uploads/resumes/${existingDetails.resume}`;
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchExistingDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_candidate_profile`, {
                    headers: { Authorization: `${token}` }
                });

                if (response.status === 200) {
                    const storedPhone = response.data?.candidateWithUserDetails?.phone || response.data?.userDetails?.phone;

                    // Format the phone number before setting it in the state
                    setPhone(formatPhoneNumber(storedPhone));

                    setExistingDetails(response.data.candidateWithUserDetails || response.data.userDetails);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while retrieving your profile information!")
            }
        };

        fetchExistingDetails();
    }, []);

    const validate = (values) => {
        // Implement your validation logic here if needed
        const errors = {};
        if (!values.firstName) {
            errors.firstName = 'First Name is required';
        }
        if (!values.lastName) {
            errors.lastName = 'Last Name is required';
        }
        if (!values.email) {
            errors.email = 'Email is required';
        }
        if (!values.phone) {
            errors.phone = 'Phone Number is required';
        }
        if (values.desiredPayType && !values.desiredPayAmount) {
            errors.desiredPayAmount = 'Desired pay amount is required';
        }
        if (values.desiredPayAmount && !values.desiredPayType) {
            errors.desiredPayType = 'Desired pay type is required';
        }
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/complete_candidate_profile`,
                { ...values, phone: phone },
                { headers: { 'Authorization': `${token}` } });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSent(true);

                setTimeout(() => {
                    navigate('/all-jobs');
                }, 2500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            toast.error(errorData.messages);
        }
    };

    const formatPhoneNumber = (phoneNumber) => {
        return phoneNumber ? `+1 ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}` : '';
    };

    const handleEditAvatar = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAvatarMenu = () => {
        setAnchorEl(null);
    };

    const handleUploadNewImage = async (event) => {
        // Check if required fields are completed
        if (!existingDetails.firstName || !existingDetails.lastName || !existingDetails.phone || !existingDetails.email) {
            toast.error('Please complete the required fields before uploading the profile picture.');
            return;
        }
        const fileInput = event.target;
        const file = fileInput.files[0];
        console.log(file);

        if (file) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('image', file);

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload_avatar`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success(response.data.message)

                // Close the avatar menu after uploading
                handleCloseAvatarMenu();

                // Refresh the page to reflect the updated avatar
                window.location.reload();
            } catch (error) {
                const errorData = error.response.data;
                console.error(errorData);
                toast.error(errorData.message);
            }
        }
    };

    const openAvatarMenu = Boolean(anchorEl);
    const id = openAvatarMenu ? 'avatar-menu' : undefined;

    const handleDeleteAvatar = async () => {
        if (!existingDetails.profilePicture) {
            toast.info('You have not uploaded any profile picture to delete.');
            return;
        }
        try {
            // Implement the logic to delete the avatar on the server
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/delete_avatar`, {
                headers: { Authorization: `${token}` }
            });

            // Update the state to trigger a re-render without the avatar
            setExistingDetails({ ...existingDetails, profilePicture: null });

            toast.success('Avatar deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the Profile Picture');
        }
    };

    const handleEditResume = () => {
        // Programmatically trigger the file input click
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = async (event) => {
        // Check if required fields are completed
        if (!existingDetails.firstName || !existingDetails.lastName || !existingDetails.phone || !existingDetails.email) {
            toast.error('Please complete the required fields before uploading the resume.');
            return;
        }

        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('resume', file);

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload_resume`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Update the state to reflect the new resume
                setExistingDetails({ ...existingDetails, resume: response.data.fileName });

                toast.success('Resume updated successfully');

                // Refresh the page to reflect the updated avatar
                window.location.reload();
            } catch (error) {
                console.error(error);
                toast.error('An error occurred while updating the resume');
            }
        }
    };

    const handleDeleteResume = async () => {
        if (!existingDetails.resume) {
            toast.info('You have not uploaded any resume to delete.');
            return;
        }
        try {
            // Implement the logic to delete the resume on the server
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/delete_resume`, {
                headers: { Authorization: `${token}` }
            });

            // Update the state to trigger a re-render without the resume
            setExistingDetails({ ...existingDetails, resume: null });

            toast.success('Resume deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the resume');
        }
    };

    const getFileIcon = (fileExtension) => {
        // Map file extensions to respective icons
        const iconMap = {
            pdf: 'https://shorturl.at/qrty7',
            docx: 'https://shorturl.at/bnEU0',
        };

        // Default icon if extension is not mapped
        const defaultIcon = 'https://shorturl.at/KLS01';

        return iconMap[fileExtension] || defaultIcon;
    };

    const handleResumeIconClick = () => {
        if (!existingDetails.resume) {
            toast.info('Please upload your resume first.');
        } else {
            window.open(resumeUrl, '_blank');
        }
    };

    const getResumeIcon = () => {
        if (!existingDetails.resume) {
            const defaultIconUrl = 'https://shorturl.at/KLS01';
            return (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleResumeIconClick}
                    onKeyPress={(e) => e.key === 'Enter' && handleResumeIconClick()}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={defaultIconUrl}
                        alt="Default Icon"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            );
        }

        const fileExtension = existingDetails.resume.split('.').pop().toLowerCase();
        const iconUrl = getFileIcon(fileExtension);

        return (
            <div
                role="button"
                tabIndex={0}
                onClick={handleResumeIconClick}
                onKeyPress={(e) => e.key === 'Enter' && handleResumeIconClick()}
                style={{ cursor: 'pointer' }}
            >
                <img
                    src={iconUrl}
                    alt="Resume Icon"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        );
    };

    const isValidPhoneNumber = (value) => {
        return value.startsWith('+1');
    };

    const handleOnChange = (value) => {
        setPhone(value);
        if (!isValidPhoneNumber(value)) {
            setPhoneError('Phone number must start with +1');
        } else {
            setPhoneError('');
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
                        {/* Profile Header */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Avatar
                                alt="Avatar"
                                src={existingDetails.profilePicture ? imageUrl : 'https://shorturl.at/bhEW7'}
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                                <IconButton onClick={handleEditAvatar}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={handleDeleteAvatar}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                            <Popover
                                id={id}
                                open={openAvatarMenu}
                                anchorEl={anchorEl}
                                onClose={handleCloseAvatarMenu}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Box sx={{ p: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleUploadNewImage}
                                        ref={(input) => input && input.click()}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Upload New Avatar
                                    </Typography>
                                </Box>
                            </Popover>

                            <Typography variant="h4" gutterBottom marked="center" align="center">
                                {`${existingDetails.firstName} ${existingDetails.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                {existingDetails.headline}
                            </Typography>
                        </Box>
                        <React.Fragment>
                            {/* Display Avatar with edit and delete options */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                                {/* Display Resume on the right */}
                                <Box sx={{ position: 'relative', width: '160px', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                                    {getResumeIcon()}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption">
                                            {existingDetails.resume && existingDetails.resume.split('.').pop().toUpperCase()}
                                        </Typography>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                style={{ display: 'none' }}
                                                onChange={handleFileInputChange}
                                                ref={fileInputRef}
                                            />
                                            <IconButton onClick={handleEditResume}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={handleDeleteResume}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                </Box>
                            </Box>
                        </React.Fragment>
                        <Form
                            initialValues={existingDetails}
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
                                                label="First Name"
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
                                                label="Last Name"
                                                name="lastName"
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Headline"
                                        name="headline"
                                    />
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <label htmlFor="phone">Phone Number</label>
                                            <PhoneInput
                                                country={'ca'}
                                                value={phone}
                                                onChange={handleOnChange}
                                                onlyCountries={['ca']}
                                                inputProps={{ name: 'phone', required: true }}
                                                disableDropdown
                                            />
                                            {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
                                        </Grid>
                                        <Grid item xs={10} sm={4}>
                                            <Field name="showPhoneToEmployers" type="checkbox">
                                                {({ input }) => (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox {...input} />}
                                                        label="Viewable by Employers?"
                                                        sx={{ paddingTop: '12px' }}
                                                    />
                                                )}
                                            </Field>
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
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Street Address"
                                        name="address.streetAddress"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                fullWidth
                                                label="City"
                                                name="address.city"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                fullWidth
                                                label="Province"
                                                name="address.province"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Postal Code"
                                        name="address.postalCode"
                                    />
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Desired Job Title"
                                        name="desiredJobTitle"
                                        select
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select</option>
                                        {sortedJobTitles.map((title) => (
                                            <option key={title} value={title}>
                                                {title}
                                            </option>
                                        ))}
                                    </Field>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Desired Job Type"
                                        name="desiredJobType"
                                        select
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select</option>
                                        <option value="fullTime">Full Time</option>
                                        <option value="partTime">Part Time</option>
                                        <option value="internship">Internship</option>
                                        <option value="casual">Casual</option>
                                        <option value="seasonal">Seasonal</option>
                                    </Field>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                autoFocus
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                fullWidth
                                                label="Desired Pay"
                                                name="desiredPayAmount"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                autoFocus
                                                component={RFTextField}
                                                disabled={submitting || sent}
                                                fullWidth
                                                select
                                                label="Desired Pay Type"
                                                name="desiredPayType"
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Select</option>
                                                <option value="perHour">Per Hour</option>
                                                <option value="perYear">Per Year</option>
                                            </Field>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: '16px' }} />
                                    <Typography variant="h6" gutterBottom>
                                        Desired Work Schedule
                                    </Typography>
                                    <DesiredScheduleInput disabled={submitting} submitting={submitting} sent={sent} />
                                    <Typography variant="h6" gutterBottom>
                                        Job Training
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.smartServe"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Smart Serve"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.culinaryTraining"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Culinary Training"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.redSeal"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Red Seal"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.workplaceSafety"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Workplace Safety"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.customerService"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Customer Service"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.bartending"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Bartending"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.barista"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Barista"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.fineDining"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="Fine Dining"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        type="checkbox"
                                                        name="jobTraining.POSExperience"
                                                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                                                    />
                                                }
                                                label="POS Experience"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Experience Level"
                                        name="experienceLevel"
                                        select
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select</option>
                                        <option value="<1">Less than 1 year</option>
                                        <option value="1-3">1 to 3 years</option>
                                        <option value="3-5">3 to 5 years</option>
                                        <option value="5-7">5 to 7 years</option>
                                        <option value="7-10">7 to 10 years</option>
                                        <option value="10+">More than 10 years</option>
                                    </Field>
                                    <Field
                                        component={RFTextField}
                                        disabled={submitting || sent}
                                        fullWidth
                                        label="Language Skills"
                                        name="languageSkills"
                                        placeholder="Enter language skills separated by commas (e.g., English,French)"
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
                                        {submitting ? 'In progress…' : sent ? 'Success!' : existingDetails.isProfileComplete ? 'Save Profile' : 'Complete Profile'}
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
}

export default withRoot(CandidateProfile);