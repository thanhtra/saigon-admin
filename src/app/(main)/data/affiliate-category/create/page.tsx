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
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useCreateAffiliateCategory from '@/hooks/AffiliateCategory/useCreateAffiliateCategory';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AffiliateCategoryOptions } from '@/utils/const';
import { AffiliateCategoryInput } from '@/utils/type';

const AffiliateCategoryCreate: React.FC = () => {
    const { createAffiliateCategory } = useCreateAffiliateCategory();
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

    const onSubmit: SubmitHandler<AffiliateCategoryInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createAffiliateCategory(data);
            if (res?.success) {
                toast.success('Tạo danh mục thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo không thành công');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo danh mục.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm danh mục Affiliate</TitleMain>
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

export default AffiliateCategoryCreate;
