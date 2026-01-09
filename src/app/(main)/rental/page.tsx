'use client';

import { ErrorMessage, RentalTypeLabels } from '@/common/const';
import { RentalType } from '@/common/enum';
import { formatDateTime, formatVnd } from '@/common/service';
import ConfirmDialog from '@/components/ConfirmDialog';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import useDeleteRental from '@/hooks/Rental/useDeleteRental';
import useGetRentals from '@/hooks/Rental/useGetRentals';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
    Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function RentalPage() {
    const router = useRouter();
    const { getRentals } = useGetRentals();
    const { deleteRental } = useDeleteRental();

    const [rentals, setRentals] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState<any | null>(null);


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRentals({
                key_search: keySearch,
                page,
                size: 10,
            });

            if (res?.success) {
                setRentals(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setRentals([]);
                setTotalPages(1);
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
            setRentals([]);
        } finally {
            setLoading(false);
        }
    }, [getRentals, keySearch, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleDelete = async () => {
        if (!rentalToDelete?.id) return;

        try {
            const res = await deleteRental(rentalToDelete.id);
            if (res?.success) {
                toast.success('Xoá thành công');
                setOpenConfirm(false);
                setRentalToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Danh sách nhà cho thuê</TitleMain>

            <CardItem>
                <HeaderRow>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={keySearch}
                        onChange={(e) => {
                            setPage(1);
                            setKeySearch(e.target.value);
                        }}
                        sx={{ minWidth: 300 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => router.push('/rental/create')}
                    >
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Chủ nhà</strong></TableCell>
                                <TableCell><strong>Người đăng</strong></TableCell>
                                <TableCell><strong>Hoa hồng</strong></TableCell>
                                <TableCell><strong>Loại hình</strong></TableCell>
                                <TableCell><strong>Địa chỉ</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : rentals.length ? (
                                rentals.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.collaborator?.user?.name} - {r.collaborator?.user?.phone}</TableCell>
                                        <TableCell>{r.createdBy?.name} - {r.createdBy?.phone}</TableCell>
                                        <TableCell>
                                            {r.commission_value}
                                        </TableCell>
                                        <TableCell>
                                            {RentalTypeLabels[r.rental_type as RentalType]}
                                        </TableCell>
                                        <TableCell>
                                            <TruncateWithTooltip text={r.address_detail} />
                                        </TableCell>
                                        <TableCell> {formatVnd(r.price)}</TableCell>
                                        <TableCell> {formatDateTime(r.createdAt)}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip
                                                title={r.active ? 'Đang hoạt động' : 'Tạm ẩn'}
                                            >
                                                {r.active ? (
                                                    <CheckCircleIcon
                                                        color="success"
                                                        fontSize="small"
                                                    />
                                                ) : (
                                                    <CancelIcon
                                                        color="error"
                                                        fontSize="small"
                                                    />
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/rental/${r.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setRentalToDelete(r);
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
                                    <TableCell colSpan={6} align="center">
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
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá "${rentalToDelete?.title}" không?`}
                />
            </CardItem>
        </>
    );
}
