'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetThreadDetail from '@/hooks/Thread/useGetThreadDetail';
import useUpdateThread from '@/hooks/Thread/useUpdateThread';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ThreadInput } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditThread() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { getThreadDetail } = useGetThreadDetail();
    const { updateThread } = useUpdateThread();

    const [loading, setLoading] = useState(false);
    const [thread, setThread] = useState<ThreadInput | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<ThreadInput>({
        defaultValues: {
            name: '',
            gmail: '',
            username: '',
            password: '',
            active: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const resDetail = await getThreadDetail(id);
            if (resDetail?.success) {
                setThread(resDetail.result);
                reset(resDetail.result);
            } else {
                toast.error('Không tìm thấy dữ liệu tài khoản!');
                router.push('/threa/thread-acocunt');
            }
        };

        fetchData();
    }, [id, getThreadDetail, reset, router]);

    const onSubmit: SubmitHandler<ThreadInput> = async (data) => {
        setLoading(true);
        try {
            if (!id) return;
            const res = await updateThread(id, {
                gmail: data.gmail,
                name: data.name,
                username: data.username,
                password: data.password,
                active: data.active,
            });
            if (res?.success) {
                toast.success('Cập nhật tài khoản Thread thành công!');
            } else {
                toast.error('Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Chỉnh sửa tài khoản Thread</TitleMain>
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
