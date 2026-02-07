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
    Tooltip,
    Typography
} from '@mui/material';

import { ErrorMessage } from '@/common/const';
import { BookingStatus } from '@/common/enum';
import { formatVnd } from '@/common/service';
import { formatDateTimeVN } from '@/common/time.service';
import BookingStatusDialog from '@/components/common/BookingStatusDialog';
import BookingStatusTag from '@/components/common/BookingStatusTag';
import RoomInfoDialog from '@/components/common/RoomInfoDialog.tsx';
import useDeleteBooking from '@/hooks/Booking/useDeleteBooking';
import useGetBookings from '@/hooks/Booking/useGetBookings';
import useUpdateBooking from '@/hooks/Booking/useUpdateBooking';
import { Room } from '@/types';
import { Booking } from '@/types/booking';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BookingEditDialog from './components/BookingEditDialog';


const calculateCommission = (price: number): number => {
    if (!price || price <= 0) return 0;

    if (price <= 2_500_000) return 300_000;
    if (price <= 4_000_000) return 500_000;
    if (price <= 5_000_000) return 750_000;
    if (price <= 6_000_000) return 1_000_000;
    if (price <= 7_000_000) return 1_250_000;
    if (price <= 8_000_000) return 1_500_000;
    if (price <= 9_000_000) return 1_750_000;
    if (price <= 10_000_000) return 2_000_000;
    if (price <= 11_000_000) return 2_250_000;

    // > 11tr
    const extraMillion = Math.ceil((price - 11_000_000) / 1_000_000);
    return 2_250_000 + extraMillion * 250_000;
};

const calculateSourceCommission = (customerCommission: number): number => {
    if (!customerCommission || customerCommission <= 0) return 0;
    return Math.round(customerCommission * 0.5);
};

const getCustomerCommission = (booking: Booking) => {
    if (
        booking.status !== BookingStatus.MovedIn ||
        !booking.referrer_phone ||
        !booking.room?.price
    ) {
        return null;
    }

    return calculateCommission(Number(booking.room.price));
};

const getSourceCommission = (booking: Booking) => {
    if (
        booking.status !== BookingStatus.MovedIn ||
        !booking.room?.ctv_collaborator ||
        !booking.room?.price
    ) {
        return null;
    }

    const customerCommission = calculateCommission(Number(booking.room.price));
    return calculateSourceCommission(customerCommission);
};


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
                                <TableCell><strong>SĐT khách</strong></TableCell>
                                <TableCell><strong>CTV khách</strong></TableCell>
                                <TableCell align="center" sx={{ minWidth: "120px" }}><strong>HH CTV khách</strong></TableCell>
                                <TableCell><strong>CTV nguồn</strong></TableCell>
                                <TableCell align="center" sx={{ minWidth: "120px" }}><strong>HH CTV nguồn</strong></TableCell>
                                <TableCell align="center" sx={{ minWidth: "120px" }}><strong>Đã chi HH</strong></TableCell>
                                <TableCell sx={{ minWidth: "120px" }}><strong>Thời gian xem</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell sx={{ minWidth: "120px" }}><strong>Giá phòng</strong></TableCell>
                                <TableCell sx={{ minWidth: "200px" }}><strong>Phòng</strong></TableCell>
                                <TableCell align="center" sx={{ minWidth: "100px" }}><strong>Hành động</strong></TableCell>
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
                                        <TableCell>
                                            <Tooltip title="Sao chép số điện thoại" placement="top">
                                                <span
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(booking.customer_phone);
                                                        toast.success('Đã sao chép');
                                                    }}
                                                    style={{ cursor: 'pointer', marginRight: 4 }}
                                                >
                                                    {booking.customer_phone}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Sao chép số điện thoại" placement="top">
                                                <span
                                                    onClick={() => {
                                                        if (!booking.referrer_phone) return;
                                                        navigator.clipboard.writeText(booking.referrer_phone);
                                                        toast.success('Đã sao chép');
                                                    }}
                                                    style={{ cursor: 'pointer', marginRight: 4 }}
                                                >
                                                    {booking.referrer_phone}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            {(() => {
                                                const commission = getCustomerCommission(booking);

                                                if (!commission) {
                                                    return <Typography variant="caption">—</Typography>;
                                                }

                                                return (
                                                    <Typography fontWeight={500}>
                                                        {formatVnd(commission)}
                                                    </Typography>
                                                );
                                            })()}
                                        </TableCell>

                                        <TableCell>
                                            {booking.room?.ctv_collaborator?.user
                                                ? `${booking.room.ctv_collaborator.user.name} - ${booking.room.ctv_collaborator.user.phone}`
                                                : '—'}
                                        </TableCell>

                                        <TableCell align="center">
                                            {(() => {
                                                const commission = getSourceCommission(booking);

                                                if (!commission) {
                                                    return <Typography variant="caption">—</Typography>;
                                                }

                                                return (
                                                    <Typography fontWeight={500} color="info.main">
                                                        {formatVnd(commission)}
                                                    </Typography>
                                                );
                                            })()}
                                        </TableCell>

                                        <TableCell align="center">
                                            {(() => {
                                                const hasAnyCommission =
                                                    getCustomerCommission(booking) ||
                                                    getSourceCommission(booking);

                                                if (!hasAnyCommission) {
                                                    return <Typography variant="caption">—</Typography>;
                                                }

                                                return booking.is_paid_commission ? (
                                                    <Typography color="success.main" fontWeight={500}>
                                                        Đã chi
                                                    </Typography>
                                                ) : (
                                                    <Typography color="warning.main">
                                                        Chưa chi
                                                    </Typography>
                                                );
                                            })()}
                                        </TableCell>

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

                                        <TableCell>{formatVnd(Number(booking.room.price))}</TableCell>
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
