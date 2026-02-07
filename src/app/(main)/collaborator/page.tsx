'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

import {
    ErrorMessage
} from '@/common/const';
import { CollaboratorType, FieldCooperation } from '@/common/enum';
import ConfirmDialog from '@/components/ConfirmDialog';
import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import CollaboratorTypeDialog from '@/components/common/CollaboratorTypeDialog';
import CollaboratorTypeTag from '@/components/common/CollaboratorTypeTag';
import FieldCooperationDialog from '@/components/common/FieldCooperationDialog';
import FieldCooperationTag from '@/components/common/FieldCooperationTag';
import PaginationWrapper from '@/components/common/PaginationWrapper';
import useDeleteCollaborator from '@/hooks/Collaborator/useDeleteCollaborator';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useUpdateCollaborator from '@/hooks/Collaborator/useUpdateCollaborator';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Collaborator } from '@/types';

export default function CollaboratorsPage() {
    const router = useRouter();
    const { getCollaborators } = useGetCollaborators();
    const { deleteCollaborator, loading: deleting } = useDeleteCollaborator();
    const { updateCollaborator } = useUpdateCollaborator();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);

    const [data, setData] = useState<Collaborator[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [openFieldDialog, setOpenFieldDialog] = useState(false);
    const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
    const [updatingField, setUpdatingField] = useState(false);
    const [openTypeDialog, setOpenTypeDialog] = useState(false);
    const [updatingType, setUpdatingType] = useState(false);


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCollaborators({
                key_search: search,
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
            toast.error(ErrorMessage.SYSTEM);
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
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    const handleUpdateField = async (value: FieldCooperation) => {
        if (!selectedCollaborator?.id) return;

        try {
            setUpdatingField(true);

            const res = await updateCollaborator(
                selectedCollaborator.id,
                {
                    type: selectedCollaborator.type,
                    field_cooperation: value,
                },
            );

            if (!res?.success) {
                toast.error('Cập nhật lĩnh vực thất bại');
                return;
            }

            toast.success('Cập nhật lĩnh vực thành công');
            setOpenFieldDialog(false);
            setSelectedCollaborator(null);
            fetchData();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setUpdatingField(false);
        }
    };


    const handleUpdateType = async (value: CollaboratorType) => {
        if (!selectedCollaborator?.id) return;

        try {
            setUpdatingType(true);

            const res = await updateCollaborator(
                selectedCollaborator.id,
                { type: value },
            );

            if (!res?.success) {
                toast.error('Cập nhật loại thất bại');
                return;
            }

            toast.success('Cập nhật loại thành công');
            setOpenTypeDialog(false);
            setSelectedCollaborator(null);
            fetchData();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setUpdatingType(false);
        }
    };


    return (
        <>
            <TitleMain>Danh sách Chủ nhà - Môi giới</TitleMain>

            <CardItem>
                <HeaderRow>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => router.push('/collaborator/create')}
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
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell align="center"><strong>CTV</strong></TableCell>
                                <TableCell align="left"><strong>Loại</strong></TableCell>
                                <TableCell align="left"><strong>Lĩnh vực</strong></TableCell>
                                <TableCell><strong>Note</strong></TableCell>
                                <TableCell align="center" width={100}><strong>Kích hoạt</strong></TableCell>
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
                                        <TableCell>
                                            <Tooltip title="Sao chép số điện thoại" placement="top">
                                                <span
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(item.user.phone);
                                                        toast.success('Đã sao chép');
                                                    }}
                                                    style={{ cursor: 'pointer', marginRight: 4 }}
                                                >
                                                    {item.user.phone}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{item.user.email}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip
                                                title={item.is_confirmed_ctv ? 'Đã đăng kí' : 'Chưa đăng kí'}
                                                placement="top"
                                            >
                                                {item.is_confirmed_ctv ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <></>
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="left">
                                            <CollaboratorTypeTag
                                                clickable
                                                value={item.type}
                                                onClick={() => {
                                                    setSelectedCollaborator(item);
                                                    setOpenTypeDialog(true);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <FieldCooperationTag
                                                clickable
                                                value={item.field_cooperation}
                                                onClick={() => {
                                                    setSelectedCollaborator(item);
                                                    setOpenFieldDialog(true);
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>{TruncateWithTooltip({ text: (item?.note || "") + ' - ' + (item?.user?.note || "") })}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip
                                                title={item.active ? 'Đang hoạt động' : 'Đã khoá'}
                                                placement="top"
                                            >
                                                {item.active ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CancelIcon color="error" fontSize="small" />
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center" width={150}>
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
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá ${collaboratorToDelete?.user?.name} - ${collaboratorToDelete?.user?.phone}? Hành động này không thể hoàn tác.`}
                />

                <FieldCooperationDialog
                    open={openFieldDialog}
                    loading={updatingField}
                    currentValue={selectedCollaborator?.field_cooperation || null}
                    onClose={() => {
                        setOpenFieldDialog(false);
                        setSelectedCollaborator(null);
                    }}
                    onConfirm={handleUpdateField}
                />

                <CollaboratorTypeDialog
                    open={openTypeDialog}
                    loading={updatingType}
                    currentValue={selectedCollaborator?.type || null}
                    onClose={() => {
                        setOpenTypeDialog(false);
                        setSelectedCollaborator(null);
                    }}
                    onConfirm={handleUpdateType}
                />

            </CardItem >
        </>
    );
}
