import React from 'react';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'react-final-form';

const JobRequirementsCheckboxGroup = () => {
    const jobRequirementsCheckboxes = [
        'smartServe',
        'culinaryTraining',
        'redSeal',
        'workplaceSafety',
        'customerService',
        'barTending',
        'barista',
        'fineDining',
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={10}>
                {jobRequirementsCheckboxes.map((checkbox) => (
                    <FormControlLabel
                        key={checkbox}
                        control={
                            <Field
                                type="checkbox"
                                name={`jobRequirements.${checkbox}`}
                                render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                            />
                        }
                        label={checkbox
                            .split(/(?=[A-Z])/)
                            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                            .join(' ')}
                    />
                ))}
            </Grid>
        </Grid>
    );
};

export default JobRequirementsCheckboxGroup;
