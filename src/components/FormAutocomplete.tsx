import { Controller } from 'react-hook-form';
import { Autocomplete, SxProps, TextField, Theme } from '@mui/material';
import { Option } from '@/common/type';


type Props = {
    name: string;
    control: any;
    label: string;
    options: Option[];
    disabled?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
    size?: 'small' | 'medium';
};

export default function FormAutocomplete({
    name,
    control,
    label,
    options,
    disabled,
    required,
    sx,
    size = 'medium'
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
                    sx={sx}
                    options={options}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(opt, val) => opt.value === val.value}
                    value={options.find(o => o.value === field.value) || null}
                    onChange={(_, newValue) =>
                        field.onChange(newValue?.value || '')
                    }
                    size={size}
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
