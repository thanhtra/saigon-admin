'use client';

import TiktokShopScraperCodeBlock from '@/components/TiktokShopScraperCodeBlock';
import useCreateProductTiktok, { ProductTiktok } from '@/hooks/ProductTiktok/useCreateProductTiktok';
import { BackLink, CardItem, HeaderRow, TitleMain, TitleSub } from '@/styles/common';
import { ProductTiktokCategoryLabel } from '@/utils/const';
import { Box, Button, CircularProgress, Link, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateTiktokVideoPage() {
    const [rawText, setRawText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [category, setCategory] = useState('');
    const { createProductTiktok } = useCreateProductTiktok();

    const handleSubmit = async () => {
        const blocks = rawText.split('\n\n');
        const products: ProductTiktok[] = blocks.map(block => {
            const [link, ...descParts] = block.trim().split('\n');
            let productTitle = descParts.join(' ').trim();

            return {
                link: link.trim(),
                title: productTitle.trim(),
            };
        });

        setLoading(true);
        try {
            const res = await createProductTiktok(category, products);
            setResult(JSON.stringify(res, null, 2));
            if (res?.success) {
                toast.success('Tạo product tiktok thành công!');
                setRawText('');
            } else {
                toast.error(res?.message || 'Tạo product tiktok thất bại!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm mới sản phẩm TikTok</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/tiktok/product-tiktok">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        fullWidth
                        select
                        label="Loại sản phẩm"
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <MenuItem value="">-- Chọn loại sản phẩm --</MenuItem>
                        {Object.entries(ProductTiktokCategoryLabel).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        multiline
                        rows={12}
                        label="Thông tin sản phẩm"
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder={`https://www.tiktok.com/shop/vn/pdp/%C4%91am-thiet-ke-form-xoe-co-dan-nhieu-mau-thich-hop-%C4%91i-choi-lam-viec/1732826020155524663\nTiêu đề sản phẩm`}
                        margin="normal"
                    />

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Lưu vào Database'}
                    </Button>


                </Box>
            </CardItem>

            <CardItem>
                <TitleSub>Script lấy danh sách link và title sản phẩm tiktok</TitleSub>

                <Typography mb={2}>
                    Vào trang sau và chọn sản phẩm theo loại sản phẩm{' '}
                    <Link
                        href="https://www.tiktok.com/shop/vn/c?source=ecommerce_category&enter_from=ecommerce_category&enter_method=bread_crumbs&first_entrance=homepage_hot"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontWeight: 600, color: '#007bff' }}
                    >
                        TikTok Shop
                    </Link>
                </Typography>

                <Typography mb={2}>
                    Dán nhiều sản phẩm theo định dạng:<br />
                    <code>
                        https://www.tiktok.com/shop/vn/pdp/%C4%91am-thiet-ke-form-xoe-co-dan-nhieu-mau-thich-hop-%C4%91i-choi-lam-viec/1732826020155524663<br />
                        Tiêu đề sản phẩm
                    </code>
                    <br />Mỗi block cách nhau bằng một dòng trống.
                </Typography>

                <TitleSub>Vào trang sản phẩm tiktok và dán code bên dưới để lấy thông tin</TitleSub>
                <TiktokShopScraperCodeBlock />
            </CardItem>

        </>
    );
}
