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
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import useGetAffiliateDetail from '@/hooks/Affiliate/useGetAffiliateDetail';
import useUpdateAffiliate from '@/hooks/Affiliate/useUpdateAffiliate';
import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AffiliateInput } from '@/utils/type';

type AffiliateCategory = { id: string; name: string };

const AffiliateEdit: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const { fetchAffiliateDetail } = useGetAffiliateDetail();
    const { fetchAffiliateCategories } = useGetAffiliateCategories();
    const { updateAffiliate } = useUpdateAffiliate();

    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState<AffiliateCategory[]>([]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AffiliateInput>({
        defaultValues: {
            comment_text: '',
            link_affiliate: '',
            affiliate_category_id: '',
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [detailRes, categoryRes] = await Promise.all([
                    fetchAffiliateDetail(id as string),
                    fetchAffiliateCategories({ isPagin: false }),
                ]);

                if (detailRes?.success) {
                    reset(detailRes.result);
                } else {
                    toast.error('Không tìm thấy dữ liệu');
                }

                if (categoryRes?.success) {
                    setCategoryList(categoryRes.result.data);
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const onSubmit: SubmitHandler<AffiliateInput> = async (data) => {
        setLoading(true);
        try {
            const res = await updateAffiliate(id as string, {
                comment_text: data.comment_text,
                link_affiliate: data.link_affiliate,
                affiliate_category_id: data.affiliate_category_id
            });
            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/data/affiliate');
            } else {
                toast.error(res?.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Chỉnh sửa link Affiliate</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/affiliate">
                        <span className="mr-1">← </span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        label="Nội dung bình luận"
                        margin="normal"
                        multiline
                        rows={4}
                        {...register('comment_text', { required: 'Trường bắt buộc' })}
                        error={!!errors.comment_text}
                        helperText={errors.comment_text?.message}
                    />

                    <TextField
                        fullWidth
                        label="Link Affiliate"
                        margin="normal"
                        {...register('link_affiliate')}
                    />

                    <Controller
                        name="affiliate_category_id"
                        control={control}
                        rules={{ required: 'Vui lòng chọn danh mục Affiliate' }}
                        render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.affiliate_category_id}>
                                <TextField
                                    select
                                    label="Danh mục Affiliate"
                                    value={field.value}
                                    onChange={field.onChange}
                                    fullWidth
                                >
                                    {categoryList.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {errors.affiliate_category_id && (
                                    <FormHelperText>{errors.affiliate_category_id.message}</FormHelperText>
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
                        {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
};

export default AffiliateEdit;
