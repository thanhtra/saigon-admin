'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteAccountFacebook from '@/hooks/AccountFacebook/useDeleteAccountFacebook';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { AccountFacebook } from '@/utils/type';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    Pagination,
    Paper,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function AccountFacebookPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<AccountFacebook[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [facebookToDelete, setFacebookToDelete] = useState<AccountFacebook | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { fetchAccountFacebooks } = useGetAccountFacebooks();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { deleteAccountFacebook } = useDeleteAccountFacebook();
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchDataAccountFagebooks();
    }, []);

    useEffect(() => {
        fetchDataAccountFagebooks();
    }, [keySearch, page]);

    const fetchDataAccountFagebooks = async () => {
        setLoading(true);
        try {
            const response = await fetchAccountFacebooks({
                keySearch,
                page,
                size: 10,
            });

            if (response.success) {
                setAccounts(response.result.data);
                setTotalPages(response.result.meta.pageCount);
            } else {
                setAccounts([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching:', error);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchDataAccountFagebooks();
    };

    const handleDelete = async () => {
        if (!facebookToDelete?.id) return;
        try {
            const res = await deleteAccountFacebook(facebookToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setFacebookToDelete(null);
                fetchDataAccountFagebooks();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách tài khoản Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/facebook/account/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm tài khoản"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ minWidth: 400 }}
                    />

                    <Button variant="contained" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Facebook ID</strong></TableCell>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell align="center"><strong>App developer</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : accounts.length > 0 ? (
                                accounts.map((acc) => (
                                    <TableRow key={acc.id}>
                                        <TableCell>
                                            <a
                                                href={`https://www.facebook.com/profile.php?id=${acc.facebook_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                {acc.facebook_id}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {acc.name}
                                        </TableCell>
                                        <TableCell>
                                            {acc.gmail}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={acc.have_app ? 'Đã đăng kí' : 'Chưa đăng kí'}>
                                                {acc.have_app ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CancelIcon color="error" fontSize="small" />
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={acc.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {acc.active ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CancelIcon color="error" fontSize="small" />
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => router.push(`/facebook/account/${acc.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setFacebookToDelete(acc);
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
                                    <TableCell colSpan={4} align="center">
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
                    description={`Bạn có chắc chắn muốn xoá tài khoản facebook "${facebookToDelete?.id}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
