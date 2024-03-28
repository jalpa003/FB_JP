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
        if (!key) {
            return '';
        }
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    const renderDetails = () => {
        if (!selectedJob) {
            return null;
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Full Job Description</Typography>
                    <Typography>{selectedJob?.jobDescription || 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Location</Typography>
                    <Typography>
                        {selectedJob?.jobLocation
                            ? `${selectedJob?.jobLocation.streetAddress}, ${selectedJob?.jobLocation.city}, ${selectedJob?.jobLocation.province} ${selectedJob?.jobLocation.postalCode}`
                            : 'N/A'}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Type</Typography>
                    <Typography>{formatKeyForDisplay(selectedJob?.jobType) || 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Experience</Typography>
                    <Typography>{selectedJob?.experience || 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Hours per Week</Typography>
                    <Typography>{selectedJob?.hoursPerWeek || 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Preferred Start Date</Typography>
                    <Typography>{selectedJob?.preferredStartDate ? new Date(selectedJob?.preferredStartDate).toLocaleDateString() : 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Job Requirements</Typography>
                    {Object.entries(selectedJob?.jobRequirements || {}).map(([key, value]) => value && (
                        <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Work Schedule</Typography>
                    {selectedJob?.workSchedule && Object.values(selectedJob?.workSchedule).some(val => val) ? (
                        Object.entries(selectedJob?.workSchedule).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))
                    ) : (
                        <Typography>N/A</Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Supplemental Pay</Typography>
                    {selectedJob?.supplementalPay && Object.values(selectedJob?.supplementalPay).some(val => val) ? (
                        Object.entries(selectedJob?.supplementalPay).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))
                    ) : (
                        <Typography>N/A</Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Benefits Offered</Typography>
                    {selectedJob?.benefitsOffered && Object.values(selectedJob?.benefitsOffered).some(val => val) ? (
                        Object.entries(selectedJob?.benefitsOffered).map(([key, value]) => value && (
                            <Typography key={key}>- {formatKeyForDisplay(key)}</Typography>
                        ))
                    ) : (
                        <Typography>N/A</Typography>
                    )}
                </Grid>
            </Grid>
        );
    };

    return (
        <Dialog open={!!selectedJob} onClose={handleCloseDialog} maxWidth="md">
            <DialogTitle sx={{ backgroundColor: '#f50057', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h5">{selectedJob?.jobTitle}</Typography>
                <Divider />
            </DialogTitle>

            <DialogContent>
                {renderDetails()}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
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