'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteAccountLinkedIn from '@/hooks/AccountLinkedin/useDeleteAccountLinkedIn';
import useGetAccountLinkedIns from '@/hooks/AccountLinkedin/useGetAccountLinkedIns';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { redirectUriLinkedIn } from '@/utils/const';
import { AccountLinkedin } from '@/utils/type';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from "@mui/icons-material/Update";
import {
    Box, Button,
    CircularProgress,
    IconButton,
    Pagination,
    Paper,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function AccountLinkedinPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<AccountLinkedin[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [linkedinToDelete, setLinkedinToDelete] = useState<AccountLinkedin | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { getAccountLinkedIns } = useGetAccountLinkedIns();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { deleteAccountLinkedIn } = useDeleteAccountLinkedIn();
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchDataAccounts();
    }, [keySearch, page]);

    const fetchDataAccounts = async () => {
        setLoading(true);
        try {
            const response = await getAccountLinkedIns({
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
        fetchDataAccounts();
    };

    const handleDelete = async () => {
        if (!linkedinToDelete?.id) return;
        try {
            const res = await deleteAccountLinkedIn(linkedinToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setLinkedinToDelete(null);
                fetchDataAccounts();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    const handleConnect = (account: AccountLinkedin) => {
        if (!account?.id) return;

        const scope = [
            "openid",         // Lấy thông tin cơ bản qua /userinfo
            "profile",        // Lấy tên, ảnh đại diện
            "email",          // Lấy email chính
            "w_member_social" // Đăng bài, bình luận với tư cách cá nhân
            // "w_organization_social",  // Đăng bài với tư cách Page
            // "rw_organization_admin"   // Lấy danh sách Page bạn quản lý
        ].join(" ");

        const params = new URLSearchParams({
            client_id: account.client_id,
            redirect_uri: redirectUriLinkedIn,
            response_type: "code",
            scope,
            state: JSON.stringify({ linkedinId: account.id }),
        });

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    };

    return (
        <>
            <TitleMain>Danh sách tài khoản LinkedIn</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/linkedin/account/create')}>
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
                                <TableCell><strong>LinkedIn ID</strong></TableCell>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell><strong>Profile Urn</strong></TableCell>
                                <TableCell><strong>Cập nhật token</strong></TableCell>
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
                                                href={`https://www.linkedin.com/in/${acc.linkedin_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                {acc.linkedin_id}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {acc.name}
                                        </TableCell>
                                        <TableCell>
                                            {acc.gmail}
                                        </TableCell>
                                        <TableCell>
                                            {acc.linkedin_profile_urn}
                                        </TableCell>
                                        <TableCell align="center">
                                            {!acc.access_token && (
                                                <UpdateIcon onClick={() => handleConnect(acc)} sx={{ cursor: "pointer", color: "blue" }} />
                                            )}
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
                                            <IconButton size="small" onClick={() => router.push(`/linkedin/account/${acc.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setLinkedinToDelete(acc);
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
                    description={`Bạn có chắc chắn muốn xoá tài khoản linkedin "${linkedinToDelete?.id}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
