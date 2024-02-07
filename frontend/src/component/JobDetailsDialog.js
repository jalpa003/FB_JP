import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
} from '@mui/material';

const JobDetailsDialog = ({ selectedJob, handleCloseDialog, handleApply }) => {
    const formatKeyForDisplay = (key) => {
        // Check if key is defined
        if (!key) {
            return '';
        }

        // Convert camelCase to Title Case
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <Dialog open={!!selectedJob} onClose={handleCloseDialog} maxWidth="md">
            <DialogTitle>{selectedJob?.jobTitle}</DialogTitle>
            <DialogContent>
                {/* Display job details here */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Description</Typography>
                        <Typography>{selectedJob?.jobDescription}</Typography>
                        <Typography variant="h6">Location</Typography>
                        <Typography>
                            {selectedJob?.jobLocation
                                ? `${selectedJob?.jobLocation.streetAddress}, ${selectedJob?.jobLocation.city}, ${selectedJob?.jobLocation.province} ${selectedJob?.jobLocation.postalCode}`
                                : 'N/A'}
                        </Typography>
                        <Typography variant="h6">Type</Typography>
                        <Typography>{formatKeyForDisplay(selectedJob?.jobType)}</Typography>
                        <Typography variant="h6">Experience</Typography>
                        <Typography>{selectedJob?.experience}</Typography>
                        <Typography variant="h6">Hours per Week</Typography>
                        <Typography>{selectedJob?.hoursPerWeek}</Typography>
                        <Typography variant="h6">Status</Typography>
                        <Typography>{selectedJob?.status}</Typography>
                        {selectedJob?.showWageRate && (
                            <React.Fragment>
                                <Typography variant="h6">Pay</Typography>
                                <Typography>
                                    ${selectedJob?.payAmount} {selectedJob?.payRate === 'perHour' ? 'per hour' : 'per year'}
                                </Typography>
                            </React.Fragment>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Preferred Start Date</Typography>
                        <Typography>{new Date(selectedJob?.preferredStartDate).toLocaleDateString()}</Typography>

                        {/* Display true values from jobRequirements */}
                        <Typography variant="h6" mt={2}>Job Requirements</Typography>
                        {Object.entries(selectedJob?.jobRequirements || {}).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))}
                        <Typography variant="h6" mt={2}>Work Schedule</Typography>
                        {Object.entries(selectedJob?.workSchedule || {}).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))}
                        <Typography variant="h6" mt={2}>Supplemental Pay</Typography>
                        {Object.entries(selectedJob?.supplementalPay || {}).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))}
                        <Typography variant="h6" mt={2}>Benefits Offered</Typography>
                        {Object.entries(selectedJob?.benefitsOffered || {}).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider sx={{ my: 2 }} />
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Close
                </Button>
                <Button onClick={() => handleApply(selectedJob?._id)} color="primary" variant="contained">
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobDetailsDialog;
