import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Field } from 'react-final-form';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['Morning', 'Afternoon', 'Evening', 'Night'];

const DesiredScheduleInput = ({ submitting, sent }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Days</TableCell>
                                {times.map(time => (
                                    <TableCell key={time}>{time}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {days.map(day => (
                                <TableRow key={day}>
                                    <TableCell>{day}</TableCell>
                                    {times.map(time => (
                                        <TableCell key={time}>
                                            <Field
                                                type="checkbox"
                                                name={`desiredSchedule.${day}.${time}`}
                                                disabled={submitting || sent}
                                                render={({ input }) => (
                                                    <FormControlLabel
                                                        control={<Checkbox {...input} />}
                                                        label=""
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default DesiredScheduleInput;