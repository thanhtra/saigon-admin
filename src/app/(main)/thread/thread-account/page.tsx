'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteThread from '@/hooks/Thread/useDeleteThread';
import useGetThreads from '@/hooks/Thread/useGetThreads';
import useGetTopics from '@/hooks/Topic/useGetTopics';
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

export default function ThreadPage() {
    const router = useRouter();
    const [threads, setThreads] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [pageThreadToDelete, setPageThreadToDelete] = useState<any | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);
    const { getThreads } = useGetThreads();
    const { deleteThread } = useDeleteThread();
    const { fetchTopics } = useGetTopics();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchInitialData = async () => {
            const res = await fetchTopics({ isPagin: false });
            if (res?.success) {
                setTopics(res.result.data);
                fetchData();
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [keySearch, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getThreads({ keySearch, page, size: 10 });
            if (res?.success) {
                setThreads(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setThreads([]);
                setTotalPages(1);
            }
        } catch (err) {
            setThreads([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pageThreadToDelete) return;
        try {
            const res = await deleteThread(pageThreadToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPageThreadToDelete(null);
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
            <TitleMain>Danh sách Threads</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/thread/thread-account/create')}>+ Thêm mới</Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm Thread"
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
                                <TableCell><strong>Username</strong></TableCell>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell><strong>Tên</strong></TableCell>
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
                                        <TableCell>
                                            <a
                                                href={`https://www.threads.com/@${t.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {t.username}
                                            </a>
                                        </TableCell>
                                        <TableCell>{t.gmail}</TableCell>
                                        <TableCell>{t.name}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={t.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {t.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: "100px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/thread/thread-account/${t.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => { setPageThreadToDelete(t); setOpenConfirm(true); }}>
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
                    description={`Bạn có chắc chắn muốn xoá Thread \"${pageThreadToDelete?.name}\" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
