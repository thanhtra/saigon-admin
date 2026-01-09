'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Control } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormAutocompleteSimple from '@/components/FormAutocompleteSimple';
import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';

import { ErrorMessage, FieldCooperationLabels } from '@/common/const';
import { CollaboratorInput } from '@/common/type';
import useGetAvailableCollaborators from '@/hooks/User/useGetAvailableCollaborators';
import { formGridStyles } from '@/styles/formGrid';

type UserOption = { label: string; value: string };

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
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);

    useEffect(() => {
        if (isEdit && userOption) {
            setUserOptions([userOption]);
            return;
        }

        getAvailableCollaborators({ limit: 200 })
            .then((res) => {
                if (res?.success) {
                    setUserOptions(
                        res.result.map((u: any) => ({
                            label: `${u.name} - ${u.phone}`,
                            value: u.id,
                        }))
                    );
                }
            })
            .catch(() => {
                toast.error(ErrorMessage.SYSTEM);
            });
    }, [getAvailableCollaborators, isEdit, userOption]);

    const fieldOptions = useMemo(
        () => [
            { label: '-- Chọn lĩnh vực --', value: '' },
            ...Object.entries(FieldCooperationLabels).map(([value, label]) => ({ value, label })),
        ],
        []
    );

    return (
        <Box component="form" onSubmit={onSubmit} noValidate sx={formGridStyles.form}>
            <FormAutocompleteSimple
                name="user_id"
                control={control}
                label="Tài khoản"
                options={userOptions}
                required
                disabled={isEdit}
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
                <FormSwitch name="active" control={control} label="Kích hoạt" />
                <Button type="submit" variant="contained" disabled={loading} sx={formGridStyles.submitButton}>
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </Box>
        </Box>
    );
};

export default CollaboratorForm;
