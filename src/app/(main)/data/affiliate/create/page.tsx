'use client';

import useBulkCreateAffiliates from '@/hooks/Affiliate/useBulkCreateAffiliates';
import useCreateAffiliate from '@/hooks/Affiliate/useCreateAffiliate';
import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import { BackLink, CardItem, HeaderRow, Note, TitleMain, TitleSub } from '@/styles/common';
import { AffiliateInput } from '@/utils/type';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

type AffiliateCategory = { id: string; name: string };

const AffiliateCreate: React.FC = () => {
    const { createAffiliate } = useCreateAffiliate();
    const { fetchAffiliateCategories } = useGetAffiliateCategories();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState<AffiliateCategory[]>([]);
    const [multiLoading, setMultiLoading] = useState(false);

    const [excelCategoryId, setExcelCategoryId] = useState('');
    const [excelCategoryError, setExcelCategoryError] = useState('');

    const { bulkCreateAffiliates } = useBulkCreateAffiliates();

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
                const categoryRes = await fetchAffiliateCategories({ isPagin: false });
                if (categoryRes?.success) {
                    setCategoryList(categoryRes.result.data);
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };

        loadData();
    }, []);

    const onSubmit: SubmitHandler<AffiliateInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createAffiliate(data);
            if (res?.success) {
                toast.success('Tạo Affiliate thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo không thành công');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo Affiliate.');
        } finally {
            setLoading(false);
        }
    };


    // Hàm xử lý tải file Excel và tạo các affiliate từ dữ liệu trong file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setFile(file);
        }
    };

    const processAffiliateLink = (link: string | undefined): string | undefined => {
        if (!link) return ''; // Nếu link không tồn tại, trả về chuỗi rỗng
        const cleanedLink = link.endsWith(',') ? link.slice(0, -1) : link;

        // Kiểm tra nếu link có dấu ",,,,,,"
        if (cleanedLink.includes(',,,,,,')) {
            // Tách các URL trong chuỗi theo dấu phẩy
            const links = cleanedLink.split(',,,,,,');
            // Lấy URL cuối cùng
            return links[links.length - 1].trim(); // Link cuối cùng
        }
        // Nếu không có dấu ",,,,,,", chỉ trả về link ban đầu
        return cleanedLink.trim();
    };


    const handleMultiAffiliateCreate = async () => {
        if (!file) {
            toast.error('Vui lòng tải lên file Excel');
            return;
        }

        if (!excelCategoryId) {
            setExcelCategoryError('Vui lòng chọn danh mục Affiliate');
            return;
        }

        setExcelCategoryError('');
        setMultiLoading(true);

        const reader = new FileReader();
        reader.onload = async () => {
            const data = reader.result as string;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            let affiliateData = jsonData.map((row: any) => ({
                comment_text: row[0] || '', // Dữ liệu cột 1 (comment_text)
                link_affiliate: processAffiliateLink(row[1]) || '',
                affiliate_category_id: excelCategoryId, // Dành cho việc sử dụng select sau
            }));

            // Loại bỏ những row có comment_text hoặc link_affiliate là ''
            affiliateData = affiliateData.filter(
                (affiliate) => affiliate.link_affiliate !== '' && affiliate.comment_text !== ''
            );


            // Gọi API bulkCreate để tạo nhiều affiliate
            try {
                const res = await bulkCreateAffiliates(affiliateData); // Gọi API bulkCreate

                if (res?.success) {
                    if (res.result.successItems?.length > 0) {
                        toast.success(`Tạo Affiliate thành công`);
                    }
                } else {
                    toast.error('Có lỗi xảy ra khi tạo các Affiliate.');
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi tạo các Affiliate.');
            } finally {
                setMultiLoading(false);
            }
        };

        reader.onerror = () => {
            toast.error('Lỗi khi đọc file Excel.');
            setMultiLoading(false);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <>
            <TitleMain>Thêm link Affiliate</TitleMain>
            <CardItem sx={{ mt: 4 }}>
                <TitleSub>Tạo nhiều Affiliate từ file Excel</TitleSub>
                <Note>Format file excel: cột 1 lưu comment_text, cột 2 lưu link_affiliate (......,,,,,https://s.shopee,)</Note>

                <FormControl fullWidth margin="normal" error={!!excelCategoryError}>
                    <InputLabel id="excel-category-label">Danh mục Affiliate</InputLabel>
                    <Select
                        labelId="excel-category-label"
                        value={excelCategoryId}
                        onChange={(e) => setExcelCategoryId(e.target.value)}
                        label="Danh mục Affiliate"
                    >
                        {categoryList.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {excelCategoryError && (
                        <FormHelperText>{excelCategoryError}</FormHelperText>
                    )}
                </FormControl>

                <Box mt={2}>
                    <input
                        id="upload-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="upload-file">
                        <Button variant="outlined" component="span">
                            Chọn file Excel
                        </Button>
                        {file && (
                            <Box mt={1} ml={2} component="span" fontStyle="italic">
                                {file.name}
                            </Box>
                        )}
                    </label>
                </Box>


                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: '200px', float: 'inline-end' }}
                    onClick={handleMultiAffiliateCreate}
                    disabled={multiLoading}
                >
                    {multiLoading ? <CircularProgress size={24} /> : 'Tạo Affiliate từ file'}
                </Button>
            </CardItem>
            <CardItem>
                <TitleSub>Tạo một Affiliate</TitleSub>
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
                        {loading ? <CircularProgress size={24} /> : 'Lưu'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
};

export default AffiliateCreate;
