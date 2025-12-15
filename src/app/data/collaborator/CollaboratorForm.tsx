'use client';

import FormTextField from '@/components/FormTextField';
import { ProfessionOptions } from '@/utils/const';
import { Collaborator } from '@/utils/type';
import { Box, Button } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';

type Props = {
    control: Control<Collaborator>;
    errors: FieldErrors<Collaborator>;
    loading: boolean;
    onSubmit: () => void;
};

const CollaboratorForm: React.FC<Props> = ({ control, loading, onSubmit }) => {
    return (
        <Box component="form" onSubmit={onSubmit} noValidate>

            <FormTextField
                name="profession"
                control={control}
                label="Lĩnh vực hợp tác"
                rules={{ required: 'Bắt buộc' }}
                options={[
                    { label: '-- Chọn lĩnh vực --', value: '' },
                    ...Object.entries(ProfessionOptions).map(([value, label]) => ({
                        label: label,
                        value: value,
                    }))
                ]}
            />

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
                name="description"
                control={control}
                label="Mô tả"
                multiline
                rows={2}
            />

            <FormTextField
                name="link_document"
                control={control}
                label="Tài liệu"
                multiline
                rows={2}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, width: "200px", float: "inline-end" }}
                color="primary"
                disabled={loading}
            >
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
        </Box>
    );
};

export default CollaboratorForm;
