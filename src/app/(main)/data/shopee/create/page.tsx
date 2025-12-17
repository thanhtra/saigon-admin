'use client';

import FormTextField from '@/components/FormTextField';
import useBulkUpdateAffiliateShopee from '@/hooks/Shopee/useBulkUpdateAffiliateShopee';
import useCreateShopee from '@/hooks/Shopee/useCreateShopee';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, Note, TitleMain, TitleSub } from '@/styles/common';
import { ShopeeInput } from '@/utils/type';
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Select
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { emails } from '../email';
import { TopicType } from '@/utils/const';


const ShopeeCreate: React.FC = () => {
    const { createShopee } = useCreateShopee();
    const [fileUpdate, setFileUpdate] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [multiLoading, setMultiLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const { bulkUpdateAffiliateShopee } = useBulkUpdateAffiliateShopee();
    const [topicIdFilter, setTopicIdFilter] = useState('');
    const [topics, setTopics] = useState<any[]>([]);
    const { fetchTopics } = useGetTopics();

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<ShopeeInput>({
        defaultValues: {
            code: '',
            name: '',
            link: '',
            video: ''
        },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const res = await fetchTopics({ isPagin: false, type: TopicType.Affiliate });
            if (res?.success) {
                setTopics(res.result.data);
            }
        };
        fetchInitialData();
    }, []);

    const onSubmit: SubmitHandler<ShopeeInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createShopee(data);
            if (res?.success) {
                toast.success('Tạo Shopee thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo không thành công');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo Shopee.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setFileUpdate(file);
        }
    };

    const handleMultiShopeeUpdate = async () => {
        if (!email) {
            toast.error('Chưa chọn gmail đăng kí shopee');
            return;
        }

        if (!topicIdFilter) {
            toast.error('Chưa chọn chủ đề sản phẩm');
            return;
        }

        if (!fileUpdate) {
            toast.error('Vui lòng tải lên file Excel');
            return;
        }

        setMultiLoading(true);

        const reader = new FileReader();
        reader.onload = async () => {
            const data = reader.result as string;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const shopeeData = jsonData.map((row: any) => ({
                code: row[0]?.toString() || '', // Dữ liệu cột 1 (code)
                name: row[1]?.toString() || '',
                link: row[2]?.toString() || '',
                video: row[3]?.toString() || '',
            }));

            const sD = shopeeData.filter(
                (shopee) => shopee.link !== '' && shopee.name !== '' && shopee.video !== '' && shopee.code !== ''
            );

            try {
                const payload = {
                    data: sD,
                    gmail_facebook: email,
                    topic_id: topicIdFilter
                }
                const res = await bulkUpdateAffiliateShopee(payload);

                if (res?.success) {
                    if (res.result.successItems?.length > 0) {
                        toast.success(`Cập nhật Shopee thành công`);
                    }
                } else {
                    toast.error('Có lỗi xảy ra khi tạo các Shopee.');
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi tạo các Shopee.');
            } finally {
                setMultiLoading(false);
            }
        };

        reader.onerror = () => {
            toast.error('Lỗi khi đọc file Excel.');
            setMultiLoading(false);
        };

        reader.readAsBinaryString(fileUpdate);
    };

    return (
        <>
            <TitleMain>Thêm mới Shopee</TitleMain>

            <CardItem sx={{ mt: 4 }}>
                <TitleSub>Tạo mới shopee, nếu tồn tại thì cập nhật</TitleSub>
                <Note>Format file excel: cột 1 lưu code, cột 2 lưu name, cột 3 lưu link affiliate, cột 4 lưu link video (123, Dầu gội, https://s.shopee, https://video.mp4)</Note>

                <Box mt={2}>
                    <Select
                        size="small"
                        displayEmpty
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ width: 400, marginRight: "50px" }}
                    >
                        <MenuItem value="">Gmail đăng kí shopee</MenuItem>
                        {emails.map((m) => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        size="small"
                        value={topicIdFilter}
                        onChange={(e) => setTopicIdFilter(e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 400 }}
                    >
                        <MenuItem value="">Chủ đề affiliate</MenuItem>
                        {topics.map((topic: any) => (
                            <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box mt={4}>
                    <input
                        id="upload-file-update"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpdateChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="upload-file-update">
                        <Button variant="outlined" component="span">
                            Chọn file Excel
                        </Button>
                        {fileUpdate && (
                            <Box mt={1} ml={2} component="span" fontStyle="italic">
                                {fileUpdate.name}
                            </Box>
                        )}
                    </label>
                </Box>


                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: '200px', float: 'inline-end' }}
                    onClick={handleMultiShopeeUpdate}
                    disabled={multiLoading}
                >
                    {multiLoading ? <CircularProgress size={24} /> : 'Tạo /  Cập nhật'}
                </Button>
            </CardItem>

            <CardItem>
                <TitleSub>Tạo một Shopee</TitleSub>
                <HeaderRow>
                    <BackLink href="/data/shopee">
                        <span className="mr-1">← </span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="code"
                        control={control}
                        label="Mã sản phẩm"
                        required
                    />

                    <FormTextField
                        name="name"
                        control={control}
                        label="Tên sản phẩm"
                        required
                    />

                    <FormTextField
                        name="link"
                        control={control}
                        label="Link Affiliate"
                        required
                    />

                    <FormTextField
                        name="video"
                        control={control}
                        label="Link Video"
                        required
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

export default ShopeeCreate;
