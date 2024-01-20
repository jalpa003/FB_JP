import React from 'react';
import { Field } from 'react-final-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const WorkScheduleCheckboxGroup = () => {
    return (
        <>
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.weekDayAvailability"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Week Day Availability"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.weekendAvailability"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="WeekEnd Availability"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.dayShift"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Day Shifts"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.eveningShift"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Evening Shifts"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.onCall"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="On Call"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="workSchedule.holidays"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Holidays"
            />
        </>
    );
};

export default WorkScheduleCheckboxGroup;
