'use client';

import { Box, Button } from '@mui/material';
import { useMemo } from 'react';
import { Control } from 'react-hook-form';
import FormAutocompleteSimple from '@/components/FormAutocompleteSimple';
import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import { TenantInput } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';
import { Option } from '@/common/type';

type Props = {
    control: Control<TenantInput>;
    loading?: boolean;
    onSubmit: () => void;
    isEdit?: boolean;
    userOption?: Option | null;
    userOptions?: Option[];
};

const TenantForm: React.FC<Props> = ({
    control,
    loading = false,
    onSubmit,
    isEdit = false,
    userOption,
    userOptions = [],
}) => {

    return (
        <Box component="form" onSubmit={onSubmit} noValidate sx={formGridStyles.form}>
            <FormAutocompleteSimple
                name="user_id"
                control={control}
                label="Tài khoản"
                options={isEdit && userOption ? [userOption] : userOptions}
                required
                disabled={isEdit}
            />

            <FormTextField
                name="note"
                control={control}
                label="Ghi chú"
                multiline
                minRows={1}
                maxRows={10}
            />

            <Box sx={formGridStyles.actionRow}>
                <FormSwitch name="active" control={control} label="Kích hoạt" />
                <Button type="submit" variant="contained" disabled={loading} sx={formGridStyles.submitButton}>
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </Box>
        </Box>
    );
};

export default TenantForm;
