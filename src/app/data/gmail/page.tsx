'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteGmail from '@/hooks/Gmail/useDeleteGmail';
import useGetGmails from '@/hooks/Gmail/useGetGmails';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button, CircularProgress, IconButton,
    Pagination, Paper,
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function GmailPage() {
    const router = useRouter();
    const [threads, setGmails] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [pageGmailToDelete, setPageGmailToDelete] = useState<any | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { getGmails } = useGetGmails();
    const { deleteGmail } = useDeleteGmail();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchData();
    }, [keySearch, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getGmails({ keySearch, page, size: 10 });
            if (res?.success) {
                setGmails(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setGmails([]);
                setTotalPages(1);
            }
        } catch (err) {
            setGmails([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pageGmailToDelete) return;
        try {
            const res = await deleteGmail(pageGmailToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPageGmailToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách Gmail</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/gmail/create')}>+ Thêm mới</Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm Gmail"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ minWidth: 400 }}
                    />

                    <Button variant="contained" onClick={() => { setPage(1); fetchData(); }}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
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
                            ) : threads.length > 0 ? (
                                threads.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>{t.name}</TableCell>
                                        <TableCell>{t.gmail}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={t.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {t.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: "100px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/data/gmail/${t.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => { setPageGmailToDelete(t); setOpenConfirm(true); }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không tìm thấy dữ liệu</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {!loading && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá Gmail \"${pageGmailToDelete?.name}\" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
