'use client';

import FormTextField from '@/components/FormTextField';
import useGenerateYoutube from '@/hooks/Video/useGenerateYoutube';
import { CardItem, TitleMain } from '@/styles/common';
import { GenerateVideoUrlYoutube } from '@/utils/type';
import {
    Box,
    Button
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type GenerateYoutubeForm = {
    url: string;
    language?: string;
    lengthSeconds?: number | null;
    style?: string;
}

export default function generateFromTiktok() {
    const { generateYoutube } = useGenerateYoutube();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GenerateYoutubeForm>({
        defaultValues: {
            url: '',
            language: '',
            lengthSeconds: null,
            style: ''
        },
    });

    const onSubmit: SubmitHandler<GenerateYoutubeForm> = async (data) => {
        setLoading(true);
        try {
            const payload: GenerateVideoUrlYoutube = {
                url: data.url,
                options: {
                    language: data.language,
                    lengthSeconds: data.lengthSeconds || 60,
                    style: data.style
                }
            };

            const res = await generateYoutube(payload);
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
            <TitleMain>Tạo video tương tự từ link video youtube</TitleMain>
            <CardItem>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="url"
                        control={control}
                        label="Link video youtube"
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
