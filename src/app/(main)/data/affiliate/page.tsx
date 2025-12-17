'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteAffiliate from '@/hooks/Affiliate/useDeleteAffiliate';
import useGetAffiliates from '@/hooks/Affiliate/useGetAffiliates';
import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import { CardItem, HeaderRow, Note, TitleMain } from '@/styles/common';
import { AffiliateCategory } from '@/utils/type';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    Link,
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

type Affiliate = {
    id: string;
    comment_text: string;
    link_affiliate: string;
    affiliateCategory: AffiliateCategory;
    affiliate_category_id: string;
    createdAt: string;
};

export default function AffiliateListPage() {
    const router = useRouter();
    const { fetchAffiliates } = useGetAffiliates();
    const { deleteAffiliate } = useDeleteAffiliate();
    const { fetchAffiliateCategories } = useGetAffiliateCategories();

    const [affiliateLinks, setAffiliates] = useState<Affiliate[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [affiliateCategoryFilter, setAffiliateCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState<Affiliate | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getAffiliates = async () => {
        setLoading(true);
        try {
            const res = await fetchAffiliates({
                affiliate_category_id: affiliateCategoryFilter,
                page,
                size: 10,
                keySearch: searchTerm,
            });

            if (res?.success) {
                setAffiliates(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setAffiliates([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            setAffiliates([]);
        } finally {
            setLoading(false);
        }
    };


    const getCategories = async () => {
        const res = await fetchAffiliateCategories({ isPagin: false });
        if (res?.success) {
            setCategories(res.result.data);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        getAffiliates();
    }, [affiliateCategoryFilter, page, searchTerm]);

    const handleDelete = async () => {
        if (!linkToDelete) return;
        const res = await deleteAffiliate(linkToDelete.id);
        if (res?.success) {
            setOpenConfirm(false);
            setLinkToDelete(null);
            getAffiliates();
        }
    };

    return (
        <>
            <TitleMain>Danh sách Link Affiliate</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/affiliate/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                    <TextField
                        label="Tìm kiếm nội dung bình luận"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 300 }}
                    />
                    <Select
                        size="small"
                        displayEmpty
                        value={affiliateCategoryFilter}
                        onChange={(e) => setAffiliateCategoryFilter(e.target.value)}
                        sx={{ width: 250 }}
                    >
                        <MenuItem value="">Tất cả danh mục</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Nội dung bình luận</strong></TableCell>
                                <TableCell><strong>Link Affiliate</strong></TableCell>
                                <TableCell><strong>Loại sản phẩm</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell align="right"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : affiliateLinks.length > 0 ? (
                                affiliateLinks.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            <Box
                                                title={link.comment_text}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(link.comment_text)}
                                            >
                                                {link.comment_text.length > 30
                                                    ? link.comment_text.slice(0, 30) + '...'
                                                    : link.comment_text}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {link.link_affiliate ? (
                                                <Link
                                                    href={link.link_affiliate}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Xem sản phẩm
                                                </Link>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>{link.affiliateCategory.name || '-'}</TableCell>
                                        <TableCell>{new Date(link.createdAt).toLocaleString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => router.push(`/data/affiliate/${link.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => {
                                                setLinkToDelete(link);
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
                    description="Bạn có chắc chắn muốn xoá link Affiliate này không?"
                />
            </CardItem>
        </>
    );
}
