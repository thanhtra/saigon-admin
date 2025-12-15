'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteShopee from '@/hooks/Shopee/useDeleteShopee';
import useGetShopees from '@/hooks/Shopee/useGetShopees';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    Link,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead, TableRow,
    TextField
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Shopee = {
    id: string;
    code: string;
    name: string;
    link: string;
    video: string;
    createdAt: string;
};

export default function ShopeeListPage() {
    const router = useRouter();
    const { getShopees } = useGetShopees();
    const { deleteShopee } = useDeleteShopee();
    const [shopeeLinks, setShopees] = useState<Shopee[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [shopeeToDelete, setShopeeToDelete] = useState<Shopee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        handleGetShopees();
    }, [page, searchTerm]);

    const handleGetShopees = async () => {
        setLoading(true);
        try {
            const res = await getShopees({
                page,
                size: 10,
                keySearch: searchTerm,
            });

            if (res?.success) {
                setShopees(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setShopees([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            setShopees([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!shopeeToDelete) return;
        const res = await deleteShopee(shopeeToDelete.id);
        if (res?.success) {
            setOpenConfirm(false);
            setShopeeToDelete(null);
            handleGetShopees();
        }
    };

    return (
        <>
            <TitleMain>Danh sách Shopee</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/shopee/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 300 }}
                    />
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Mã sản phẩm</strong></TableCell>
                                <TableCell><strong>Tên sản phẩm</strong></TableCell>
                                <TableCell><strong>Link Affiliate</strong></TableCell>
                                <TableCell><strong>Link Video</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : shopeeLinks.length > 0 ? (
                                shopeeLinks.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>{link.code}</TableCell>
                                        <TableCell>
                                            <Box
                                                title={link.name}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(link.name)}
                                            >
                                                {link.name.length > 30
                                                    ? link.name.slice(0, 30) + '...'
                                                    : link.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {link.link ? (
                                                <Link
                                                    href={link.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Xem sản phẩm
                                                </Link>
                                            ) : '-'}
                                        </TableCell>

                                        <TableCell>
                                            {link.video ? (
                                                <Link
                                                    href={link.video}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Xem Video
                                                </Link>
                                            ) : '-'}
                                        </TableCell>

                                        <TableCell>{new Date(link.createdAt).toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" color="error" onClick={() => {
                                                setShopeeToDelete(link);
                                                setOpenConfirm(true);
                                            }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
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
                    description="Bạn có chắc chắn muốn xoá link Shopee này không?"
                />
            </CardItem>
        </>
    );
}
