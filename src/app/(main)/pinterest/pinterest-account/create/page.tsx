'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useCreatePinterest from '@/hooks/Pinterest/useCreatePinterest';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { PinterestInput } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreatePinterest() {
    const { createPinterest } = useCreatePinterest();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PinterestInput>({
        defaultValues: {
            name: '',
            gmail: '',
            password: '',
            pinterest_account_id: '',
            client_id: '',
            client_secret: '',
            active: false
        },
    });


    const onSubmit: SubmitHandler<PinterestInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createPinterest(data);
            if (res?.success) {
                reset();
                toast.success('Tạo tài khoản Pinterest thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo tài khoản Pinterest.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới tài khoản Pinterest</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/pinterest/pinterest-account">
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
                        name="password"
                        control={control}
                        label="Mật khẩu"
                        required
                        type="password"
                    />

                    <FormTextField
                        name="name"
                        control={control}
                        label="Tên tài khoản"
                        required
                    />

                    <FormTextField
                        name="pinterest_account_id"
                        control={control}
                        label="Account ID"
                        required
                    />

                    <FormTextField
                        name="client_id"
                        control={control}
                        label="Client ID"
                        required
                    />

                    <FormTextField
                        name="client_secret"
                        control={control}
                        label="Client Secret"
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
