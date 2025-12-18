'use client';

import { Box, Button } from '@mui/material';
import { Control } from 'react-hook-form';
import FormTextField from '@/components/FormTextField';
import FormSwitch from '@/components/FormSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';
import { formGridStyles } from '@/styles/formGrid';
import {
    CollaboratorTypeLabels,
    FieldCooperationLabels,
} from '@/common/const';
import { CollaboratorInput } from '@/common/type';
import useAvailableCollaboratorUsers from '@/hooks/Collaborator/useAvailableCollaborator';
import { useEffect } from 'react';

type Props = {
    control: Control<CollaboratorInput>;
    loading?: boolean;
    onSubmit: () => void;
};

const CollaboratorForm: React.FC<Props> = ({
    control,
    loading,
    onSubmit,
}) => {

    const { fetchUsers, options: userOptions, loading: xxx } =
        useAvailableCollaboratorUsers();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            sx={formGridStyles.form}
        >
            <FormAutocomplete
                name="user_id"
                control={control}
                label="Người dùng"
                options={userOptions}
                required
                disabled={loading}
            />

            <FormTextField
                name="type"
                control={control}
                label="Loại cộng tác"
                required
                options={[
                    { label: '-- Chọn loại --', value: '' },
                    ...Object.entries(CollaboratorTypeLabels).map(([value, label]) => ({
                        label,
                        value,
                    })),
                ]}
            />

            <FormTextField
                name="field_cooperation"
                control={control}
                label="Lĩnh vực hợp tác"
                required
                options={[
                    { label: '-- Chọn lĩnh vực --', value: '' },
                    ...Object.entries(FieldCooperationLabels).map(([value, label]) => ({
                        label,
                        value,
                    })),
                ]}
            />

            <Box sx={formGridStyles.alignRight}>
                <FormSwitch
                    name="active"
                    control={control}
                    label="Kích hoạt"
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={formGridStyles.submitButton}
            >
                {loading ? 'Đang tạo...' : 'Tạo cộng tác viên'}
            </Button>
        </Box>
    );
};

export default CollaboratorForm;
