'use client';

import useGetTopics from '@/hooks/Topic/useGetTopics';
import useCreateYoutube from '@/hooks/Youtube/useCreateYoutube';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { YoutubeInput } from '@/utils/type';
import {
    Box,
    Button,
    FormControlLabel,
    MenuItem,
    TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateYoutube() {
    const { createYoutube } = useCreateYoutube();
    const { fetchTopics } = useGetTopics();

    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<YoutubeInput>({
        defaultValues: {
            name: '',
            gmail: '',
            youtube_channel_id: '',
            client_id: '',
            client_secret: '',
            topic_id: '',
            active: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const resTop = await fetchTopics({ isPagin: false });
            if (resTop?.success) setTopics(resTop.result.data);
        };

        fetchData();
    }, []);

    const onSubmit: SubmitHandler<YoutubeInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createYoutube(data);
            if (res?.success) {
                reset();
                toast.success('Tạo tài khoản Youtube thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo tài khoản Youtube.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới tài khoản Youtube</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/youtube">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        label="Gmail"
                        margin="normal"
                        {...register('gmail', { required: 'Bắt buộc' })}
                        error={!!errors.gmail}
                        helperText={errors.gmail?.message}
                    />

                    <TextField
                        fullWidth
                        label="Tên kênh youtube"
                        margin="normal"
                        {...register('name', { required: 'Bắt buộc' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <TextField
                        fullWidth
                        label="ID kênh youtube"
                        margin="normal"
                        {...register('youtube_channel_id', { required: 'Bắt buộc' })}
                        error={!!errors.youtube_channel_id}
                        helperText={errors.youtube_channel_id?.message}
                    />

                    <TextField
                        fullWidth
                        label="Client ID"
                        margin="normal"
                        {...register('client_id', { required: 'Bắt buộc' })}
                        error={!!errors.client_id}
                        helperText={errors.client_id?.message}
                    />

                    <TextField
                        fullWidth
                        label="Client Secret"
                        margin="normal"
                        {...register('client_secret', { required: 'Bắt buộc' })}
                        error={!!errors.client_secret}
                        helperText={errors.client_secret?.message}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Chủ đề"
                        margin="normal"
                        {...register('topic_id', { required: 'Chọn chủ đề' })}
                        error={!!errors.topic_id}
                        helperText={errors.topic_id?.message}
                    >
                        <MenuItem value="">-- Chọn chủ đề --</MenuItem>
                        {topics.map((topic: any) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                {...register('active')}
                                defaultChecked={false}
                            />
                        }
                        label="Kích hoạt"
                        sx={{
                            margin: "20px 10px 0px 0px",
                            gap: 2,
                            '& .MuiFormControlLabel-label': {
                                marginRight: '10px',
                            },
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, width: "200px", display: "block" }}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Box>

                </Box>
            </CardItem>
        </>
    );
}
