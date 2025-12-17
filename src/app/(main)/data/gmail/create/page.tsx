'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useCreateGmail from '@/hooks/Gmail/useCreateGmail';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Gmail } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateGmail() {
    const { createGmail } = useCreateGmail();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Gmail>({
        defaultValues: {
            name: '',
            gmail: '',
            apppassword: '',
            active: true,
        },
    });

    const onSubmit: SubmitHandler<Gmail> = async (data) => {
        setLoading(true);
        try {
            const res = await createGmail(data);
            if (res?.success) {
                reset();
                toast.success('Tạo tài khoản Gmail thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo tài khoản Gmail.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới tài khoản Gmail</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/gmail">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="gmail"
                        control={control}
                        label="Gmail"
                        required
                    />

                    <FormTextField
                        name="name"
                        control={control}
                        label="Tên tài khoản"
                        required
                    />

                    <FormTextField
                        name="apppassword"
                        control={control}
                        label="App password"
                        required
                    />

                    <ControlledSwitch
                        name="active"
                        control={control}
                        label="Kích hoạt"
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
