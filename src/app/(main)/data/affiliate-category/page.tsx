'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteAffiliateCategory from '@/hooks/AffiliateCategory/useDeleteAffiliateCategory';
import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AffiliateCategoryOptions, AffiliateCategoryType } from '@/utils/const';
import { AffiliateCategory } from '@/utils/type';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    MenuItem, Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead, TableRow,
    TextField
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function AffiliateCategoryListPage() {
    const router = useRouter();
    const { fetchAffiliateCategories } = useGetAffiliateCategories();
    const { deleteAffiliateCategory } = useDeleteAffiliateCategory();

    const [list, setList] = useState<AffiliateCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<AffiliateCategory | null>(null);

    const getCategories = async () => {
        setLoading(true);
        const res = await fetchAffiliateCategories({
            page,
            size: 10,
            type: typeFilter,
            keySearch: search,
        });
        if (res?.success) {
            setList(res.result.data);
            setTotalPages(res.result.meta.pageCount);
        } else {
            setList([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        getCategories();
    }, [page, typeFilter, search]);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const res = await deleteAffiliateCategory(itemToDelete.id);
        if (res?.success) {
            setOpenConfirm(false);
            setItemToDelete(null);
            getCategories();
        }
    };

    return (
        <>
            <TitleMain>Danh mục Affiliate</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/affiliate-category/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box my={2} display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        label="Tìm kiếm theo tên"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 300 }}
                    />
                    <Select
                        size="small"
                        value={typeFilter}
                        displayEmpty
                        onChange={(e) => setTypeFilter(e.target.value)}
                        sx={{ width: 300 }}
                    >
                        <MenuItem value="">Tất cả loại</MenuItem>
                        {Object.entries(AffiliateCategoryOptions).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên danh mục sản phẩm</strong></TableCell>
                                <TableCell><strong>Loại</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell align="right"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : list.length > 0 ? (
                                list.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{AffiliateCategoryOptions[item.type as AffiliateCategoryType] || item.type}</TableCell>
                                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => router.push(`/data/affiliate-category/${item.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => {
                                                setItemToDelete(item);
                                                setOpenConfirm(true);
                                            }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có dữ liệu
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
                    title="Xoá danh mục"
                    description={`Bạn có chắc muốn xoá danh mục "${itemToDelete?.name}" không?`}
                />
            </CardItem>
        </>
    );
}
