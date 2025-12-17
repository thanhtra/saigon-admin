'use client';

import FormSwitch from '@/components/FormSwitch';
import FormTextField from '@/components/FormTextField';
import useCreateAccountLinkedin from '@/hooks/AccountLinkedin/useCreateAccountLinkedin';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { redirectUriLinkedIn } from '@/utils/const';
import { AccountLinkedin } from '@/utils/type';
import {
    Box,
    Button,
    Grid,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateLinkedinPage() {
    const { createAccountLinkedin } = useCreateAccountLinkedin();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<AccountLinkedin>({
        defaultValues: {
            linkedin_id: '',
            name: '',
            client_id: '',
            client_secret: '',
            gmail: '',
            active: true,
        },
    });

    const onSubmit: SubmitHandler<AccountLinkedin> = async (data) => {
        setLoading(true);
        try {
            const res = await createAccountLinkedin({ ...data, redirect_uri: redirectUriLinkedIn });
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
            <TitleMain>Thêm mới tài khoản Linkedin</TitleMain>
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
