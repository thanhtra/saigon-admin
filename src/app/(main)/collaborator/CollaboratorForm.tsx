'use client';

import { Box, Button } from '@mui/material';
import { Control } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCallback, useEffect } from 'react';

import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import FormAutocompleteSimple from '@/components/FormAutocompleteSimple';

import { FieldCooperationLabels } from '@/common/const';
import { CollaboratorInput } from '@/common/type';

import useGetAvailableCollaborators from '@/hooks/User/useGetAvailableCollaborators';
import { formGridStyles } from '@/styles/formGrid';

type UserOption = {
    label: string;
    value: string;
};

type Props = {
    control: Control<CollaboratorInput>;
    loading?: boolean;
    onSubmit: () => void;
    isEdit?: boolean;
    userOption?: UserOption | null;
};

const CollaboratorForm: React.FC<Props> = ({
    control,
    loading = false,
    onSubmit,
    isEdit = false,
    userOption,
}) => {
    const { getAvailableCollaborators } = useGetAvailableCollaborators();

    const fetchUserOptions = useCallback(
        async (keyword?: string) => {
            if (isEdit) return [];

            try {
                const res = await getAvailableCollaborators({
                    keyword,
                    limit: 200,
                });

                if (!res?.success) return [];

                return res.result.map((u: any) => ({
                    label: `${u.name} - ${u.phone}`,
                    value: u.id,
                }));
            } catch {
                toast.error('Không thể tải danh sách người dùng');
                return [];
            }
        },
        [getAvailableCollaborators, isEdit],
    );

    const fieldOptions = [
        { label: '-- Chọn lĩnh vực --', value: '' },
        ...Object.entries(FieldCooperationLabels).map(
            ([value, label]) => ({ value, label }),
        ),
    ];

    // 🔥 LOG OPTIONS
    useEffect(() => {
        console.log('FIELD OPTIONS:', fieldOptions);
    }, []);

    return (
        <Box component="form" onSubmit={onSubmit} noValidate sx={formGridStyles.form}>
            {/* USER */}
            <FormAutocompleteSimple
                name="user_id"
                control={control}
                label="Người dùng"
                fetchOptions={fetchUserOptions}
                required
                disabled={isEdit}
                defaultOptions={userOption ? [userOption] : []}
            />

            {/* FIELD */}
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
                rows={2}
            />

            <Box sx={formGridStyles.actionRow}>
                <FormSwitch
                    name="active"
                    control={control}
                    label="Kích hoạt"
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={formGridStyles.submitButton}
                >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </Box>
        </Box>
    );
};

export default CollaboratorForm;
