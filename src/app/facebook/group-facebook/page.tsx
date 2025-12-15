'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteGroupFacebook from '@/hooks/GroupFacebook/useDeleteGroupFacebook';
import useGetGroupFacebooks from '@/hooks/GroupFacebook/useGetGroupFacebooks';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { TopicType } from '@/utils/const';
import { GroupFacebook, Topic } from '@/utils/type';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box, Button,
    CircularProgress,
    IconButton,
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

export default function GroupFacebooksPage() {
    const router = useRouter();
    const { getGroupFacebooks } = useGetGroupFacebooks();
    const { deleteGroupFacebook } = useDeleteGroupFacebook();

    const [topics, setTopics] = useState<Topic[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<GroupFacebook | null>(null);
    const { fetchTopics } = useGetTopics();
    const [topicIdFilter, setTopicIdFilter] = useState('');
    const [groupFacebooks, setGroupFacebooks] = useState<GroupFacebook[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetchTopics({ isPagin: false, type: TopicType.Facebook });
                if (res?.success) {
                    setTopics(res.result.data);
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        handleGetGroupFacebooks();
    }, [topicIdFilter, search, page]);

    const handleGetGroupFacebooks = async () => {
        setLoading(true);
        try {
            const res = await getGroupFacebooks({
                topic_id: topicIdFilter,
                keySearch: search,
                page: page,
                size: 10,
            });

            if (res?.success) {
                setGroupFacebooks(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setGroupFacebooks([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            setGroupFacebooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!groupToDelete?.id) return;
        try {
            const res = await deleteGroupFacebook(groupToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setGroupToDelete(null);
                handleGetGroupFacebooks();
            } else {
                alert('Xoá thất bại');
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách nhóm facebook</TitleMain>
            <CardItem >
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/facebook/group-facebook/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tìm kiếm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />

                    <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        value={topicIdFilter}
                        onChange={(e) => setTopicIdFilter(e.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">Tất cả chủ đề</MenuItem>
                        {topics.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Tên nhóm</strong></TableCell>
                                <TableCell><strong>ID nhóm</strong></TableCell>
                                <TableCell><strong>Chủ đề</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : groupFacebooks.length > 0 ? (
                                groupFacebooks.map((gf) => (
                                    <TableRow key={gf.id} hover sx={{ height: 36 }}>
                                        <TableCell>
                                            {gf.name}
                                        </TableCell>
                                        <TableCell>
                                            {gf.group_id ? (
                                                <a
                                                    href={`https://www.facebook.com/groups/${gf.group_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    {gf.group_id}
                                                </a>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell>{topics.find((t) => t.id === gf.topic_id)?.name || '—'}</TableCell>
                                        <TableCell align="center" sx={{ py: 0.5, minWidth: "150px" }}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setGroupToDelete(gf);
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
                                        Không có dữ liệu
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
                    description={`Chắc chắn muốn xoá nhóm "${groupToDelete?.name}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>

    );
}
