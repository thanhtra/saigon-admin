'use client';

import FormTextField from '@/components/FormTextField';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useGetAppFacebookDetail from '@/hooks/AppFacebook/useGetAppFacebookDetail';
import useUpdateAppFacebook from '@/hooks/AppFacebook/useUpdateAppFacebook';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { AccountFacebook, AppFacebook } from '@/utils/type';
import { Box, Button, FormControlLabel } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditAppFacebook() {
    const { id } = useParams();
    const router = useRouter();
    const { getAppFacebookDetail } = useGetAppFacebookDetail();
    const { updateAppFacebook } = useUpdateAppFacebook();
    const [loading, setLoading] = useState(false);
    const [accountFacebooks, setAccountFacebooks] = useState<AccountFacebook[]>([]);
    const { fetchAccountFacebooks } = useGetAccountFacebooks();

    const {
        handleSubmit,
        control,
        reset,
    } = useForm<AppFacebook>();

    useEffect(() => {
        const fetchInitialData = async () => {
            const resAcc = await fetchAccountFacebooks({ isPagin: false });
            if (resAcc?.success) {
                setAccountFacebooks(resAcc.result.data);

                const res = await getAppFacebookDetail(String(id));
                if (res?.success) {
                    const page = res.result;
                    reset({
                        account_facebook: page.account_facebook,
                        app_name: page.app_name,
                        client_id: page.client_id,
                        client_secret: page.client_secret,
                        active: page.active
                    });
                } else {
                    toast.error('Không thể tải dữ liệu');
                }
            }
        };
        fetchInitialData();
    }, [id, getAppFacebookDetail, reset]);

    const onSubmit = async (data: AppFacebook) => {
        setLoading(true);
        try {
            const res = await updateAppFacebook(String(id), data);
            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/facebook/app');
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
            <TitleMain>Cập nhật app developer Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/facebook/app">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

                    <FormTextField
                        name="account_facebook"
                        control={control}
                        label="Tài khoản Facebook"
                        rules={{ required: 'Bắt buộc' }}
                        options={[
                            { label: '-- Chọn tài khoản --', value: '' },
                            ...accountFacebooks.map((acc: any) => ({
                                label: acc.name,
                                value: acc.id,
                            }))
                        ]}
                    />

                    <FormTextField
                        name="app_name"
                        control={control}
                        label="Tên App Facebook"
                        rules={{ required: 'Bắt buộc' }}
                    />

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
