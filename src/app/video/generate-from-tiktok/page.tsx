'use client';

import FormTextField from '@/components/FormTextField';
import useGenerateVideo from '@/hooks/Video/useGenerateVideo';
import { CardItem, TitleMain } from '@/styles/common';
import { GenerateVideoProductTiktok } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function generateFromTiktok() {
    const { generateVideo } = useGenerateVideo();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GenerateVideoProductTiktok>({
        defaultValues: {
            product_tiktok_url: '',
        },
    });

    const onSubmit: SubmitHandler<GenerateVideoProductTiktok> = async (data) => {
        setLoading(true);
        try {
            const res = await generateVideo(data);
            if (res?.success) {
                reset();
                toast.success('Generate video thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo video.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Tạo video từ link sản phẩm tiktok</TitleMain>
            <CardItem>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="product_tiktok_url"
                        control={control}
                        label="Link sản phẩm tiktok"
                        required
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
