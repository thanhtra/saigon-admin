"use client";

import FormTextField from '@/components/FormTextField';
import useGetAppFacebooks from '@/hooks/AppFacebook/useGetAppFacebooks';
import useUpdateFacebookPageToken from '@/hooks/FacebookPage/useUpdateFacebookPageTokens';
import { CardItem, TitleMain } from '@/styles/common';
import { AppFacebook, FacebookPageTokenUpdate } from '@/utils/type';
import {
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormValues = {
    facebook_app_id: string;
    user_token: string;
};

export default function UpdateFacebookPageTokenPage() {
    const { updateFacebookPageToken } = useUpdateFacebookPageToken();
    const { getAppFacebooks } = useGetAppFacebooks();
    const [status, setStatus] = useState<string[]>([]);
    const [appFacebooks, setAppFacebooks] = useState<AppFacebook[]>([]);
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>();


    useEffect(() => {
        const loadData = async () => {
            try {
                const resApps = await getAppFacebooks({ isPagin: false })
                if (resApps?.success) {
                    setAppFacebooks(resApps.result.data);
                } else {
                    toast.error('Không tìm thấy dữ liệu');
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };
        loadData();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            setStatus(['⏳ Đang cập nhật token...']);
            const app = appFacebooks.find(item => item.client_id === data.facebook_app_id);
            if (!app?.account_facebook || !app?.account?.facebook_id) {
                throw Error("Yêu cầu nhập tài khoản facebook");
            }

            const payload: FacebookPageTokenUpdate = {
                client_id: data.facebook_app_id,
                client_secret: app?.client_secret || "",
                account_facebook: app?.account_facebook || "",
                access_token: data.user_token,
                facebook_id: app.account.facebook_id
            };

            const res = await updateFacebookPageToken(payload);

            if (res?.success) {
                if (Array.isArray(res.result.pages) && res.result.pages.length > 0) {
                    setStatus(prev => [
                        ...prev,
                        res.result.message,
                        ...res.result.pages.map((item: any) => `✅ ${item.page_name}`),
                        '🎉 Hoàn tất cập nhật token!',
                    ]);
                } else {
                    setStatus(prev => [...prev, '🎉 Hoàn tất cập nhật token!']);
                }
            } else {
                setStatus(prev => [...prev, `❌ Thất bại: ${res?.message}`]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
        }
    };

    return (
        <>
            <TitleMain>Cập nhật token Fanpage Facebook</TitleMain>
            <CardItem>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <FormTextField
                        name="facebook_app_id"
                        control={control}
                        label="Chọn Facebook App ID"
                        rules={{ required: 'Bắt buộc' }}
                        options={[
                            { label: '-- Chọn App ID --', value: '' },
                            ...appFacebooks.map((app: any) => ({
                                label: `${app.account?.name} | ${app.account?.gmail} |  ${app.app_name}`,
                                value: app.client_id,
                            }))
                        ]}
                    />

                    <FormTextField
                        name="user_token"
                        control={control}
                        label="Nhập User Token"
                        rules={{ required: 'Bắt buộc' }}
                    />

                    <ul style={{ marginTop: 20 }}>
                        {status.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                        ))}
                    </ul>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? <CircularProgress size={20} /> : 'Cập nhật Token'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
}
