'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteTopic from '@/hooks/Topic/useDeleteTopic';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { TopicType, TopicTypeOptions } from '@/utils/const';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

type Topic = {
    id: string;
    name: string;
    type: TopicType;
    description: string;
};

export default function TopicsPage() {
    const router = useRouter();
    const { fetchTopics } = useGetTopics();
    const { deleteTopic } = useDeleteTopic();

    const [topics, setTopics] = useState<Topic[]>([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);

    const getTopics = async () => {
        setLoading(true);
        try {
            const res = await fetchTopics({
                type: typeFilter,
                keySearch: search,
                page: page,
                size: 10,
            });

            if (res?.success) {
                setTopics(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setTopics([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTopics();
    }, [typeFilter, search, page]);


    const handleDelete = async () => {
        if (!topicToDelete) return;
        try {
            const res = await deleteTopic(topicToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setTopicToDelete(null);
                getTopics();
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
            <TitleMain>Danh sách chủ đề</TitleMain>
            <CardItem >
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/topics/topic-priority-page')} sx={{ mr: "30px" }}>
                        + Cài đặt ưu tiên
                    </Button>
                    <Button variant="contained" onClick={() => router.push('/data/topics/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Tìm chủ đề"
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
                        <MenuItem value="">Tất cả loại</MenuItem>
                        {Object.entries(TopicTypeOptions).map(([key, label]) => (
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
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Loại chủ đề</strong></TableCell>
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
                            ) : topics.length > 0 ? (
                                topics.map((topic) => (
                                    <TableRow key={topic.id} hover sx={{ height: 36 }}>
                                        <TableCell sx={{ py: 0.5, fontSize: '0.875rem' }}>{topic.name}</TableCell>
                                        <TableCell sx={{ py: 0.5, fontSize: '0.875rem' }}>
                                            {TopicTypeOptions[topic.type]}
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 0.5, minWidth: "150px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/data/topics/${topic.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setTopicToDelete(topic);
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
                                        Không tìm thấy chủ đề nào.
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
                    description={`Bạn có chắc chắn muốn xoá chủ đề "${topicToDelete?.name}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>

    );
}
