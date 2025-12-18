// import React from 'react';
// import { Controller } from 'react-hook-form';
// import { TextField, MenuItem } from '@mui/material';

// type Option = { label: string; value: string };

// type FormTextFieldProps = {
//     name: string;
//     control: any;
//     label: string;
//     rules?: any;
//     options?: Option[];
//     defaultValue?: string;
//     multiline?: boolean;
//     rows?: number;
//     placeholder?: string;
//     required?: boolean | string;
//     disabled?: boolean;
//     type?: string;
// };

// const FormTextField: React.FC<FormTextFieldProps> = ({
//     name,
//     control,
//     label,
//     rules = {},
//     options,
//     multiline = false,
//     rows,
//     placeholder,
//     required,
//     disabled,
//     type = 'text'
// }) => {
//     const mergedRules = {
//         ...rules,
//         ...(required && {
//             required: typeof required === 'string' ? required : 'Trường bắt buộc',
//         }),
//     };

//     return (
//         <Controller
//             name={name}
//             control={control}
//             rules={mergedRules}
//             render={({ field, fieldState }) => (
//                 <TextField
//                     {...field}
//                     type={type}
//                     select={!!options}
//                     label={label}
//                     fullWidth
//                     margin="normal"
//                     multiline={multiline}
//                     rows={multiline ? rows : undefined}
//                     error={!!fieldState.error}
//                     helperText={fieldState.error?.message}
//                     placeholder={placeholder}
//                     disabled={disabled}
//                     InputLabelProps={{ shrink: true }}
//                 >
//                     {options?.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                         </MenuItem>
//                     ))}
//                 </TextField>
//             )}
//         />
//     );
// };

// export default FormTextField;

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
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
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
                    InputLabelProps={{ shrink: true, required: !!required, }}
                >
                    {options?.map(({ value, label }) => (
                        <MenuItem key={String(value)} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
}

/* ================= EXPORT ================= */

export default memo(FormTextField) as typeof FormTextField;
