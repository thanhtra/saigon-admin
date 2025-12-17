'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetBrokerDetail from '@/hooks/Broker/useGetBrokerDetail';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Broker } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditBroker() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { getBrokerDetail } = useGetBrokerDetail();
    const [loading, setLoading] = useState(false);
    const [broker, setBroker] = useState<Broker | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<Broker>({
        defaultValues: {
            name: '',
            link: '',
            avatar: '',
            area: '',
            email: '',
            phone: '',
            selling: '',
            active: true
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const resDetail = await getBrokerDetail(id);
            if (resDetail?.success) {
                setBroker(resDetail.result);
                reset(resDetail.result);
            } else {
                toast.error('Không tìm thấy dữ liệu tài khoản!');
                router.push('/data/broker');
            }
        };

        fetchData();
    }, [id, getBrokerDetail, reset, router]);

    const onSubmit: SubmitHandler<Broker> = async (data) => {
        // setLoading(true);
        // try {
        //     if (!id) return;
        //     const res = await updateBroker(id, {
        //         name: data.name,
        //         link: data.link,
        //         avatar: data.avatar,
        //         area: data.area,
        //         email: data.email,
        //         phone: data.phone,
        //         selling: data.selling,
        //         active: data.active
        //     });
        //     if (res?.success) {
        //         toast.success('Cập nhật thành công!');
        //     } else {
        //         toast.error(res?.message || 'Cập nhật thất bại!');
        //     }
        // } catch (err) {
        //     toast.error('Có lỗi xảy ra khi cập nhật.');
        // } finally {
        //     setLoading(false);
        // }
    };


    return (
        <>
            <TitleMain>Chỉnh sửa môi giới BDS</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/broker">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <img
                        src={broker?.avatar || '/default-avatar.png'}
                        alt={broker?.name || ""}
                        style={{ width: "auto", height: "200px", float: "left", marginBottom: "20px" }}
                    />

                    <FormTextField
                        name="name"
                        control={control}
                        label="Tên môi giới"
                        required
                    />

                    <FormTextField
                        name="email"
                        control={control}
                        label="Email"
                        required
                    />

                    <FormTextField
                        name="phone"
                        control={control}
                        label="Số điện thoại"
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
