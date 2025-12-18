'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteRental from '@/hooks/Rental/useDeleteRental';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
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
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import useGetRentals from '@/hooks/Rental/useGetRental';
import { RentalTypeLabels } from '@/common/const';
import { RentalType } from '@/common/enum';


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

    // ---------------- FETCH DATA ----------------
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRentals({
                keySearch,
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
            toast.error('Không thể tải danh sách rental');
            setRentals([]);
        } finally {
            setLoading(false);
        }
    }, [getRentals, keySearch, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ---------------- DELETE ----------------
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
                toast.error(res?.message || 'Xoá thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách cho thuê</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/rental/create')}
                    >
                        + Thêm mới
                    </Button>
                </HeaderRow>

                {/* SEARCH */}
                <Box mb={2} display="flex" gap={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={keySearch}
                        onChange={(e) => {
                            setPage(1);
                            setKeySearch(e.target.value);
                        }}
                        sx={{ minWidth: 400 }}
                    />
                </Box>

                {/* TABLE */}
                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tiêu đề</strong></TableCell>
                                <TableCell><strong>Loại hình</strong></TableCell>
                                <TableCell><strong>Địa chỉ</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
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
                                        <TableCell>{r.title}</TableCell>
                                        <TableCell>
                                            {RentalTypeLabels[r.rental_type as RentalType]}
                                        </TableCell>
                                        <TableCell>
                                            {r.address_detail}
                                        </TableCell>
                                        <TableCell>
                                            {r.price
                                                ? `${r.price.toLocaleString()} đ`
                                                : '-'}
                                        </TableCell>
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

                {/* CONFIRM DELETE */}
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
