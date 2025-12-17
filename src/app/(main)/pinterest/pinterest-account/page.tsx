'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeletePinterest from '@/hooks/Pinterest/useDeletePinterest';
import useGetPinterests from '@/hooks/Pinterest/useGetPinterests';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Status, StatusName } from '@/utils/const';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from "@mui/icons-material/Update";
import {
    Box, Button, CircularProgress, IconButton, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function PinterestPage() {
    const router = useRouter();
    const [pinterests, setPinterests] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [pagePinterestToDelete, setPagePinterestToDelete] = useState<any | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { getPinterests } = useGetPinterests();
    const { deletePinterest } = useDeletePinterest();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [keySearch, page, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getPinterests(
                {
                    keySearch,
                    page,
                    size: 10,
                    ...(statusFilter !== '' && { active: statusFilter === StatusName.active ? true : false })
                }
            );
            if (res?.success) {
                setPinterests(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setPinterests([]);
                setTotalPages(1);
            }
        } catch (err) {
            setPinterests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pagePinterestToDelete) return;
        try {
            const res = await deletePinterest(pagePinterestToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPagePinterestToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    const updateToken = (pinterest: any) => {
        const clientId = pinterest?.client_id;
        if (!clientId) {
            toast.error("Vui lòng nhập client_id trước khi kết nối Google");
            return;
        }

        if (!pinterest?.id) {
            toast.error("Không có thông tin ID tài khoản Pinterest");
            return;
        }

        // Pinterest scopes – tuỳ quyền bạn cần (pins:read, pins:write, boards:read, boards:write...)
        const scope = encodeURIComponent('pins:read,pins:write,boards:read,boards:write');

        // Pinterest cho phép truyền state – bạn gắn pinterest.id để callback xử lý
        const state = encodeURIComponent(JSON.stringify({ pinterestid: pinterest.id }));

        // Redirect URI phải trùng với URI bạn đã cấu hình trong Pinterest Developer App
        const redirectUri = 'http://localhost:3002/pinterest/pinterest-account/oauth2callback';

        // Pinterest OAuth2 authorization endpoint
        const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        window.location.href = authUrl;
    };


    return (
        <>
            <TitleMain>Danh sách Pinterest</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/pinterest/pinterest-account/create')}>+ Thêm mới</Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ minWidth: 400 }}
                    />

                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="">Tất cả trạng thái</MenuItem>
                        {Status.map((s: any) => (
                            <MenuItem key={s.value} value={s.value}>
                                {s.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={() => { setPage(1); fetchData(); }}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell><strong>Account ID</strong></TableCell>
                                <TableCell><strong>Tên tài khoản</strong></TableCell>
                                <TableCell align="center"><strong>Client ID</strong></TableCell>
                                <TableCell align="center"><strong>Client Secret</strong></TableCell>
                                <TableCell align="center"><strong>Access Token</strong></TableCell>
                                <TableCell align="center"><strong>Refresh Token</strong></TableCell>
                                <TableCell align="center"><strong>Ngày hết hạn</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Cập nhật token</strong></TableCell>
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
                            ) : pinterests.length > 0 ? (
                                pinterests.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.gmail}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://www.pinterest.com/${p.pinterest_account_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {p.pinterest_account_id}
                                            </a>
                                        </TableCell>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={p.client_id ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {p.client_id ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={p.client_secret ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {p.client_secret ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={p.access_token ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {p.access_token ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={p.refresh_token ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {p.refresh_token ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">{p.token_expiry || '-'}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={p.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {p.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <UpdateIcon onClick={() => updateToken(p)} sx={{ cursor: "pointer", color: "blue" }} />
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: "100px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/pinterest/pinterest-account/${p.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => { setPagePinterestToDelete(p); setOpenConfirm(true); }}>
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
                    description={`Bạn có chắc chắn muốn xoá Pinterest \"${pagePinterestToDelete?.name}\" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
