'use client';

import { Box, Button } from '@mui/material';
import { useMemo } from 'react';
import { Control } from 'react-hook-form';

import FormAutocompleteSimple from '@/components/FormAutocompleteSimple';
import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';

import { CollaboratorTypeLabels, FieldCooperationLabels } from '@/common/const';
import { formGridStyles } from '@/styles/formGrid';
import { Option } from '@/common/type';
import { CollaboratorTypeForm } from '@/types';


type Props = {
    control: Control<CollaboratorTypeForm>;
    loading?: boolean;
    onSubmit: () => void;
    isEdit?: boolean;
    userOption?: Option | null;
    userOptions?: Option[];
};

const CollaboratorForm: React.FC<Props> = ({
    control,
    loading = false,
    onSubmit,
    isEdit = false,
    userOption,
    userOptions = [],
}) => {
    const fieldOptions = useMemo(
        () => [
            { label: '-- Chọn lĩnh vực --', value: '' },
            ...Object.entries(FieldCooperationLabels).map(([value, label]) => ({ value, label })),
        ],
        []
    );

    const typeOptions = useMemo(
        () => [
            { label: '-- Chọn loại tài khoản --', value: '' },
            ...Object.entries(CollaboratorTypeLabels).map(([value, label]) => ({ value, label })),
        ],
        []
    );

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
                name="type"
                control={control}
                label="Loại tài khoản"
                required
                options={typeOptions}
            />

            <FormTextField
                name="field_cooperation"
                control={control}
                label="Lĩnh vực hợp tác"
                required
                options={fieldOptions}
            />

            <FormTextField
                name="note"
                control={control}
                label="Mô tả"
                multiline
                minRows={1}
                maxRows={10}
            />

            <Box sx={formGridStyles.actionRow}>
                <Box sx={formGridStyles.actionRight}>
                    <FormSwitch name="is_confirmed_ctv" control={control} label="Đăng kí CTV" />
                </Box>
                <Box sx={formGridStyles.actionRight}>
                    <FormSwitch name="active" control={control} label="Kích hoạt" />
                    <Button type="submit" variant="contained" disabled={loading} sx={formGridStyles.submitButton}>
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CollaboratorForm;
