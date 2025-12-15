'use client';

import FormTextField from '@/components/FormTextField';
import { Box, Button } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';
import { GroupFacebookInput } from './create/page';


type Props = {
    control: Control<GroupFacebookInput>;
    errors: FieldErrors<GroupFacebookInput>;
    loading: boolean;
    onSubmit: () => void;
    topics: any[];
};

const GroupFacebookForm: React.FC<Props> = ({ control, errors, loading, onSubmit, topics = [] }) => {
    return (
        <Box component="form" onSubmit={onSubmit} noValidate>
            <FormTextField
                name="topic_id"
                control={control}
                error={!!errors.topic_id}
                helperText={errors.topic_id?.message}
                label="Chủ đề nhóm facebook"
                rules={{ required: 'Bắt buộc' }}
                options={[
                    { label: '-- Chọn chủ đề --', value: '' },
                    ...topics.map((topic) => ({
                        label: topic.name,
                        value: topic.id,
                    }))
                ]}
            />

            <FormTextField
                name="group_ids"
                control={control}
                error={!!errors.group_ids}
                helperText={errors.group_ids?.message}
                label="Thông tin nhóm"
                rules={{ required: 'Bắt buộc' }}
                multiline
                rows={10}
                placeholder={`1923383441023894\nTên nhóm`}
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

export default GroupFacebookForm;
