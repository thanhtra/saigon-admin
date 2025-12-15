'use client';

import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    MenuItem,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AffiliateCategoryInput } from '@/utils/type';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { AffiliateCategoryOptions } from '@/utils/const';
import useUpdateAffiliateCategory from '@/hooks/AffiliateCategory/useUpdateAffiliateCategory';
import useGetAffiliateCategoryDetail from '@/hooks/AffiliateCategory/useGetAffiliateCategoryDetail';

const AffiliateCategoryEdit: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();

    const { updateAffiliateCategory } = useUpdateAffiliateCategory();
    const { fetchAffiliateCategoryDetail } = useGetAffiliateCategoryDetail();

    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AffiliateCategoryInput>({
        defaultValues: {
            name: '',
            type: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAffiliateCategoryDetail(id as string);
                if (data.success) {
                    reset({
                        name: data.result.name,
                        type: data.result.type,
                    });
                }
            } catch (error) {
                toast.error('Không thể tải dữ liệu danh mục.');
            }
        };

        if (id) fetchData();
    }, [id, fetchAffiliateCategoryDetail, reset]);

    const onSubmit: SubmitHandler<AffiliateCategoryInput> = async (data) => {
        setLoading(true);
        try {
            const res = await updateAffiliateCategory(id as string, data);
            if (res?.success) {
                toast.success('Cập nhật danh mục thành công!');
                router.push('/data/affiliate-category');
            } else {
                toast.error(res?.message || 'Cập nhật không thành công');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật danh mục.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật danh mục Affiliate</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/affiliate-category">
                        <span className="mr-1">← </span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        label="Tên danh mục"
                        margin="normal"
                        {...register('name', { required: 'Trường bắt buộc' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'Vui lòng chọn loại' }}
                        render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.type}>
                                <TextField
                                    select
                                    label="Loại danh mục"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {Object.entries(AffiliateCategoryOptions).map(([key, label]) => (
                                        <MenuItem key={key} value={key}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {errors.type && (
                                    <FormHelperText>{errors.type.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: '200px', float: 'inline-end' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Lưu'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
};

export default AffiliateCategoryEdit;
