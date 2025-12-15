'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteTiktokVideo from '@/hooks/TiktokVideo/useDeleteTiktokVideo';
import useGetTiktokVideos from '@/hooks/TiktokVideo/useGetTiktokVideos';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { TopicType } from '@/utils/const';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box, Button,
    CircularProgress,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    TextField
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type TiktokVideo = {
    id: string;
    video_link: string;
    video_title: string;
    topic_id: string;
    facebook_page_posted_id?: string;
    facebook_page_posted_time?: string;
};

export default function TiktokVideosPage() {
    const router = useRouter();
    const [videos, setVideos] = useState<TiktokVideo[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [topicIdFilter, setTopicIdFilter] = useState('');
    const [videoToDelete, setVideoToDelete] = useState<TiktokVideo | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);
    const { fetchTiktokVideos } = useGetTiktokVideos();
    const { deleteTiktokVideo } = useDeleteTiktokVideo();
    const { fetchTopics } = useGetTopics();
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchInitial = async () => {
            const res = await fetchTopics({ isPagin: false, type: TopicType.Affiliate });
            if (res?.success) setTopics(res.result.data);
            fetchData();
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        fetchData();
    }, [keySearch, topicIdFilter, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchTiktokVideos({
                keySearch,
                topic_id: topicIdFilter,
                page: page,
                size: 10,
            });

            if (res?.success) {
                setVideos(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setVideos([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!videoToDelete) return;
        try {
            const res = await deleteTiktokVideo(videoToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setVideoToDelete(null);
                fetchData();
            } else {
                alert('Xoá thất bại');
            }
        } catch {
            alert('Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <>
            <TitleMain>Danh sách Video TikTok</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/tiktok/video-tiktok/create')}>
                        + Thêm video
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm video"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ width: 400 }}
                    />

                    <Select
                        size="small"
                        value={topicIdFilter}
                        onChange={(e) => setTopicIdFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 400 }}
                    >
                        <MenuItem value="">Tất cả chủ đề</MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={fetchData}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow >
                                <TableCell><strong>Tiêu đề</strong></TableCell>
                                <TableCell><strong>ID Video</strong></TableCell>
                                <TableCell><strong>Chủ đề video</strong></TableCell>
                                <TableCell><strong>Page FB đăng</strong></TableCell>
                                <TableCell><strong>Thời gian đăng page FB</strong></TableCell>
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
                            ) : videos.length > 0 ? (
                                videos.map((video) => (
                                    <TableRow key={video.id} sx={{ height: 36 }}>
                                        <TableCell>
                                            <Box
                                                title={video.video_title}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(video.video_title)}
                                            >
                                                {video.video_title.length > 20
                                                    ? video.video_title.slice(0, 20) + '...'
                                                    : video.video_title}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                title={video.video_link}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                }}
                                                onClick={() => window.open(video.video_link, '_blank', 'noopener,noreferrer')}
                                            >
                                                {video.video_link.length > 10
                                                    ? video.video_link.slice(0, 10) + '...'
                                                    : video.video_link}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{topics.find((t) => t.id === video.topic_id)?.name || '—'}</TableCell>
                                        <TableCell>
                                            {video.facebook_page_posted_id ? (
                                                <a
                                                    href={`https://www.facebook.com/profile.php?id=${video.facebook_page_posted_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    {video.facebook_page_posted_id}
                                                </a>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {video.facebook_page_posted_time
                                                ? new Date(video.facebook_page_posted_time).toLocaleString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setVideoToDelete(video);
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
                                        Không tìm thấy video
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
                    description={`Bạn có chắc chắn muốn xoá video "${videoToDelete?.video_title}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem >
        </>
    );
}
