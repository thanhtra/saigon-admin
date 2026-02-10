'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
    Tooltip
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
import { CardItem, HeaderRowFilter, TitleMain } from '@/styles/common';

import useDeleteRoom from '@/hooks/Room/useDeleteRoom';
import useGetRooms from '@/hooks/Room/useGetRooms';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';

import { ErrorMessage, RentalTypeLabels } from '@/common/const';
import { CollaboratorType, FieldCooperation, RentalStatus, RentalType, RoomStatus } from '@/common/enum';
import { getErrorMessage, RoomErrorCode } from '@/common/error';
import { RentalTypeOptions, RoomStatusOptions } from '@/common/option';
import { formatVnd, truncate } from '@/common/service';

import RentalStatusTag from '@/components/common/RentalStatusTag';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import type { Room } from '@/types/room';

import { Option } from '@/common/type';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormTextField from '@/components/FormTextField';
import useGetCollaboratorsCtv from '@/hooks/Collaborator/useGetCollaboratorsCtv';
import { useForm } from 'react-hook-form';

type RoomFilterForm = {
    key_search?: string;
    rental_type?: RentalType | '';
    status?: RoomStatus | '';
    ctv_collaborator_id?: string;
};


export default function RoomPage() {
    const router = useRouter();

    const { getRooms } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const { updateRoom } = useUpdateRoom();
    const { getCollaboratorsCtv } = useGetCollaboratorsCtv();

    const [rooms, setRooms] = useState<Room[]>([]);

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
    const [collaboratorOptions, setCollaboratorOptions] = useState<Option[]>([]);
    const [filters, setFilters] = useState<RoomFilterForm>({});

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<RoomFilterForm>({
        defaultValues: {
            key_search: '',
            rental_type: '',
            status: '',
            ctv_collaborator_id: '',
        },
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRooms({
                page,
                size: 10,
                key_search: filters.key_search || undefined,
                rental_type: filters.rental_type || undefined,
                status: filters.status || undefined,
                ctv_collaborator_id: filters.ctv_collaborator_id || undefined,
            });

            if (res?.success) {
                setRooms(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            }
        } finally {
            setLoading(false);
        }
    }, [getRooms, filters, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        (async () => {
            const res = await getCollaboratorsCtv({
                type: CollaboratorType.Broker,
                field_cooperation: FieldCooperation.Rental,
            });

            if (res?.success) {
                setCollaboratorOptions(
                    res.result.map((c: any) => ({
                        label: `${c.name} - ${c.phone}`,
                        value: c.id,
                    })),
                );
            }
        })();
    }, [getCollaboratorsCtv]);

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

    const onSearch = (data: RoomFilterForm) => {
        setPage(1);
        setFilters({
            key_search: data.key_search || undefined,
            rental_type: data.rental_type || undefined,
            status: data.status || undefined,
            ctv_collaborator_id: data.ctv_collaborator_id || undefined,
        });
    };

    const onReset = () => {
        reset({
            key_search: '',
            rental_type: '',
            status: '',
            ctv_collaborator_id: '',
        });

        setPage(1);
        setFilters({});
    };


    return (
        <>
            <TitleMain>Danh sách phòng</TitleMain>

            <CardItem>
                <HeaderRowFilter>
                    <form onSubmit={handleSubmit(onSearch)} className="filter-form">
                        <div className="filter-bar">

                            <div className="filter-inputs">
                                <FormTextField
                                    name="key_search"
                                    control={control}
                                    size="small"
                                    label="Code, Giá, Địa chỉ, SĐT"
                                />

                                <FormTextField
                                    name="rental_type"
                                    control={control}
                                    size="small"
                                    label="Loại hình"
                                    options={RentalTypeOptions}
                                />

                                <FormTextField
                                    name="status"
                                    control={control}
                                    size="small"
                                    label="Trạng thái"
                                    options={RoomStatusOptions}
                                />

                                <FormAutocomplete
                                    name="ctv_collaborator_id"
                                    control={control}
                                    size="small"
                                    label="Cộng tác viên"
                                    options={[
                                        { label: 'Tất cả CTV', value: '' },
                                        ...collaboratorOptions,
                                    ]}
                                />
                            </div>

                            <div className="filter-actions">
                                <Button type="submit" variant="contained" size="small">
                                    Tìm kiếm
                                </Button>
                                <Button variant="outlined" size="small" onClick={onReset}>
                                    Đặt lại
                                </Button>
                            </div>

                        </div>
                    </form>

                    <div className="header-actions">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/room/create')}
                        >
                            Thêm
                        </Button>
                    </div>
                </HeaderRowFilter>



                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{
                        minWidth: 1200,
                    }}>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell align="left"><strong>TT phòng</strong></TableCell>
                                <TableCell sx={{ minWidth: "240px" }}><strong>Địa chỉ nhà</strong></TableCell>
                                <TableCell><strong>Người đăng</strong></TableCell>
                                <TableCell><strong>Chủ nhà</strong></TableCell>
                                <TableCell><strong>Nguồn CTV</strong></TableCell>
                                <TableCell><strong>TT nhà</strong></TableCell>
                                <TableCell sx={{ minWidth: "240px" }}><strong>Hoa hồng</strong></TableCell>
                                <TableCell><strong>Mã phòng</strong></TableCell>
                                <TableCell sx={{ minWidth: "200px" }}><strong>Loại phòng</strong></TableCell>
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
                                        <TableCell>{r.ctv_collaborator?.user?.phone} - {r.ctv_collaborator?.user?.name}</TableCell>
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
                                                placement="top"
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
                                            <Tooltip title="Thêm lịch xem" placement="top">
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
                                                sx={{ margin: "0px 5px" }}
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
