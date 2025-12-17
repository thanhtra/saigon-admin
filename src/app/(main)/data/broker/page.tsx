'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteBroker from '@/hooks/Broker/useDeleteBroker';
import useGetBrokers from '@/hooks/Broker/useGetBrokers';
import { CardItem, TitleMain } from '@/styles/common';
import { SourceBroker, SourceBrokerOptions } from '@/utils/const';
import { capitalizeWords } from '@/utils/service';
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
import { renderSellingTags } from './renderSellingTags';

export default function BrokerPage() {
    const router = useRouter();
    const [brokers, setBrokers] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [pageBrokerToDelete, setPageBrokerToDelete] = useState<any | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { getBrokers } = useGetBrokers();
    const { deleteBroker } = useDeleteBroker();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchData();
    }, [keySearch, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getBrokers({ keySearch, page, size: 10 });
            if (res?.success) {
                setBrokers(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setBrokers([]);
                setTotalPages(1);
            }
        } catch (err) {
            setBrokers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pageBrokerToDelete) return;
        try {
            const res = await deleteBroker(pageBrokerToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPageBrokerToDelete(null);
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
            <TitleMain>Danh sách môi giới BDS</TitleMain>
            <CardItem>
                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
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
                                <TableCell><strong>Phone</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Khu vực</strong></TableCell>
                                <TableCell><strong>Nguồn</strong></TableCell>
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
                            ) : brokers.length > 0 ? (
                                brokers.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <a
                                                href={t.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {capitalizeWords(t.name)}
                                            </a>
                                        </TableCell>
                                        <TableCell>{t.phone}</TableCell>
                                        <TableCell
                                            title={t.email}
                                            sx={{
                                                maxWidth: 200,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => navigator.clipboard.writeText(t.email)}
                                        >
                                            {t.email.length > 15
                                                ? t.email.slice(0, 15) + '...'
                                                : t.email}
                                        </TableCell>
                                        <TableCell>{t.area}</TableCell>
                                        <TableCell>{SourceBrokerOptions[t.source as SourceBroker] || t.source}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={t.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {t.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: "100px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/data/broker/${t.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => { setPageBrokerToDelete(t); setOpenConfirm(true); }}>
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
                    description={`Bạn có chắc chắn muốn xoá Broker \"${pageBrokerToDelete?.name}\" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
