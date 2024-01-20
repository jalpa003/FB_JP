import React from 'react';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'react-final-form';

const BenefitsOfferedCheckboxGroup = () => {
    const benefitCheckboxes = [
        'dentalCare',
        'extendedHealthCare',
        'lifeInsurance',
        'rrspMatch',
        'paidTimeOff',
        'onSiteParking',
        'profitSharing',
        'flexibleSchedule',
        'employeeAssistanceProgram',
        'discountedOrFreeFoodBeverage',
        'tuitionReimbursement',
        'wellnessProgram',
        'relocationAssistance',
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={5} sm={10}>
                {benefitCheckboxes.map((checkbox) => (
                    <FormControlLabel
                        key={checkbox}
                        control={
                            <Field
                                type="checkbox"
                                name={`benefitsOffered.${checkbox}`}
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

export default BenefitsOfferedCheckboxGroup;