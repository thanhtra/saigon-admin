'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteUser from '@/hooks/User/useDeleteUser';
import useGetUsers from '@/hooks/User/useGetUser';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { User, UserRole, UserRoleOptions } from '@/types/user';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function UsersPage() {
    const router = useRouter();
    const { getUsers } = useGetUsers();
    const { deleteUser, loading: deleting } = useDeleteUser();

    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // ---------------- FETCH USERS ----------------
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getUsers({
                keySearch: search,
                page,
                size: 10,
            });

            if (res?.success) {
                setUsers(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setUsers([]);
                setTotalPages(1);
            }
        } catch {
            toast.error('Không thể tải danh sách người dùng');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [getUsers, search, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ---------------- DELETE ----------------
    const handleDelete = async () => {
        if (!userToDelete?.id) return;

        try {
            const res = await deleteUser(userToDelete.id);
            if (res?.success) {
                toast.success('Xoá thành công');
                setOpenConfirm(false);
                setUserToDelete(null);
                fetchUsers();
            } else {
                toast.error(res?.message || 'Xoá thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách người dùng</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/marketing/user/create')}
                    >
                        + Thêm mới
                    </Button>
                </HeaderRow>

                {/* SEARCH */}
                <Box mb={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tìm kiếm"
                        value={search}
                        onChange={(e) => {
                            setPage(0);
                            setSearch(e.target.value);
                        }}
                        sx={{ maxWidth: 500 }}
                    />
                </Box>

                {/* TABLE */}
                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Số điện thoại</strong></TableCell>
                                <TableCell><strong>Phân quyền</strong></TableCell>
                                <TableCell><strong>Facebook</strong></TableCell>
                                <TableCell><strong>Mô tả</strong></TableCell>
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
                            ) : users.length ? (
                                users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{UserRoleOptions[user.role as UserRole]}</TableCell>
                                        <TableCell>
                                            {user?.link_facebook ? (
                                                <Link
                                                    href={user.link_facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Facebook
                                                </Link>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{user.note}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={user.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {user.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/marketing/user/${user.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={deleting}
                                                onClick={() => {
                                                    setUserToDelete(user);
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
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                        />
                    </Box>
                )}

                {/* CONFIRM */}
                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    title="Xác nhận xoá"
                    description="Bạn có chắc chắn muốn xoá? Hành động này không thể hoàn tác."
                />
            </CardItem>
        </>
    );
}
