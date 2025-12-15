'use client';

import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { AffiliateCategoryTopicInput } from '@/utils/type';
import useGetCategoryIdsByTopic from '@/hooks/useGetCategoryIdsByTopic';
import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import useCreateAffiliateCategoryTopic from '@/hooks/AffiliateCategory/useCreateAffiliateCategoryTopic';

const AffiliateCategoryTopicCreatePage: React.FC = () => {
    const { fetchAffiliateCategories } = useGetAffiliateCategories();
    const { fetchTopics } = useGetTopics();
    const { createAffiliateCategoryTopic } = useCreateAffiliateCategoryTopic();
    const { fetchCategoryIds } = useGetCategoryIdsByTopic();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<AffiliateCategoryTopicInput>();

    useEffect(() => {
        const fetchData = async () => {
            const resCat = await fetchAffiliateCategories({ isPagin: false });
            if (resCat?.success) {
                setCategories(resCat.result.data);
            }

            const resTop = await fetchTopics({ isPagin: false });
            if (resTop?.success) setTopics(resTop.result.data);
        };

        fetchData();
    }, []);

    const onSubmit: SubmitHandler<AffiliateCategoryTopicInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createAffiliateCategoryTopic(data);
            if (res?.success) {
                toast.success('Tạo ánh xạ thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo ánh xạ thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Tạo ánh xạ Chủ đề & Danh mục</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/affiliate-category-topic">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Chủ đề: chỉ chọn 1 */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Chọn chủ đề</InputLabel>
                        <Controller
                            name="topic_id"
                            control={control}
                            rules={{ required: 'Vui lòng chọn chủ đề' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    input={<OutlinedInput label="Chọn chủ đề" />}
                                    onChange={async (event) => {
                                        const topicId = event.target.value;
                                        field.onChange(topicId); // cập nhật topic_id
                                        const catIds = await fetchCategoryIds(topicId);
                                        setValue('affiliate_category_ids', catIds); // preload danh mục nếu muốn
                                    }}
                                >
                                    {topics.map((topic: any) => (
                                        <MenuItem key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.topic_id && <p style={{ color: 'red' }}>{errors.topic_id.message}</p>}
                    </FormControl>

                    {/* Danh mục: chọn nhiều */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Chọn danh mục</InputLabel>
                        <Controller
                            name="affiliate_category_ids"
                            control={control}
                            rules={{ required: 'Vui lòng chọn ít nhất một danh mục' }}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    value={field.value || []}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    input={<OutlinedInput label="Chọn danh mục" />}
                                    renderValue={(selected) =>
                                        categories
                                            .filter((c: any) => selected.includes(c.id))
                                            .map((c: any) => c.name)
                                            .join(', ')
                                    }
                                >
                                    {categories.map((cat: any) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            <Checkbox checked={field.value?.includes(cat.id)} />
                                            <ListItemText primary={cat.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.affiliate_category_ids && (
                            <p style={{ color: 'red' }}>{errors.affiliate_category_ids.message}</p>
                        )}
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, width: 200, float: 'inline-end' }}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
};

export default AffiliateCategoryTopicCreatePage;
