'use client';

import FormTextField from '@/components/FormTextField';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoginPayload } from '@/types/auth';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const router = useRouter();
    const { login, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit } = useForm<LoginPayload>({
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginPayload) => {
        try {
            setLoading(true);
            const res = await login(data.phone, data.password);
            if (res) {
                router.replace('/');
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, width: 360 }}>
            <Typography variant="h6" mb={2} textAlign="center">
                Đăng nhập hệ thống
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormTextField
                    name="phone"
                    control={control}
                    label="Số điện thoại"
                    required
                />

                <FormTextField
                    name="password"
                    control={control}
                    label="Mật khẩu"
                    type="password"
                    required
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {authLoading || loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </Box>
        </Paper>
    );
};

export default LoginForm;
