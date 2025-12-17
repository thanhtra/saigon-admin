'use client';

import FormTextField from '@/components/FormTextField';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useCreateAppFacebook from '@/hooks/AppFacebook/useCreateAppFacebook';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { AccountFacebook, AppFacebook } from '@/utils/type';
import {
    Box,
    Button,
    FormControlLabel,
    TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


export default function CreateFacebookPage() {
    const { createAppFacebook } = useCreateAppFacebook();
    const { fetchAccountFacebooks } = useGetAccountFacebooks();
    const [loading, setLoading] = useState(false);
    const [accountFacebooks, setAccountFacebooks] = useState<AccountFacebook[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<AppFacebook>({
        defaultValues: {
            account_facebook: '',
            app_name: '',
            client_id: '',
            client_secret: '',
            active: true
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchAccountFacebooks({ isPagin: false });
                if (res?.success) {
                    setAccountFacebooks(res.result.data);
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };
        loadData();
    }, []);


    const onSubmit: SubmitHandler<AppFacebook> = async (data) => {
        setLoading(true);
        try {
            const res = await createAppFacebook(data);
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
            <TitleMain>Thêm mới app developer facebook</TitleMain>
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

                    <TextField
                        fullWidth
                        label="Tên App Facebook"
                        margin="normal"
                        {...register('app_name', { required: 'Bắt buộc' })}
                        error={!!errors.app_name}
                        helperText={errors.app_name?.message}
                    />

                    <TextField
                        fullWidth
                        label="Client Id"
                        margin="normal"
                        {...register('client_id', { required: 'Bắt buộc' })}
                        error={!!errors.client_id}
                        helperText={errors.client_id?.message}
                    />

                    <TextField
                        fullWidth
                        label="Client Secret"
                        margin="normal"
                        {...register('client_secret', { required: 'Bắt buộc' })}
                        error={!!errors.client_secret}
                        helperText={errors.client_secret?.message}
                    />

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                {...register('active')}
                                defaultChecked={true}
                            />
                        }
                        label="Kích hoạt"
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
