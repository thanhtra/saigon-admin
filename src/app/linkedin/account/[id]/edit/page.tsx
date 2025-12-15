'use client';

import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import useGetAccountLinkedinDetail from '@/hooks/AccountLinkedin/useGetAccountLinkedinDetail';
import useUpdateAccountLinkedin from '@/hooks/AccountLinkedin/useUpdateAccountLinkedin';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AccountLinkedin } from '@/utils/type';
import { Box, Button, Grid } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditAccountLinkedin() {
    const { id } = useParams();
    const router = useRouter();
    const { getAccountLinkedinDetail } = useGetAccountLinkedinDetail();
    const { updateAccountLinkedin } = useUpdateAccountLinkedin();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        reset,
    } = useForm<AccountLinkedin>({
        defaultValues: {
            linkedin_id: '',
            name: '',
            linkedin_profile_urn: '',
            client_id: '',
            client_secret: '',
            expires_at: null,
            gmail: '',
            active: true,
        },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const resPage = await getAccountLinkedinDetail(String(id));
            if (resPage?.success) {
                const data = resPage.result;
                reset({
                    linkedin_id: data.linkedin_id,
                    name: data.name,
                    linkedin_profile_urn: data.linkedin_profile_urn,
                    client_id: data.client_id,
                    client_secret: data.client_secret,
                    expires_at: data.expires_at,
                    gmail: data.gmail,
                    active: data.active
                });
            } else {
                toast.error('Không thể tải dữ liệu');
            }
        };
        fetchInitialData();
    }, [id, getAccountLinkedinDetail, reset]);


    const onSubmit = async (data: AccountLinkedin) => {
        setLoading(true);
        try {
            const { expires_at, linkedin_profile_urn, ...payload } = data;
            const res = await updateAccountLinkedin(String(id), payload);
            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/linkedin/account');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại!');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật tài khoản LinkedIn</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/linkedin/account">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2} sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <Grid item sx={{ width: "49%" }}>
                            <FormTextField
                                name="linkedin_id"
                                control={control}
                                label="Linkedin ID"
                                rules={{ required: 'Bắt buộc' }} />

                            <FormTextField
                                name="name"
                                control={control}
                                label="Tên Linkedin"
                                rules={{ required: 'Bắt buộc' }}
                            />

                            <FormTextField
                                name="gmail"
                                control={control}
                                label="Gmail đăng kí"
                                rules={{ required: 'Bắt buộc' }}
                            />
                        </Grid>

                        <Grid item sx={{ width: "49%" }}>

                            <FormTextField
                                name="client_id"
                                control={control}
                                label="Client Id"
                                rules={{ required: 'Bắt buộc' }}
                            />

                            <FormTextField
                                name="client_secret"
                                control={control}
                                label="Client Secret"
                                rules={{ required: 'Bắt buộc' }}
                            />

                            <FormTextField
                                name="linkedin_profile_urn"
                                control={control}
                                label="Linkedin Profile Urn"
                                disabled={true}
                            />

                            <FormTextField
                                name="expires_at"
                                control={control}
                                label="Token hết hạn"
                                disabled={true}
                            />
                        </Grid>
                    </Grid>

                    <FormSwitch
                        name="active"
                        control={control}
                        label="Kích hoạt"
                        defaultChecked={true}
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
