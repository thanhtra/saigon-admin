'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
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
import { toast } from 'react-toastify';

import { RoomStatusLabels } from '@/common/const';
import { RoomStatus } from '@/common/enum';
import useDeleteRoom from '@/hooks/Room/useDeleteRoom';
import useGetRooms from '@/hooks/Room/useGetRentals';
import { formatArea, formatVnd, truncate } from '@/common/service';

export default function RoomPage() {
    const router = useRouter();
    const { getRooms } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();

    const [rooms, setRooms] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<any | null>(null);

    /* ================= FETCH ================= */
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRooms({
                key_search: keySearch,
                page,
                size: 10,
            });

            if (res?.success) {
                setRooms(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setRooms([]);
                setTotalPages(1);
            }
        } catch {
            toast.error('Không thể tải danh sách phòng');
        } finally {
            setLoading(false);
        }
    }, [getRooms, keySearch, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ================= DELETE ================= */
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
                toast.error(res?.message || 'Xoá thất bại');
            }
        } catch {
            toast.error('Có lỗi khi xoá phòng');
        }
    };

    return (
        <>
            <TitleMain>Danh sách phòng</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/room/create')}
                    >
                        + Thêm phòng
                    </Button>
                </HeaderRow>

                <Box mb={2}>
                    <TextField
                        size="small"
                        label="Tìm theo mã phòng / tên nhà"
                        value={keySearch}
                        onChange={(e) => {
                            setPage(1);
                            setKeySearch(e.target.value);
                        }}
                        sx={{ minWidth: 400 }}
                    />
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Mã phòng</strong></TableCell>
                                <TableCell><strong>Nhà</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
                                <TableCell><strong>Diện tích</strong></TableCell>
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
                            ) : rooms.length ? (
                                rooms.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.room_code}</TableCell>
                                        <TableCell>{truncate(r.title, 40)}</TableCell>
                                        <TableCell>
                                            {formatVnd(r.price)}
                                        </TableCell>
                                        <TableCell>
                                            {formatArea(r.area)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={RoomStatusLabels[r.status as RoomStatus]}>
                                                <span>
                                                    {RoomStatusLabels[r.status as RoomStatus]}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
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
                    title="Xác nhận xoá phòng"
                    description={`Bạn có chắc muốn xoá phòng "${roomToDelete?.room_code}" không?`}
                />
            </CardItem>
        </>
    );
}
