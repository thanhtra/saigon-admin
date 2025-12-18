'use client';

import { UserRoleOptions } from '@/common/const';
import { User } from '@/common/type';
import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import { formGridStyles } from '@/styles/formGrid';
import { Box, Button } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';

type UserFormProps = {
    control: Control<User>;
    errors: FieldErrors<User>;
    loading?: boolean;
    onSubmit: () => void;
    isEdit?: boolean;
};


const UserForm: React.FC<UserFormProps> = ({
    control,
    loading = false,
    onSubmit,
    isEdit = false,
}) => {
    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            sx={formGridStyles.form}
        >
            <FormTextField
                name="name"
                control={control}
                label="Tên"
                required
            />

            <FormTextField
                name="phone"
                control={control}
                label="Số điện thoại"
                required
            />

            <FormTextField
                name="email"
                control={control}
                label="Email"
            />

            {/* 🔒 Password chỉ hiện khi Create */}
            {!isEdit && (
                <FormTextField
                    name="password"
                    control={control}
                    label="Mật khẩu"
                    required
                />
            )}

            <FormTextField
                name="role"
                control={control}
                label="Phân quyền"
                options={[
                    { label: '-- Chọn quyền --', value: '' },
                    ...Object.entries(UserRoleOptions).map(([value, label]) => ({
                        label: label,
                        value: value,
                    }))
                ]}
            />

            <FormTextField
                name="note"
                control={control}
                label="Mô tả"
                multiline
                rows={2}
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
                {loading
                    ? isEdit
                        ? 'Đang cập nhật...'
                        : 'Đang tạo...'
                    : isEdit
                        ? 'Cập nhật'
                        : 'Tạo mới'}
            </Button>
        </Box>
    );
};

export default UserForm;
