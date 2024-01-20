import React from 'react';
import { Field } from 'react-final-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const SupplementalPayCheckboxGroup = () => {
    return (
        <>
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="supplementalPay.overtime"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Overtime"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="supplementalPay.bonusPay"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Bonus Pay"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="supplementalPay.tips"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Tips"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="supplementalPay.signingBonus"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Signing Bonus"
            />
            <FormControlLabel
                control={
                    <Field
                        type="checkbox"
                        name="supplementalPay.retentionBonus"
                        render={({ input }) => <Checkbox {...input} onChange={(e) => input.onChange(e.target.checked)} />}
                    />
                }
                label="Retention Bonus"
            />

        </>
    );
};

export default SupplementalPayCheckboxGroup;
