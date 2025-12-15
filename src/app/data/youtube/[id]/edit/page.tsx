'use client';

import FormTextField from '@/components/FormTextField';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import useGetYoutubeDetail from '@/hooks/Youtube/useGetYoutubeDetail';
import useUpdateYoutube from '@/hooks/Youtube/useUpdateYoutube';
import { BackLink, BoxTwoColumn, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { YoutubeInput } from '@/utils/type';
import {
    Box,
    Button,
    FormControlLabel,
    TextField
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditYoutube() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { fetchTopics } = useGetTopics();
    const { fetchYoutubeDetail } = useGetYoutubeDetail();
    const { updateYoutube } = useUpdateYoutube();

    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [youtube, setYoutube] = useState<YoutubeInput | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<YoutubeInput>({
        defaultValues: {
            name: '',
            gmail: '',
            youtube_channel_id: '',
            client_id: '',
            client_secret: '',
            access_token: null,
            refresh_token: null,
            token_expiry: null,
            topic_id: '',
            active: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const resTop = await fetchTopics({ isPagin: false });
            if (resTop?.success) setTopics(resTop.result.data);

            const resDetail = await fetchYoutubeDetail(id);
            if (resDetail?.success) {
                setYoutube(resDetail.result);
                reset(resDetail.result);
            } else {
                toast.error('Không tìm thấy dữ liệu tài khoản!');
                router.push('/data/youtube');
            }
        };

        fetchData();
    }, [id, fetchTopics, fetchYoutubeDetail, reset, router]);

    const onSubmit: SubmitHandler<YoutubeInput> = async (data) => {
        setLoading(true);
        try {
            if (!id) return;
            const res = await updateYoutube(id, {
                gmail: data.gmail,
                name: data.name,
                youtube_channel_id: data.youtube_channel_id,
                client_id: data.client_id,
                client_secret: data.client_secret,
                topic_id: data.topic_id,
                active: data.active
            });
            if (res?.success) {
                toast.success('Cập nhật tài khoản Youtube thành công!');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật tài khoản Youtube.');
        } finally {
            setLoading(false);
        }
    };

    const updateToken = () => {
        const clientId = getValues('client_id');
        if (!clientId) {
            toast.error("Vui lòng nhập client_id trước khi kết nối Google");
            return;
        }

        if (!youtube?.id) {
            toast.error("Không có thông tin ID tài khoản Youtube");
            return;
        }

        const scope = encodeURIComponent(
            'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl'
        );
        const state = encodeURIComponent(JSON.stringify({ youtubeid: youtube.id }));
        const redirectUri = 'http://localhost:3002/data/youtube/oauth2callback';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

        window.location.href = authUrl;
    };

    return (
        <>
            <TitleMain>Chỉnh sửa tài khoản Youtube</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={updateToken} sx={{ marginRight: "30px" }}>Cập nhật token</Button>
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
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />
                    <BoxTwoColumn>
                        <TextField
                            fullWidth
                            label="Tên kênh youtube"
                            margin="normal"
                            {...register('name', { required: 'Bắt buộc' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={{ width: '50%' }}
                        />

                        <TextField
                            fullWidth
                            label="ID kênh youtube"
                            margin="normal"
                            {...register('youtube_channel_id', { required: 'Bắt buộc' })}
                            error={!!errors.youtube_channel_id}
                            helperText={errors.youtube_channel_id?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={{ width: '50%' }}
                        />
                    </BoxTwoColumn>

                    <BoxTwoColumn>
                        <TextField
                            fullWidth
                            label="Client ID"
                            margin="normal"
                            {...register('client_id', { required: 'Bắt buộc' })}
                            error={!!errors.client_id}
                            helperText={errors.client_id?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={{ width: '50%' }}
                        />

                        <TextField
                            fullWidth
                            label="Client Secret"
                            margin="normal"
                            {...register('client_secret', { required: 'Bắt buộc' })}
                            error={!!errors.client_secret}
                            helperText={errors.client_secret?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={{ width: '50%' }}
                        />
                    </BoxTwoColumn>

                    <BoxTwoColumn>
                        <TextField
                            fullWidth
                            label="Access Token"
                            margin="normal"
                            {...register('access_token')}
                            error={!!errors.access_token}
                            helperText={errors.access_token?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            disabled={true}
                            sx={{ width: '50%' }}
                        />

                        <TextField
                            fullWidth
                            label="Refresh Token"
                            margin="normal"
                            {...register('refresh_token')}
                            error={!!errors.refresh_token}
                            helperText={errors.refresh_token?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            disabled={true}
                            sx={{ width: '50%' }}
                        />
                    </BoxTwoColumn>

                    <BoxTwoColumn>
                        <TextField
                            fullWidth
                            label="Token Expiry"
                            margin="normal"
                            {...register('token_expiry')}
                            error={!!errors.token_expiry}
                            helperText={errors.token_expiry?.message}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            disabled={true}
                            sx={{ width: '50%' }}
                        />

                        <FormTextField
                            name="topic_id"
                            control={control}
                            label="Chủ đề video"
                            rules={{ required: 'Chọn chủ đề' }}
                            options={[
                                { label: '-- Chọn chủ đề --', value: '' },
                                ...topics.map((topic: any) => ({
                                    label: topic.name,
                                    value: topic.id,
                                }))
                            ]}
                        />
                    </BoxTwoColumn>



                    <FormControlLabel
                        control={
                            <Controller
                                name="active"
                                control={control}
                                render={({ field }) => (
                                    <IOSSwitch
                                        {...field}
                                        checked={field.value}
                                    />
                                )}
                            />
                        }
                        label="Kích hoạt"
                        labelPlacement="end"
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
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </Box>

                </Box>
            </CardItem>
        </>
    );
}
