'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteTenant from '@/hooks/Tenant/useDeleteTenant';
import useGetTenants from '@/hooks/Tenant/useGetTenants';

import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
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
    Tooltip
} from '@mui/material';

import { ErrorMessage } from '@/common/const';
import { Tenant } from '@/common/type';
import PaginationWrapper from '@/components/common/PaginationWrapper';
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

                    <Button
                        variant="contained"
                        onClick={() => router.push('/tenant/create')}
                    >
                        + Thêm mới
                    </Button>
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
                                <TableCell align="center"><strong>Kích hoạt</strong></TableCell>
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
                                        <TableCell>
                                            <Tooltip title="Sao chép số điện thoại" placement="top">
                                                <span
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(tenant.user?.phone);
                                                        toast.success('Đã sao chép');
                                                    }}
                                                    style={{ cursor: 'pointer', marginRight: 4 }}
                                                >
                                                    {tenant.user?.phone}
                                                </span>
                                            </Tooltip>
                                        </TableCell>

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
                                            {tenant.contracts?.length || '-'}
                                        </TableCell>

                                        <TableCell>{tenant.note || '-'}</TableCell>

                                        <TableCell align="center">
                                            <Tooltip title={tenant.user?.active ? 'Đang hoạt động' : 'Không hoạt động'} placement="top">
                                                {tenant?.active ? (
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
                                                    router.push(`/tenant/${tenant.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
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
                    title="Xác nhận xoá khách hàng"
                    description={`Bạn muốn xoá khách hàng ${tenantToDelete?.user?.name} - ${tenantToDelete?.user?.phone}?`}
                />
            </CardItem>
        </>
    );
}
