'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Collaborator } from '@/common/type';
import {
    CollaboratorTypeLabels,
    FieldCooperationLabels,
} from '@/common/const';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useDeleteCollaborator from '@/hooks/Collaborator/useDeleteCollaborator';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function CollaboratorsPage() {
    const router = useRouter();
    const { getCollaborators } = useGetCollaborators();
    const { deleteCollaborator, loading: deleting } = useDeleteCollaborator();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);

    const [data, setData] = useState<Collaborator[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // ================= FETCH =================
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCollaborators({
                keySearch: search,
                page,
                size: 10,
            });

            if (res?.success) {
                setData(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setData([]);
                setTotalPages(1);
            }
        } catch {
            toast.error('Không thể tải danh sách chủ nhà / môi giới');
        } finally {
            setLoading(false);
        }
    }, [getCollaborators, search, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!collaboratorToDelete?.id) return;

        try {
            const res = await deleteCollaborator(collaboratorToDelete.id);
            if (res?.success) {
                toast.success('Xoá thành công');
                setOpenConfirm(false);
                setCollaboratorToDelete(null);
                fetchData(); // load lại danh sách
            } else {
                toast.error(res?.message || 'Xoá thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };


    // ================= RENDER =================
    return (
        <>
            <TitleMain>Danh sách Chủ nhà - Môi giới</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/collaborator/create')}
                    >
                        + Thêm mới
                    </Button>
                </HeaderRow>

                {/* SEARCH */}
                <Box mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm theo tên / SĐT"
                        value={search}
                        onChange={(e) => {
                            setPage(0);
                            setSearch(e.target.value);
                        }}
                        sx={{ width: 500 }}
                    />
                </Box>

                {/* TABLE */}
                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>SĐT</strong></TableCell>
                                <TableCell><strong>Loại</strong></TableCell>
                                <TableCell><strong>Lĩnh vực</strong></TableCell>
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
                            ) : data.length ? (
                                data.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.user.name}</TableCell>
                                        <TableCell>{item.user.phone}</TableCell>
                                        <TableCell>
                                            {CollaboratorTypeLabels[item.type]}
                                        </TableCell>
                                        <TableCell>
                                            {FieldCooperationLabels[item.field_cooperation]}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip
                                                title={item.active ? 'Đang hoạt động' : 'Đã khoá'}
                                            >
                                                {item.active ? (
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
                                                    router.push(`/collaborator/${item.id}`)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/collaborator/${item.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={deleting}
                                                onClick={() => {
                                                    setCollaboratorToDelete(item);
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

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={(_, value) => setPage(value - 1)}
                        />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    title="Xác nhận xoá"
                    description="Bạn có chắc chắn muốn xoá chủ nhà / môi giới này? Hành động này không thể hoàn tác."
                />

            </CardItem>
        </>
    );
}
