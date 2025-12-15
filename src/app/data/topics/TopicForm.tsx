'use client';

import FormTextField from '@/components/FormTextField';
import { TopicTypeOptions } from '@/utils/const';
import { TopicInput } from '@/utils/type';
import { Box, Button } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';

type Props = {
    control: Control<TopicInput>;
    errors: FieldErrors<TopicInput>;
    loading: boolean;
    onSubmit: () => void;
};

const TopicForm: React.FC<Props> = ({ control, errors, loading, onSubmit }) => {
    return (
        <Box component="form" onSubmit={onSubmit} noValidate>

            <FormTextField
                name="type"
                control={control}
                label="Loại chủ đề"
                rules={{ required: 'Bắt buộc' }}
                options={[
                    { label: '-- Chọn loại chủ đề --', value: '' },
                    ...Object.entries(TopicTypeOptions).map(([value, label]) => ({
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
                name="description"
                control={control}
                label="Mô tả"
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

export default TopicForm;
