'use client';

import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import useGetAccountFacebookDetail from '@/hooks/AccountFacebook/useGetAccountFacebookDetail';
import useUpdateAccountFacebook from '@/hooks/AccountFacebook/useUpdateAccountFacebook';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AccountFacebook } from '@/utils/type';
import { Box, Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditAccountFacebook() {
    const { id } = useParams();
    const router = useRouter();
    const { getAccountFacebookDetail } = useGetAccountFacebookDetail();
    const { updateAccountFacebook } = useUpdateAccountFacebook();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        reset,
    } = useForm<AccountFacebook>();

    useEffect(() => {
        const fetchInitialData = async () => {
            const resPage = await getAccountFacebookDetail(String(id));
            if (resPage?.success) {
                const data = resPage.result;
                reset({
                    facebook_id: data.facebook_id,
                    name: data.name,
                    gmail: data.gmail,
                    active: data.active,
                    have_app: data.have_app
                });
            } else {
                toast.error('Không thể tải dữ liệu');
            }
        };
        fetchInitialData();
    }, [id, getAccountFacebookDetail, reset]);


    const onSubmit = async (data: AccountFacebook) => {
        setLoading(true);
        try {
            const res = await updateAccountFacebook(String(id), data);
            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/facebook/account');
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
            <TitleMain>Cập nhật tài khoản Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/facebook/account">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="facebook_id"
                        control={control}
                        label="Facebook ID"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <FormTextField
                        name="name"
                        control={control}
                        label="Tên Facebook"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <FormTextField
                        name="gmail"
                        control={control}
                        label="Gmail đăng kí"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <FormSwitch
                        name="have_app"
                        control={control}
                        label="App developer"
                        defaultChecked={false}
                    />

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
