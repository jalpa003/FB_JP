import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

const AppliedUsersDialog = ({ open, handleClose, job }) => {
    // If job data is not yet available, show a loading spinner
    if (!job) {
        return (
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    // Construct the base URL for resumes
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Applied Users for {job.jobTitle}</DialogTitle>
            <DialogContent>
                {job.appliedUsers.map((user) => (
                    <div key={user._id}>
                        <DialogContentText>
                            User: {user.firstName} {user.lastName}
                        </DialogContentText>
                        <a href={`${baseURL}/uploads/resumes/${user.resume}`} target="_blank" rel="noopener noreferrer">
                            View Resume
                        </a>
                        <hr />
                    </div>
                ))}
            </DialogContent>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
        </Dialog>
    );
};

export default AppliedUsersDialog;
