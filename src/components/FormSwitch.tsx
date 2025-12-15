import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { FormControlLabel } from '@mui/material';
import { IOSSwitch } from '@/styles/common';

type FormSwitchProps = {
    name: string;
    control: Control<any>;
    label?: string;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
    sx?: any;
    defaultChecked?: boolean;
};

const FormSwitch: React.FC<FormSwitchProps> = ({
    name,
    control,
    label = 'Kích hoạt',
    labelPlacement = 'end',
    sx,
    defaultChecked = false
}) => {
    return (
        <FormControlLabel
            control={
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <IOSSwitch
                            {...field}
                            checked={!!field.value}
                            defaultChecked={defaultChecked}
                        />
                    )}
                />
            }
            label={label}
            labelPlacement={labelPlacement}
            sx={{
                margin: '20px 10px 0px 0px',
                gap: 2,
                '& .MuiFormControlLabel-label': {
                    marginRight: '10px',
                },
                ...sx,
            }}
        />
    );
};

export default FormSwitch;
