'use client';

import { ErrorMessage, RentalTypeLabels } from '@/common/const';
import { RentalStatus, RentalType } from '@/common/enum';
import { formatPriceRange, resolveRentalPrice } from '@/common/page.service';
import PaginationWrapper from '@/components/common/PaginationWrapper';
import RentalStatusDialog from '@/components/common/RentalStatusDialog';
import RentalStatusTag from '@/components/common/RentalStatusTag';
import ConfirmDialog from '@/components/ConfirmDialog';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import useDeleteRental from '@/hooks/Rental/useDeleteRental';
import useGetRentals from '@/hooks/Rental/useGetRentals';
import useUpdateRental from '@/hooks/Rental/useUpdateRental';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Rental } from '@/types';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
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
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';


export default function RentalPage() {
    const router = useRouter();
    const { getRentals } = useGetRentals();
    const { deleteRental } = useDeleteRental();
    const { updateRental } = useUpdateRental();

    const [rentals, setRentals] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState<any | null>(null);

    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);




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

    const handleUpdateRentalStatus = async (status: RentalStatus) => {
        if (!selectedRental?.id) return;

        try {
            setUpdatingStatus(true);

            const res = await updateRental(selectedRental.id, { status });
            if (!res?.success) {
                toast.error('Cập nhật trạng thái thất bại');
                return;
            }

            toast.success('Cập nhật trạng thái thành công');
            setOpenStatusDialog(false);
            setSelectedRental(null);
            fetchData();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setUpdatingStatus(false);
        }
    };


    const rentalsWithPrice = useMemo(
        () =>
            rentals.map(r => ({
                ...r,
                displayPrice: resolveRentalPrice(r),
            })),
        [rentals],
    );


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
                    <Table
                        size="small"
                        sx={{
                            minWidth: 1200,
                        }}
                    >

                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Người đăng</strong></TableCell>
                                <TableCell><strong>Chủ nhà</strong></TableCell>
                                <TableCell><strong>Địa chỉ thực tế</strong></TableCell>
                                <TableCell><strong>Loại hình</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
                                <TableCell><strong>Hoa hồng</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell align="center"><strong>Kích hoạt</strong></TableCell>
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
                            ) : rentalsWithPrice.length ? (
                                rentalsWithPrice.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell align="center">
                                            <RentalStatusTag
                                                status={r.status as RentalStatus}
                                                clickable
                                                onClick={() => {
                                                    setSelectedRental(r);
                                                    setOpenStatusDialog(true);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{r.createdBy?.phone} - {r.createdBy?.name}</TableCell>
                                        <TableCell>{r.collaborator?.user?.phone} - {r.collaborator?.user?.name}</TableCell>
                                        <TableCell>
                                            <TruncateWithTooltip text={r.address_detail} limit={50} />
                                        </TableCell>
                                        <TableCell>
                                            {RentalTypeLabels[r.rental_type as RentalType]}
                                        </TableCell>

                                        <TableCell>
                                            {formatPriceRange(resolveRentalPrice(r))}
                                        </TableCell>
                                        <TableCell>{r.commission}</TableCell>
                                        <TableCell>
                                            {dayjs(r.createdAt).format(
                                                'DD/MM/YYYY HH:mm',
                                            )}
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
                                        <TableCell align="center" sx={{ minWidth: 100 }}>
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
                    title="Xác nhận xoá"
                    description={`Tất cả dữ liệu về nhà, phòng, hình ảnh, hợp đồng sẽ bị xoá, có chắc chắn xoá nhà "${rentalToDelete?.address_detail}" của "${rentalToDelete?.collaborator?.user?.name} - ${rentalToDelete?.collaborator?.user?.phone}" không?`}
                />

                <RentalStatusDialog
                    open={openStatusDialog}
                    loading={updatingStatus}
                    currentStatus={selectedRental?.status as RentalStatus}
                    onClose={() => {
                        setOpenStatusDialog(false);
                        setSelectedRental(null);
                    }}
                    onConfirm={handleUpdateRentalStatus}
                />


            </CardItem>
        </>
    );
}
