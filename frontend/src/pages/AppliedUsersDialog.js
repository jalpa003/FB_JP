import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Resume</TableCell>
                                <TableCell>Additional Questions Responses</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {job.appliedUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <a href={`${baseURL}/uploads/resumes/${user.resume}`} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            {user.additionalQuestionsResponses.map((response, index) => (
                                                <li key={index}>
                                                    {response.question}: {response.response}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
