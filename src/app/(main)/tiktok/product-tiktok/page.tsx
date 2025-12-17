'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteProductTiktok from '@/hooks/ProductTiktok/useDeleteProductTiktok';
import useGetProductTiktokDetail from '@/hooks/ProductTiktok/useGetProductTiktokDetail';
import useGetProductTiktoks from '@/hooks/ProductTiktok/useGetProductTiktoks';
import useGetUnPosted from '@/hooks/ProductTiktok/useGetUnPosted';
import useMarkAsPosted from '@/hooks/ProductTiktok/useMarkAsPosted';
import useUpdateProductTiktok from '@/hooks/ProductTiktok/useUpdateProductTiktok';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ProductTiktokCategory, ProductTiktokCategoryLabel } from '@/utils/const';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProductPopupActions from './ProductPopupActions';
import { NickTiktok } from './const';

interface ProductTiktok {
    id: string;
    link: string;
    title: string;
    category: string;
    img_url: string;
    is_posted: boolean;
};

export interface ProductWithNextOrder extends ProductTiktok {
    next_order_index: number;
}


export default function ProductTiktoksPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductTiktok[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [category, setCategory] = useState('');
    const [dataDelete, setDataToDelete] = useState<ProductTiktok | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { getProductTiktoks } = useGetProductTiktoks();
    const { deleteProductTiktok } = useDeleteProductTiktok();
    const { getUnPosted } = useGetUnPosted();
    const { updateProductTiktok } = useUpdateProductTiktok();
    const { getProductTiktokDetail } = useGetProductTiktokDetail();
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(true);
    const [product, setProduct] = useState(null);
    const { markAsPosted } = useMarkAsPosted();

    useEffect(() => {
        fetchData();
    }, [keySearch, category, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getProductTiktoks({
                keySearch,
                category,
                page: page,
                size: 10,
            });

            if (res?.success) {
                setProducts(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setProducts([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!dataDelete) return;
        try {
            const res = await deleteProductTiktok(dataDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setDataToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    const getOneProduct = async () => {
        try {
            if (!category) {
                toast.error('Cần chọn loại sản phẩm');
            }
            const data = await getUnPosted(category);
            if (data) {
                setProduct(data.result);
                setOpen(true);
            }

            console.log('dafs', data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const onMarkPosted = async (id: string) => {
        try {
            if (!id) return;

            const res = await markAsPosted(id);
            if (res.success) {
                toast.success("Cập nhật thành công!");
                const data = await getProductTiktokDetail(id);
                if (data) {
                    setProduct(data.result);
                }
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Cập nhật thất bại');
        }
    };

    return (
        <>
            <TitleMain>Danh sách sản phẩm TikTok</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="outlined" onClick={() => getOneProduct()} sx={{ marginRight: "20px" }}>
                        Lấy 1 sản phẩm
                    </Button>

                    <Button variant="contained" onClick={() => router.push('/tiktok/product-tiktok/create')}>
                        + Thêm sản phẩm
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ width: 400 }}
                    />

                    <Select
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        displayEmpty
                        sx={{ width: 400 }}
                    >
                        <MenuItem value="">Loại sản phẩm</MenuItem>
                        {/* {Object.entries(ProductTiktokCategoryLabel).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {NickTiktok[value as ProductTiktokCategory] || 0} - {label}
                            </MenuItem>
                        ))} */}
                        {Object.entries(ProductTiktokCategoryLabel)
                            .sort(([a], [b]) => {
                                const numA = parseFloat(NickTiktok[a as ProductTiktokCategory]) || 0;
                                const numB = parseFloat(NickTiktok[b as ProductTiktokCategory]) || 0;
                                return numA - numB;
                            })
                            .map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {NickTiktok[value as ProductTiktokCategory] || 0} - {label}
                                </MenuItem>
                            ))}
                    </Select>

                    <Button variant="contained" onClick={fetchData}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow >
                                <TableCell><strong>Loại sản phẩm</strong></TableCell>
                                <TableCell><strong>Link sản phẩm</strong></TableCell>
                                <TableCell><strong>Hình ảnh</strong></TableCell>
                                <TableCell><strong>Tiêu đề</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <TableRow key={product.id} sx={{ height: 36 }}>
                                        <TableCell>{ProductTiktokCategoryLabel[product.category as ProductTiktokCategory]}</TableCell>
                                        <TableCell>
                                            {product.link ? (
                                                <a
                                                    href={product.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    Xem sản phẩm
                                                </a>
                                            ) : '—'}
                                        </TableCell>

                                        <TableCell>
                                            {product?.img_url ? (
                                                <a
                                                    href={product.img_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    Hình ảnh
                                                </a>
                                            ) : '—'}
                                        </TableCell>

                                        <TableCell>
                                            <Box>
                                                {product.title.length > 20
                                                    ? product.title.slice(0, 20) + '...'
                                                    : product.title}
                                            </Box>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Tooltip title={product.is_posted ? 'Đã đăng' : 'Chưa đăng'}>
                                                {!product.is_posted ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setDataToDelete(product);
                                                    setOpenConfirm(true);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Không tìm thấy dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {!loading && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá "${dataDelete?.title}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem >

            <ProductPopupActions
                open={open}
                onClose={() => setOpen(false)}
                product={product}
                onMarkPosted={onMarkPosted}
            />
        </>
    );
}
