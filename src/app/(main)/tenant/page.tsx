'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteTenant from '@/hooks/Tenant/useDeleteTenant';
import useGetTenants from '@/hooks/Tenant/useGetTenants';

import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
    Box,
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

import { ErrorMessage } from '@/common/const';
import { Tenant } from '@/common/type';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function TenantsPage() {
    const router = useRouter();
    const { getTenants } = useGetTenants();
    const { deleteTenant, loading: deleting } = useDeleteTenant();

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

    const fetchTenants = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getTenants({
                key_search: search,
                page,
                size: 10,
            });

            if (res?.success) {
                setTenants(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setTenants([]);
                setTotalPages(1);
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
            setTenants([]);
        } finally {
            setLoading(false);
        }
    }, [getTenants, search, page]);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    const handleDelete = async () => {
        if (!tenantToDelete?.id) return;

        try {
            const res = await deleteTenant(tenantToDelete.id);
            if (res?.success) {
                toast.success('Xoá khách hàng thành công');
                setOpenConfirm(false);
                setTenantToDelete(null);
                fetchTenants();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Quản lý khách hàng</TitleMain>

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
                        sx={{ maxWidth: 300 }}
                    />
                </HeaderRow>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>SĐT</strong></TableCell>
                                <TableCell><strong>Facebook</strong></TableCell>
                                <TableCell><strong>Số hợp đồng</strong></TableCell>
                                <TableCell><strong>Ghi chú</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : tenants.length ? (
                                tenants.map((tenant) => (
                                    <TableRow key={tenant.id} hover>
                                        <TableCell>{tenant.user?.name}</TableCell>
                                        <TableCell>{tenant.user?.phone}</TableCell>

                                        <TableCell>
                                            {tenant.user?.link_facebook ? (
                                                <Link
                                                    href={tenant.user?.link_facebook}
                                                    target="_blank"
                                                    underline="hover"
                                                >
                                                    Facebook
                                                </Link>
                                            ) : '-'}
                                        </TableCell>

                                        <TableCell>
                                            {tenant.contracts?.length || 0}
                                        </TableCell>

                                        <TableCell>{tenant.note || '-'}</TableCell>

                                        <TableCell align="center">
                                            <Tooltip title={tenant.user?.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {tenant.user?.active ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CancelIcon color="error" fontSize="small" />
                                                )}
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/tenant/${tenant.id}`)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={deleting}
                                                onClick={() => {
                                                    setTenantToDelete(tenant);
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
                                    <TableCell colSpan={7} align="center">
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
                            onChange={(_, value) => setPage(value)}
                        />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    title="Xác nhận xoá khách hàng"
                    description="Bạn có chắc chắn muốn xoá khách hàng này?"
                />
            </CardItem>
        </>
    );
}
