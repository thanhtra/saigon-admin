'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetGmailDetail from '@/hooks/Gmail/useGetGmailDetail';
import useUpdateGmail from '@/hooks/Gmail/useUpdateGmail';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Gmail } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditGmail() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { getGmailDetail } = useGetGmailDetail();
    const { updateGmail } = useUpdateGmail();

    const [loading, setLoading] = useState(false);
    const [thread, setGmail] = useState<Gmail | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<Gmail>({
        defaultValues: {
            name: '',
            gmail: '',
            apppassword: '',
            active: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const resDetail = await getGmailDetail(id);
            if (resDetail?.success) {
                setGmail(resDetail.result);
                reset(resDetail.result);
            } else {
                toast.error('Không tìm thấy dữ liệu tài khoản!');
                router.push('/data/gmail');
            }
        };

        fetchData();
    }, [id, getGmailDetail, reset, router]);

    const onSubmit: SubmitHandler<Gmail> = async (data) => {
        setLoading(true);
        try {
            if (!id) return;
            const res = await updateGmail(id, {
                gmail: data.gmail,
                name: data.name,
                apppassword: data.apppassword,
                active: data.active,
            });
            if (res?.success) {
                toast.success('Cập nhật tài khoản Gmail thành công!');
                router.push('/data/gmail');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật tài khoản Gmail.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Chỉnh sửa tài khoản Gmail</TitleMain>
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
