'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import PaginationWrapper from '@/components/common/PaginationWrapper';

import { CardItem, HeaderRow, TitleMain } from '@/styles/common';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
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
    Typography
} from '@mui/material';

import { ErrorMessage } from '@/common/const';
import { BookingStatus } from '@/common/enum';
import { formatDateTimeVN } from '@/common/time.service';
import BookingStatusDialog from '@/components/common/BookingStatusDialog';
import BookingStatusTag from '@/components/common/BookingStatusTag';
import RoomInfoDialog from '@/components/common/RoomInfoDialog.tsx';
import useDeleteBooking from '@/hooks/Booking/useDeleteBooking';
import useGetBookings from '@/hooks/Booking/useGetBookings';
import useUpdateBooking from '@/hooks/Booking/useUpdateBooking';
import { Booking } from '@/types/booking';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BookingEditDialog from './components/BookingEditDialog';
import { Room } from '@/types';

export default function BookingsPage() {
    const { getBookings } = useGetBookings();
    const { deleteBooking, loading: deleting } = useDeleteBooking();
    const { updateBooking } = useUpdateBooking();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);



    const [openConfirm, setOpenConfirm] = useState(false);
    const [bookingToDelete, setBookingToDelete] =
        useState<Booking | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBookings({
                key_search: search,
                page,
                size: 10,
            });

            if (res?.success) {
                setBookings(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setBookings([]);
                setTotalPages(1);
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [getBookings, search, page]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDelete = async () => {
        if (!bookingToDelete?.id) return;

        try {
            const res = await deleteBooking(bookingToDelete.id);
            if (res?.success) {
                toast.success('Xoá lịch xem phòng thành công');
                setOpenConfirm(false);
                setBookingToDelete(null);
                fetchBookings();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    const handleUpdateBookingStatus = async (status: BookingStatus) => {
        if (!selectedBooking?.id) {
            toast.error('Cập nhật trạng thái thất bại');
            return;
        }

        try {
            setUpdatingStatus(true);

            const res = await updateBooking(selectedBooking.id, { status });
            if (!res?.success) {
                toast.error('Cập nhật trạng thái thất bại');
                return;
            }

            toast.success('Cập nhật trạng thái thành công');
            setOpenStatusDialog(false);
            setSelectedBooking(null);
            fetchBookings();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <>
            <TitleMain>Quản lý lịch xem phòng</TitleMain>

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
                                <TableCell><strong>Khách hàng</strong></TableCell>
                                <TableCell><strong>SĐT</strong></TableCell>
                                <TableCell><strong>Người giới thiệu</strong></TableCell>
                                <TableCell><strong>Thời gian xem</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Phòng</strong></TableCell>
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
                            ) : bookings.length ? (
                                bookings.map((booking) => (
                                    <TableRow key={booking.id} hover>
                                        <TableCell>{booking.customer_name}</TableCell>
                                        <TableCell>{booking.customer_phone}</TableCell>
                                        <TableCell>{booking.referrer_phone || '-'}</TableCell>
                                        <TableCell>
                                            {formatDateTimeVN(booking.viewing_at)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <BookingStatusTag
                                                status={booking.status as BookingStatus}
                                                clickable
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setOpenStatusDialog(true);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    color: 'primary.main',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                                onClick={() => {
                                                    setSelectedRoom(booking.room);
                                                    setOpenRoomDialog(true);
                                                }}
                                            >
                                                {booking.room?.title}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {booking.room?.room_code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" width={120}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setBookingToEdit(booking);
                                                    setOpenEdit(true);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={deleting}
                                                onClick={() => {
                                                    setBookingToDelete(booking);
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
                    title="Xác nhận xoá lịch xem phòng"
                    description={`Bạn muốn xoá lịch xem của ${bookingToDelete?.customer_name} - ${bookingToDelete?.customer_phone}?`}
                />

                <BookingStatusDialog
                    open={openStatusDialog}
                    onClose={() => {
                        setOpenStatusDialog(false);
                        setSelectedBooking(null);
                    }}
                    onConfirm={handleUpdateBookingStatus}
                    currentStatus={selectedBooking?.status as BookingStatus}
                    loading={updatingStatus}
                />

                <RoomInfoDialog
                    open={openRoomDialog}
                    onClose={() => {
                        setOpenRoomDialog(false);
                        setSelectedRoom(null);
                    }}
                    room={selectedRoom}
                />

                <BookingEditDialog
                    open={openEdit}
                    booking={bookingToEdit}
                    onClose={() => {
                        setOpenEdit(false);
                        setBookingToEdit(null);
                    }}
                    onSuccess={fetchBookings}
                />


            </CardItem>
        </>
    );
}
