'use client';

import { ErrorMessage, UserRoleOptions } from '@/common/const';
import { UserRole } from '@/common/enum';
import { User } from '@/common/type';
import PaginationWrapper from '@/components/common/PaginationWrapper';
import ConfirmDialog from '@/components/ConfirmDialog';
import ResetPasswordDialog, { UserResetInfo } from '@/components/ResetPasswordDialog';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import useDeleteUser from '@/hooks/User/useDeleteUser';
import useGetUsers from '@/hooks/User/useGetUsers';
import useResetPassword from '@/hooks/User/useResetPassword';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FacebookIcon from '@mui/icons-material/Facebook';
import LockResetIcon from '@mui/icons-material/LockReset';
import SmsIcon from '@mui/icons-material/Sms';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const [openReset, setOpenReset] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResetInfo | null>(null);

    const { resetPassword } = useResetPassword();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getUsers({
                key_search: search,
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
            toast.error(ErrorMessage.SYSTEM);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [getUsers, search, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    const handleOpenReset = (user: any) => {
        setSelectedUser(user);
        setOpenReset(true);
    };

    const resetPasswordApi = async (userId: string) => {
        try {
            const res = await resetPassword(userId);

            if (res.success) {
                toast.success('Reset mật khẩu thành công');
                return res.result.password;
            } else {
                toast.error('Reset mật khẩu thất bại');
                return "";
            }
        } catch (error) {
            toast.error(ErrorMessage.SYSTEM);
            return "";
        }
    };

    return (
        <>
            <TitleMain>Danh sách tài khoản</TitleMain>

            <CardItem>
                <HeaderRow>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tìm kiếm"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => router.push('/user/create')}
                    >
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Số điện thoại</strong></TableCell>
                                <TableCell><strong>Phân quyền</strong></TableCell>
                                <TableCell><strong>Liên hệ</strong></TableCell>
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
                                        <TableCell width={180}>
                                            {user.phone}
                                            <Tooltip title="Reset mật khẩu">
                                                <IconButton
                                                    sx={{ float: 'right', height: '20px' }}
                                                    color="warning"
                                                    onClick={() => handleOpenReset({
                                                        id: user.id,
                                                        phone: user.phone,
                                                        name: user.name,
                                                        role: user.role,
                                                    })}
                                                >
                                                    <LockResetIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{UserRoleOptions[user.role as UserRole]}</TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                {user?.link_facebook && (
                                                    <Tooltip title="Facebook" placement="top">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            component="a"
                                                            href={user.link_facebook}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FacebookIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {user?.phone && (
                                                    <Tooltip title="Zalo" placement="top">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            component="a"
                                                            href={`https://zalo.me/${user.zalo || user.phone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <SmsIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{TruncateWithTooltip({ text: user.note })}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={user.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {user.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.role !== UserRole.Admin &&
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            router.push(`/user/${user.id}/edit`)
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
                                                </>
                                            }
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

                {!loading && totalPages > 1 && (
                    <PaginationWrapper>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                        />
                    </PaginationWrapper>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá ${userToDelete?.name} - ${userToDelete?.phone}? Hành động này không thể hoàn tác.`}
                />

                <ResetPasswordDialog
                    open={openReset}
                    onClose={() => setOpenReset(false)}
                    user={selectedUser}
                    onReset={resetPasswordApi}
                />
            </CardItem>
        </>
    );
}
