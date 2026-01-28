// import React, { memo } from 'react';
// import {
//     Controller,
//     Control,
//     FieldValues,
//     Path,
//     RegisterOptions,
// } from 'react-hook-form';
// import {
//     TextField,
//     MenuItem,
//     SxProps,
//     Theme,
// } from '@mui/material';

// /* ================= HELPERS ================= */

// const formatCurrency = (value?: number | string) => {
//     if (value === null || value === undefined || value === '') return '';
//     const number =
//         typeof value === 'string'
//             ? Number(value.replace(/\D/g, ''))
//             : value;

//     return isNaN(number) ? '' : number.toLocaleString('vi-VN');
// };

// const parseCurrency = (value: string) => {
//     if (!value) return '';
//     return Number(value.replace(/\D/g, ''));
// };


// /* ================= TYPES ================= */

// export type SelectOption<T = string> = {
//     label: string;
//     value: T;
// };

// type FormTextFieldProps<T extends FieldValues> = {
//     name: Path<T>;
//     control: Control<T>;

//     label: string;
//     rules?: RegisterOptions<T>;
//     options?: SelectOption[];

//     multiline?: boolean;
//     minRows?: number;
//     maxRows?: number;
//     rows?: number;
//     placeholder?: string;

//     required?: boolean | string;
//     disabled?: boolean;
//     type?: React.InputHTMLAttributes<unknown>['type'];

//     sx?: SxProps<Theme>;
//     helperText?: string;

//     inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

//     /** 🔥 NEW: format hiển thị */
//     format?: 'currency';
// };

// /* ================= COMPONENT ================= */

// function FormTextField<T extends FieldValues>({
//     name,
//     control,
//     label,
//     rules,
//     options,
//     multiline = false,
//     rows,
//     placeholder,
//     required,
//     disabled,
//     type = 'text',
//     sx,
//     helperText,
//     minRows,
//     maxRows,
//     inputProps,
//     format,
// }: FormTextFieldProps<T>) {
//     const mergedRules: RegisterOptions<T> = {
//         ...rules,
//         ...(required && {
//             required:
//                 typeof required === 'string'
//                     ? required
//                     : 'Trường này là bắt buộc',
//         }),
//     };

//     return (
//         <Controller
//             name={name}
//             control={control}
//             rules={mergedRules}
//             render={({ field, fieldState }) => {
//                 const displayValue =
//                     format === 'currency'
//                         ? formatCurrency(field.value)
//                         : field.value ?? '';

//                 return (
//                     <TextField
//                         {...field}
//                         value={displayValue}
//                         type={format === 'currency' ? 'text' : type}
//                         select={Boolean(options)}
//                         label={label}
//                         fullWidth
//                         multiline={multiline}
//                         minRows={multiline ? minRows : undefined}
//                         maxRows={multiline ? maxRows : undefined}
//                         rows={multiline && rows ? rows : undefined}
//                         margin="normal"
//                         disabled={disabled}
//                         placeholder={placeholder}
//                         sx={sx}
//                         error={!!fieldState.error}
//                         helperText={fieldState.error?.message || helperText}
//                         inputProps={{
//                             ...inputProps,
//                             ...(format === 'currency' && {
//                                 inputMode: 'numeric',
//                             }),
//                         }}
//                         InputLabelProps={{ shrink: true }}
//                         onChange={(e) => {
//                             if (format === 'currency') {
//                                 const raw = e.target.value;

//                                 // ✅ Cho phép xoá sạch
//                                 if (raw === '') {
//                                     field.onChange('');
//                                     return;
//                                 }

//                                 field.onChange(parseCurrency(raw));
//                             } else {
//                                 field.onChange(e.target.value);
//                             }
//                         }}

//                     >
//                         {options?.map(({ value, label }) => (
//                             <MenuItem key={String(value)} value={value}>
//                                 {label}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                 );
//             }}
//         />
//     );
// }

// /* ================= EXPORT ================= */

// export default memo(FormTextField) as typeof FormTextField;



import React, { memo } from 'react';
import {
    Controller,
    Control,
    FieldValues,
    Path,
    RegisterOptions,
} from 'react-hook-form';
import {
    TextField,
    MenuItem,
    SxProps,
    Theme,
} from '@mui/material';

/* ================= HELPERS ================= */

const formatCurrency = (value?: number | string) => {
    if (value === null || value === undefined || value === '') return '';

    const number =
        typeof value === 'string'
            ? Number(value.replace(/\D/g, ''))
            : value;

    if (isNaN(number) || number === 0) return '';

    return number.toLocaleString('vi-VN');
};

const parseCurrency = (value: string) => {
    if (!value) return '';
    return Number(value.replace(/\D/g, ''));
};

/* ================= TYPES ================= */

export type SelectOption<T = string> = {
    label: string;
    value: T;
};

type FormTextFieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;

    label: string;
    rules?: RegisterOptions<T>;
    options?: SelectOption[];

    multiline?: boolean;
    minRows?: number;
    maxRows?: number;
    rows?: number;
    placeholder?: string;

    required?: boolean | string;
    disabled?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];

    sx?: SxProps<Theme>;
    helperText?: string;

    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

    /** format hiển thị */
    format?: 'currency';

    /** 🔥 NEW: ẩn hiển thị khi value = 0 */
    hideZero?: boolean;
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
    minRows,
    maxRows,
    inputProps,
    format,
    hideZero = true,
}: FormTextFieldProps<T>) {
    const mergedRules: RegisterOptions<T> = {
        ...rules,
        ...(required && {
            required:
                typeof required === 'string'
                    ? required
                    : 'Trường này là bắt buộc',
        }),
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={mergedRules}
            render={({ field, fieldState }) => {
                const displayValue =
                    format === 'currency'
                        ? hideZero && field.value === 0
                            ? ''
                            : formatCurrency(field.value)
                        : field.value ?? '';

                return (
                    <TextField
                        {...field}
                        value={displayValue}
                        type={format === 'currency' ? 'text' : type}
                        select={Boolean(options)}
                        label={label}
                        fullWidth
                        multiline={multiline}
                        minRows={multiline ? minRows : undefined}
                        maxRows={multiline ? maxRows : undefined}
                        rows={multiline && rows ? rows : undefined}
                        margin="normal"
                        disabled={disabled}
                        placeholder={placeholder}
                        sx={sx}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || helperText}
                        inputProps={{
                            ...inputProps,
                            ...(format === 'currency' && {
                                inputMode: 'numeric',
                            }),
                        }}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            if (format === 'currency') {
                                const raw = e.target.value;

                                // cho phép xoá sạch
                                if (raw === '') {
                                    field.onChange('');
                                    return;
                                }

                                field.onChange(parseCurrency(raw));
                            } else {
                                field.onChange(e.target.value);
                            }
                        }}
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
