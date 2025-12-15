'use client';

import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useCreateFacebookPage from '@/hooks/FacebookPage/useCreateFacebookPage';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { AccountFacebook, FacebookPageInput } from '@/utils/type';
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


export default function CreateFacebookPage() {
    const { createFacebookPage } = useCreateFacebookPage();
    const { fetchTopics } = useGetTopics();
    const [accountFacebooks, setAccountFacebooks] = useState<AccountFacebook[]>([]);
    const { fetchAccountFacebooks } = useGetAccountFacebooks();
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FacebookPageInput>({
        defaultValues: {
            page_id: '',
            page_name: '',
            page_access_token: '',
            facebook_id: '',
            topic_id: '',
        },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const [resAcc, resTopic] = await Promise.all([
                fetchAccountFacebooks({ isPagin: false }),
                fetchTopics({ isPagin: false })
            ]);

            if (resAcc?.success && resTopic?.success) {
                setAccountFacebooks(resAcc.result.data);
                setTopics(resTopic.result.data);
            }
        };
        fetchInitialData();
    }, []);

    const onSubmit: SubmitHandler<FacebookPageInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createFacebookPage(data);
            if (res?.success) {
                reset();
                toast.success('Tạo Fanpage thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo Fanpage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới Fanpage Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/facebook/page-facebook">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

                    <TextField
                        fullWidth
                        label="Page ID"
                        margin="normal"
                        {...register('page_id', { required: 'Bắt buộc' })}
                        error={!!errors.page_id}
                        helperText={errors.page_id?.message}
                    />

                    <TextField
                        fullWidth
                        label="Tên Fanpage"
                        margin="normal"
                        {...register('page_name', { required: 'Bắt buộc' })}
                        error={!!errors.page_name}
                        helperText={errors.page_name?.message}
                    />

                    <TextField
                        fullWidth
                        label="Page Access Token"
                        margin="normal"
                        {...register('page_access_token', { required: 'Bắt buộc' })}
                        error={!!errors.page_access_token}
                        helperText={errors.page_access_token?.message}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Chủ đề video"
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

                    <TextField
                        fullWidth
                        select
                        label="Facebook cá nhân"
                        margin="normal"
                        {...register('facebook_id', { required: 'Chọn Facebook' })}
                        error={!!errors.facebook_id}
                        helperText={errors.facebook_id?.message}
                    >
                        <MenuItem value="">-- Chọn Facebook --</MenuItem>
                        {accountFacebooks.map((fb) => (
                            <MenuItem key={fb.facebook_id} value={fb.facebook_id}>
                                {fb.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                {...register('active')}
                                defaultChecked={true}
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
