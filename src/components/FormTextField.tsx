import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

type Option = { label: string; value: string };

type FormTextFieldProps = {
    name: string;
    control: any;
    label: string;
    rules?: any;
    options?: Option[];
    defaultValue?: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    required?: boolean | string;
    disabled?: boolean;
    type?: string;
};

const FormTextField: React.FC<FormTextFieldProps> = ({
    name,
    control,
    label,
    rules = {},
    options,
    multiline = false,
    rows,
    placeholder,
    required,
    disabled,
    type = 'text'
}) => {
    const mergedRules = {
        ...rules,
        ...(required && {
            required: typeof required === 'string' ? required : 'Trường bắt buộc',
        }),
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={mergedRules}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    type={type}
                    select={!!options}
                    label={label}
                    fullWidth
                    margin="normal"
                    multiline={multiline}
                    rows={multiline ? rows : undefined}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder={placeholder}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                >
                    {options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};

export default FormTextField;
