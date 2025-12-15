'use client';

import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import useCreateAccountFacebook from '@/hooks/Facebook/useCreateAccountFacebook';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AccountFacebook } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


export default function CreateFacebookPage() {
    const { createAccountFacebook } = useCreateAccountFacebook();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<AccountFacebook>({
        defaultValues: {
            facebook_id: '',
            name: '',
            gmail: '',
            active: true,
            have_app: false
        },
    });

    const onSubmit: SubmitHandler<AccountFacebook> = async (data) => {
        setLoading(true);
        try {
            const res = await createAccountFacebook(data);
            if (res?.success) {
                reset();
                toast.success('Tạo thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới tài khoản Facebook</TitleMain>
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
