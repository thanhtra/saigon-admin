'use client';

import { Box, Button, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { AccountFacebook, FacebookPageInput } from '@/utils/type';
import useGetFacebookPageDetail from '@/hooks/FacebookPage/useGetFacebookPageDetail';
import FormTextField from '@/components/FormTextField';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useUpdateFacebookPage from '@/hooks/FacebookPage/useUpdateFacebookPage';

export default function EditFacebookPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchFacebookPageDetail } = useGetFacebookPageDetail();
    const { updateFacebookPage } = useUpdateFacebookPage();
    const { fetchTopics } = useGetTopics();
    const { fetchAccountFacebooks } = useGetAccountFacebooks();
    const [accountFacebooks, setAccountFacebooks] = useState<AccountFacebook[]>([]);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);

    const {
        handleSubmit,
        control,
        reset,
        register
    } = useForm<FacebookPageInput>();

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

            const resPage = await fetchFacebookPageDetail(String(id));
            if (resPage?.success) {
                const page = resPage.result;
                reset({
                    page_id: page.page_id,
                    page_name: page.page_name,
                    page_access_token: page.page_access_token,
                    facebook_id: page.facebook_id,
                    topic_id: page.topic_id,
                    active: page.active
                });
            } else {
                toast.error('Không thể tải dữ liệu fanpage');
            }
        };
        fetchInitialData();
    }, [id, fetchTopics, fetchFacebookPageDetail, reset]);

    const onSubmit = async (data: FacebookPageInput) => {
        setLoading(true);
        try {
            const res = await updateFacebookPage(String(id), data);
            if (res?.success) {
                toast.success('Cập nhật fanpage thành công!');
                router.push('/facebook/page-facebook');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại!');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi cập nhật fanpage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật Fanpage Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/facebook/page-facebook">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="page_id"
                        control={control}
                        label="Page ID"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <FormTextField
                        name="page_name"
                        control={control}
                        label="Tên Fanpage"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <FormTextField
                        name="page_access_token"
                        control={control}
                        label="Page Access Token"
                        rules={{ required: 'Bắt buộc' }}
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

                    <FormTextField
                        name="facebook_id"
                        control={control}
                        label="Facebook cá nhân"
                        rules={{ required: 'Chọn Facebook' }}
                        options={[
                            { label: '-- Chọn Facebook --', value: '' },
                            ...accountFacebooks.map((fb) => ({
                                label: fb.name,
                                value: fb.facebook_id,
                            }))
                        ]}
                    />

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
                            sx={{ mt: 2, width: "200px", float: "inline-end" }}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Cập nhật'}
                        </Button>
                    </Box>

                </Box>
            </CardItem>
        </>
    );
}
