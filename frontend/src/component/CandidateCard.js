import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Tooltip from '@mui/material/Tooltip';
import CandidateScheduleDialog from './CandidateScheduleDialog';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 300,
    margin: theme.spacing(2),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.03)',
    },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 200,
    objectFit: 'cover',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const CandidateCard = ({ candidate }) => {
    const { user, phone, profilePicture, resume, desiredSchedule } = candidate;

    // Check if the user object exists before destructuring its properties
    const firstName = user ? user.firstName : '';
    const lastName = user ? user.lastName : '';
    const email = user ? user.email : '';

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const openResumeInNewTab = () => {
        window.open(`${process.env.REACT_APP_API_URL}/uploads/resumes/${resume}`, '_blank');
    };

    const openSchedule = () => {
        setIsScheduleOpen(true);
    };

    const closeSchedule = () => {
        setIsScheduleOpen(false);
    };

    return (
        <StyledCard>
            <StyledCardMedia
                component="img"
                image={profilePicture ? `${process.env.REACT_APP_API_URL}/uploads/images/${profilePicture}` : 'https://shorturl.at/dzDVY'}
                alt={`${firstName} ${lastName}`}
            />
            <StyledCardContent>
                <Typography variant="h5" gutterBottom>
                    {`${firstName} ${lastName}`}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                        {email}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <PhoneIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                        {phone}
                    </Typography>
                </Box>
                <Box mt={2}>
                    {resume && (
                        <Button variant="outlined" onClick={openResumeInNewTab}>
                            View Resume
                        </Button>
                    )}
                    {desiredSchedule && (
                        <Tooltip title="View Availability">
                            <IconButton onClick={openSchedule}>
                                <EventNoteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <CandidateScheduleDialog isOpen={isScheduleOpen} onClose={closeSchedule} schedule={desiredSchedule} />
                </Box>
            </StyledCardContent>
        </StyledCard>
    );
};

export default CandidateCard;