'use client';

import { Controller } from 'react-hook-form';
import {
    Autocomplete,
    CircularProgress,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Option = {
    label: string;
    value: string;
};

type Props = {
    name: string;
    control: any;
    label: string;
    fetchOptions: () => Promise<Option[]>;
    required?: boolean;
    disabled?: boolean;

    /** ⭐ NEW – dùng cho edit */
    defaultOptions?: Option[];
};

export default function FormAutocompleteSimple({
    name,
    control,
    label,
    fetchOptions,
    required,
    disabled,
    defaultOptions = [],
}: Props) {
    const [options, setOptions] = useState<Option[]>(defaultOptions);
    const [loading, setLoading] = useState(false);

    /* 🔥 LOAD OPTION */
    useEffect(() => {
        let mounted = true;

        // 👉 Nếu có defaultOptions (edit) thì dùng luôn
        if (defaultOptions.length) {
            setOptions(defaultOptions);
            return;
        }

        setLoading(true);
        fetchOptions()
            .then((data) => {
                if (mounted) setOptions(data || []);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [fetchOptions, defaultOptions]);

    return (
        <Controller
            name={name}
            control={control}
            rules={
                required
                    ? { required: 'Trường bắt buộc' }
                    : undefined
            }
            render={({ field, fieldState }) => {
                const selected =
                    options.find(
                        (o) => o.value === field.value,
                    ) || null;

                return (
                    <Autocomplete
                        options={options}
                        loading={loading}
                        value={selected}
                        onChange={(_, newValue) =>
                            field.onChange(
                                newValue?.value || '',
                            )
                        }
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(o, v) =>
                            o.value === v.value
                        }
                        disabled={disabled}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                label={label}
                                required={required}
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error?.message
                                }
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading && (
                                                <CircularProgress
                                                    size={18}
                                                />
                                            )}
                                            {
                                                params.InputProps
                                                    .endAdornment
                                            }
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                );
            }}
        />
    );
}
