'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteCollaborator from '@/hooks/Collaborator/useDeleteCollaborator';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Profession, ProfessionOptions } from '@/utils/const';
import { Collaborator } from '@/utils/type';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    Link,
    MenuItem, Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function CollaboratorsPage() {
    const router = useRouter();
    const { getCollaborators } = useGetCollaborators();
    const { deleteCollaborator } = useDeleteCollaborator();

    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);

    const getCollaboratorsHandle = async () => {
        setLoading(true);
        try {
            const res = await getCollaborators({
                profession: typeFilter,
                keySearch: search,
                page: page,
                size: 10,
            });

            if (res?.success) {
                setCollaborators(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setCollaborators([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            setCollaborators([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCollaboratorsHandle();
    }, [typeFilter, search, page]);


    const handleDelete = async () => {
        if (!collaboratorToDelete?.id) return;
        setLoading(true);

        try {
            const res = await deleteCollaborator(collaboratorToDelete.id);

            if (res?.success) {
                setOpenConfirm(false);
                setCollaboratorToDelete(null);
                getCollaboratorsHandle();
            } else {
                alert('Xoá thất bại');
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi xoá');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Danh sách cộng tác viên</TitleMain>
            <CardItem >
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/collaborator/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tìm cộng tác viên"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />

                    <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">Lĩnh vực hợp tác</MenuItem>
                        {Object.entries(ProfessionOptions).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Loại cộng tác viên</strong></TableCell>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Số điện thoại</strong></TableCell>
                                <TableCell><strong>Mô tả</strong></TableCell>
                                <TableCell><strong>Tài liệu</strong></TableCell>
                                <TableCell align="right"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : collaborators.length > 0 ? (
                                collaborators.map((collaborator) => (
                                    <TableRow key={collaborator.id} hover sx={{ height: 36 }}>
                                        <TableCell>
                                            {ProfessionOptions[collaborator.profession as Profession]}
                                        </TableCell>
                                        <TableCell>{collaborator.name}</TableCell>
                                        <TableCell>
                                            {collaborator.phone}
                                        </TableCell>
                                        <TableCell>
                                            {collaborator?.description}
                                        </TableCell>
                                        <TableCell>
                                            {collaborator.link_document ? (
                                                <Link
                                                    href={collaborator.link_document}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Xem tài liệu
                                                </Link>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 0.5, minWidth: "150px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/data/collaborator/${collaborator.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setCollaboratorToDelete(collaborator);
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
                                    <TableCell colSpan={4} align="center">
                                        Không tìm thấy cộng tác viên nào.
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
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá cộng tác viên "${collaboratorToDelete?.name}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>

    );
}
