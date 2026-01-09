'use client';

import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useState, useMemo } from 'react';

type Option = { label: string; value: string };

type Props = {
    name: string;
    control: any;
    label: string;
    options: Option[]; // 🔹 truyền toàn bộ danh sách từ parent
    required?: boolean;
    disabled?: boolean;
};

export default function FormAutocompleteSimple({
    name,
    control,
    label,
    options,
    required = false,
    disabled = false,
}: Props) {
    const [inputValue, setInputValue] = useState('');

    const filteredOptions = useMemo(() => {
        return options.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }, [options, inputValue]);

    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: 'Trường bắt buộc' } : undefined}
            render={({ field, fieldState }) => {
                const selected = options.find((o) => o.value === field.value) || null;

                return (
                    <Autocomplete
                        options={filteredOptions}
                        value={selected}
                        onChange={(_, newValue) => field.onChange(newValue?.value || '')}
                        inputValue={inputValue}
                        onInputChange={(_, value) => setInputValue(value)}
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(o, v) => o.value === v.value}
                        disabled={disabled}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                label={label}
                                required={required}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                );
            }}
        />
    );
}
