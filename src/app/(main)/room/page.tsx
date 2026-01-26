'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
    Button,
    CircularProgress,
    IconButton,
    MenuItem,
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

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import PaginationWrapper from '@/components/common/PaginationWrapper';
import RoomBookingDialog from '@/components/common/RoomBookingDialog';
import RoomStatusDialog from '@/components/common/RoomStatusDialog';
import RoomStatusTag from '@/components/common/RoomStatusTag';
import ConfirmDialog from '@/components/ConfirmDialog';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';

import useDeleteRoom from '@/hooks/Room/useDeleteRoom';
import useGetRooms from '@/hooks/Room/useGetRooms';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';

import { ErrorMessage, RentalTypeLabels } from '@/common/const';
import { RentalStatus, RentalType, RoomStatus } from '@/common/enum';
import { getErrorMessage, RoomErrorCode } from '@/common/error';
import { RentalTypeOptions, RoomStatusOptions } from '@/common/option';
import { formatArea, formatVnd, truncate } from '@/common/service';

import type { Room } from '@/types/room';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import RentalStatusTag from '@/components/common/RentalStatusTag';

export default function RoomPage() {
    const router = useRouter();

    const { getRooms } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const { updateRoom } = useUpdateRoom();

    /* ================= STATE ================= */
    const [rooms, setRooms] = useState<Room[]>([]);
    const [keySearch, setKeySearch] = useState<string>('');
    const [rentalType, setRentalType] = useState<RentalType | ''>('');
    const [status, setStatus] = useState<RoomStatus | ''>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
    const [openBookingDialog, setOpenBookingDialog] = useState<boolean>(false);

    /* ================= FETCH ================= */
    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getRooms({
                key_search: keySearch || undefined,
                page,
                size: 10,
                rental_type: rentalType || undefined,
                status: status || undefined,
            });

            if (res?.success) {
                setRooms(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setRooms([]);
                setTotalPages(1);
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    }, [getRooms, keySearch, page, rentalType, status]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!roomToDelete?.id) return;

        try {
            const res = await deleteRoom(roomToDelete.id);
            if (res?.success) {
                toast.success('Xoá phòng thành công');
                setOpenConfirm(false);
                setRoomToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    const handleUpdateRoomStatus = async (status: RoomStatus) => {
        if (!selectedRoom?.id) return;

        try {
            setUpdatingStatus(true);

            const res = await updateRoom(selectedRoom.id, { status });
            if (!res?.success) {
                if (res?.code == RoomErrorCode.RENTAL_NOT_CONFIRMED) {
                    toast.error(getErrorMessage(RoomErrorCode.RENTAL_NOT_CONFIRMED));
                } else {
                    toast.error('Cập nhật trạng thái thất bại');
                }

                return;
            }

            toast.success('Cập nhật trạng thái phòng thành công');
            setOpenStatusDialog(false);
            setSelectedRoom(null);
            fetchData();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setUpdatingStatus(false);
        }
    };


    return (
        <>
            <TitleMain>Danh sách phòng</TitleMain>

            <CardItem>
                <HeaderRow>
                    {/* FILTERS */}
                    <div className="header-filters">
                        <TextField
                            size="small"
                            label="Tìm kiếm theo SĐT người đăng"
                            value={keySearch}
                            onChange={(e) => {
                                setPage(1);
                                setKeySearch(e.target.value);
                            }}
                            sx={{ minWidth: 320 }}
                        />

                        <TextField
                            select
                            size="small"
                            label="Loại hình"
                            value={rentalType}
                            onChange={(e) => {
                                setPage(1);
                                setRentalType(e.target.value as RentalType | '');
                            }}
                            sx={{ minWidth: 180 }}
                        >
                            {RentalTypeOptions.map((opt) => (
                                <MenuItem key={opt.value || 'all'} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="Trạng thái"
                            value={status}
                            onChange={(e) => {
                                setPage(1);
                                setStatus(e.target.value as RoomStatus | '');
                            }}
                            sx={{ minWidth: 180 }}
                        >
                            {RoomStatusOptions.map((opt) => (
                                <MenuItem key={opt.value || 'all'} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    {/* ACTIONS */}
                    <div className="header-actions">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/room/create')}
                        >
                            + Thêm phòng
                        </Button>
                    </div>
                </HeaderRow>


                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{
                        minWidth: 1200,
                    }}>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell align="left"><strong>Trạng thái phòng</strong></TableCell>
                                <TableCell sx={{ minWidth: "240px" }}><strong>Địa chỉ nhà</strong></TableCell>
                                <TableCell><strong>Người đăng</strong></TableCell>
                                <TableCell><strong>Chủ nhà</strong></TableCell>
                                <TableCell><strong>Trạng thái nhà</strong></TableCell>
                                <TableCell><strong>Hoa hồng</strong></TableCell>
                                <TableCell><strong>Mã phòng</strong></TableCell>
                                <TableCell sx={{ minWidth: "80px" }}><strong>Loại phòng</strong></TableCell>
                                <TableCell><strong>Tiêu đề</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
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
                            ) : rooms.length ? (
                                rooms.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell align="left">
                                            <RoomStatusTag
                                                status={r.status as RoomStatus}
                                                clickable
                                                onClick={() => {
                                                    setSelectedRoom(r);
                                                    setOpenStatusDialog(true);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TruncateWithTooltip text={r.rental?.address_detail} limit={50} />
                                        </TableCell>
                                        <TableCell>{r.rental?.createdBy?.phone} - {r.rental?.createdBy?.name}</TableCell>
                                        <TableCell>{r.rental?.collaborator?.user?.phone} - {r.rental?.collaborator?.user?.name}</TableCell>
                                        <TableCell align="center">
                                            <RentalStatusTag
                                                status={r.rental?.status as RentalStatus}
                                            />
                                        </TableCell>
                                        <TableCell>{r.rental?.commission}</TableCell>
                                        <TableCell>{r.room_code}</TableCell>
                                        <TableCell>
                                            {RentalTypeLabels[r.rental?.rental_type as RentalType]}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: "200px" }}>{truncate(r.title, 40)}</TableCell>
                                        <TableCell>
                                            {formatVnd(Number(r.price))}
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
                                        <TableCell align="center" sx={{ minWidth: "150px" }}>
                                            <Tooltip title="Thêm lịch xem">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedRoomForBooking(r);
                                                        setOpenBookingDialog(true);
                                                    }}
                                                >
                                                    <EventAvailableIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/room/${r.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setRoomToDelete(r);
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
                    title="Xác nhận xoá phòng"
                    description={`Bạn có chắc muốn xoá phòng "${roomToDelete?.room_code}" không?`}
                />

                <RoomStatusDialog
                    open={openStatusDialog}
                    onClose={() => {
                        setOpenStatusDialog(false);
                        setSelectedRoom(null);
                    }}
                    onConfirm={handleUpdateRoomStatus}
                    currentStatus={selectedRoom?.status as RoomStatus}
                    loading={updatingStatus}
                />

                <RoomBookingDialog
                    open={openBookingDialog}
                    room={selectedRoomForBooking}
                    onClose={() => {
                        setOpenBookingDialog(false);
                        setSelectedRoomForBooking(null);
                    }}
                    onSuccess={() => {
                        router.push('/booking');
                    }}
                />


            </CardItem>
        </>
    );
}
