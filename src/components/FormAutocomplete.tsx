// components/FormAutocomplete.tsx
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

type Option = {
    label: string;
    value: string;
};

type Props = {
    name: string;
    control: any;
    label: string;
    options: Option[];
    disabled?: boolean;
    required?: boolean;
};

export default function FormAutocomplete({
    name,
    control,
    label,
    options,
    disabled,
    required,
}: Props) {
    return (
        <Controller
            name={name}
            control={control}
            rules={
                required
                    ? { required: 'Trường bắt buộc' }
                    : undefined
            }
            render={({ field, fieldState }) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(opt, val) => opt.value === val.value}
                    value={options.find(o => o.value === field.value) || null}
                    onChange={(_, newValue) =>
                        field.onChange(newValue?.value || '')
                    }
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            margin="normal"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            required={required}
                        />
                    )}
                />
            )}
        />
    );
}
