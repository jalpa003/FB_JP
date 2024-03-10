import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const CandidateScheduleDialog = ({ isOpen, onClose, schedule }) => {
    // Define the days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Candidate Schedule</DialogTitle>
            <DialogContent>
                <Box overflow="auto">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Time</TableCell>
                                {daysOfWeek.map(day => (
                                    <TableCell key={day} align="center">{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                                <TableRow key={time}>
                                    <TableCell component="th" scope="row" align="center">{time}</TableCell>
                                    {daysOfWeek.map(day => (
                                        <TableCell key={`${day}-${time}`} align="center" style={{ backgroundColor: schedule[day][time] ? 'lightgreen' : 'lightgray' }}>
                                            {schedule[day][time] ? 'Available' : 'Not Available'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CandidateScheduleDialog;
