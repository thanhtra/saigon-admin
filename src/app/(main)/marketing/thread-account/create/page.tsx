'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useCreateThread from '@/hooks/Thread/useCreateThread';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ThreadInput } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateThread() {
    const { createThread } = useCreateThread();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ThreadInput>({
        defaultValues: {
            name: '',
            gmail: '',
            username: '',
            password: '',
            active: false,
        },
    });

    const onSubmit: SubmitHandler<ThreadInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createThread(data);
            if (res?.success) {
                reset();
                toast.success('Tạo tài khoản Thread thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo tài khoản Thread.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới tài khoản Thread</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/thread/thread-account">
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
                        name="username"
                        control={control}
                        label="Username"
                        required
                    />

                    <FormTextField
                        name="password"
                        control={control}
                        label="Password"
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
