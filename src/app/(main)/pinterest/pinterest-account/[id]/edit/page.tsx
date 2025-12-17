'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetPinterestDetail from '@/hooks/Pinterest/useGetPinterestDetail';
import useUpdatePinterest from '@/hooks/Pinterest/useUpdatePinterest';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { PinterestInput } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EditPinterest() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { fetchTopics } = useGetTopics();
    const { getPinterestDetail } = useGetPinterestDetail();
    const { updatePinterest } = useUpdatePinterest();

    const [loading, setLoading] = useState(false);
    const [pinterest, setPinterest] = useState<PinterestInput | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<PinterestInput>({
        defaultValues: {
            name: '',
            gmail: '',
            pinterest_account_id: '',
            client_id: '',
            client_secret: '',
            access_token: null,
            refresh_token: null,
            token_expiry: null,
            board_id: null,
            active: false
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const resDetail = await getPinterestDetail(id);
            if (resDetail?.success) {
                setPinterest(resDetail.result);
                reset(resDetail.result);
            } else {
                toast.error('Không tìm thấy dữ liệu tài khoản!');
                router.push('/pinterest/pinterest-account');
            }
        };

        fetchData();
    }, [id, fetchTopics, getPinterestDetail, reset, router]);

    const onSubmit: SubmitHandler<PinterestInput> = async (data) => {
        setLoading(true);
        try {
            if (!id) return;
            const res = await updatePinterest(id, {
                gmail: data.gmail,
                name: data.name,
                pinterest_account_id: data.pinterest_account_id,
                client_id: data.client_id,
                client_secret: data.client_secret,
                active: data.active
            });
            if (res?.success) {
                toast.success('Cập nhật tài khoản Pinterest thành công!');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật tài khoản Pinterest.');
        } finally {
            setLoading(false);
        }
    };

    const updateToken = () => {
        const clientId = getValues('client_id');
        if (!clientId) {
            toast.error("Vui lòng nhập client_id trước khi kết nối Pinterest");
            return;
        }

        if (!pinterest?.id) {
            toast.error("Không có thông tin ID tài khoản Pinterest");
            return;
        }

        // Pinterest scopes – tuỳ quyền bạn cần (pins:read, pins:write, boards:read, boards:write...)
        const scope = encodeURIComponent('pins:read,pins:write,boards:read,boards:write');

        // Pinterest cho phép truyền state – bạn gắn pinterest.id để callback xử lý
        const state = encodeURIComponent(JSON.stringify({ pinterestid: pinterest.id }));

        // Redirect URI phải trùng với URI bạn đã cấu hình trong Pinterest Developer App
        const redirectUri = 'http://localhost:3002/pinterest/pinterest-account/oauth2callback';

        // Pinterest OAuth2 authorization endpoint
        const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        window.location.href = authUrl;
    };


    return (
        <>
            <TitleMain>Chỉnh sửa tài khoản Pinterest</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={updateToken} sx={{ marginRight: "30px" }}>Cập nhật token</Button>
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

                    <FormTextField
                        name="access_token"
                        control={control}
                        label="Access Token"
                        disabled={true}
                    />

                    <FormTextField
                        name="refresh_token"
                        control={control}
                        label="Refresh Token"
                        disabled={true}
                    />
                    <FormTextField
                        name="token_expiry"
                        control={control}
                        label="Token Expiry"
                        disabled={true}
                    />

                    <FormTextField
                        name="board_id"
                        control={control}
                        label="Board ID"
                        disabled={true}
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
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </Box>

                </Box>
            </CardItem>
        </>
    );
}
