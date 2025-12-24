import React, { memo } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextField, MenuItem, SxProps, Theme } from '@mui/material';

/* ================= TYPES ================= */

export type SelectOption<T = string> = {
    label: string;
    value: T;
};

type FormTextFieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;

    label: string;
    rules?: any;
    options?: SelectOption[];

    multiline?: boolean;
    rows?: number;
    placeholder?: string;

    required?: boolean | string;
    disabled?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];

    sx?: SxProps<Theme>;
    helperText?: string;
};

/* ================= COMPONENT ================= */

function FormTextField<T extends FieldValues>({
    name,
    control,
    label,
    rules,
    options,
    multiline = false,
    rows,
    placeholder,
    required,
    disabled,
    type = 'text',
    sx,
    helperText,
}: FormTextFieldProps<T>) {
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
            render={({ field, fieldState }) => {
                /* 🔥 DEBUG LOG */
                // console.log('--- FormTextField DEBUG ---');
                // console.log('name:', name);
                // console.log('field.value:', field.value);
                // console.log(
                //     'matched option:',
                //     options?.find(o => o.value === field.value)
                // );

                return (
                    <TextField
                        {...field}
                        value={field.value ?? ''} // ⬅️ BẮT BUỘC
                        type={type}
                        select={Boolean(options)}
                        label={label}
                        fullWidth
                        multiline={multiline}
                        rows={multiline ? rows : undefined}
                        margin="normal"
                        disabled={disabled}
                        placeholder={placeholder}
                        sx={sx}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || helperText}
                        InputLabelProps={{ shrink: true, required: !!required }}
                    >
                        {options?.map(({ value, label }) => (
                            <MenuItem key={String(value)} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            }}
        />
    );
}

/* ================= EXPORT ================= */

export default memo(FormTextField) as typeof FormTextField;
