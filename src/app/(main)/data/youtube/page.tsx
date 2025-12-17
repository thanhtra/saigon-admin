'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import useDeleteYoutube from '@/hooks/Youtube/useDeleteYoutube';
import useGetYoutubes from '@/hooks/Youtube/useGetYoutubes';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from "@mui/icons-material/Update";
import {
    Box, Button, CircularProgress, IconButton, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function YoutubePage() {
    const router = useRouter();
    const [youtubes, setYoutubes] = useState<any[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [topicIdFilter, setTopicIdFilter] = useState('');
    const [pageYoutubeToDelete, setPageYoutubeToDelete] = useState<any | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);
    const { fetchYoutubes } = useGetYoutubes();
    const { deleteYoutube } = useDeleteYoutube();
    const { fetchTopics } = useGetTopics();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchInitialData = async () => {
            const res = await fetchTopics({ isPagin: false });
            if (res?.success) {
                setTopics(res.result.data);
                fetchData();
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [keySearch, topicIdFilter, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchYoutubes({ keySearch, topic_id: topicIdFilter, page, size: 10 });
            if (res?.success) {
                setYoutubes(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setYoutubes([]);
                setTotalPages(1);
            }
        } catch (err) {
            setYoutubes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pageYoutubeToDelete) return;
        try {
            const res = await deleteYoutube(pageYoutubeToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPageYoutubeToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    const updateToken = (yt: any) => {
        const clientId = yt?.client_id;
        if (!clientId) {
            toast.error("Vui lòng nhập client_id trước khi kết nối Google");
            return;
        }

        if (!yt?.id) {
            toast.error("Không có thông tin ID tài khoản Youtube");
            return;
        }

        const scope = encodeURIComponent(
            'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl'
        );
        const state = encodeURIComponent(JSON.stringify({ youtubeid: yt.id }));
        const redirectUri = 'http://localhost:3002/data/youtube/oauth2callback';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

        window.location.href = authUrl;
    };


    return (
        <>
            <TitleMain>Danh sách Youtube</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/youtube/create')}>+ Thêm mới</Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm Youtube"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ minWidth: 400 }}
                    />

                    <Select
                        size="small"
                        value={topicIdFilter}
                        onChange={(e) => setTopicIdFilter(e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">Tất cả chủ đề</MenuItem>
                        {topics.map((topic: any) => (
                            <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={() => { setPage(1); fetchData(); }}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tên</strong></TableCell>
                                <TableCell><strong>Gmail</strong></TableCell>
                                <TableCell><strong>ID Kênh</strong></TableCell>
                                <TableCell align="center"><strong>Client ID</strong></TableCell>
                                <TableCell align="center"><strong>Client Secret</strong></TableCell>
                                <TableCell align="center"><strong>Access Token</strong></TableCell>
                                <TableCell align="center"><strong>Refresh Token</strong></TableCell>
                                <TableCell><strong>Chủ đề</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Cập nhật token</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : youtubes.length > 0 ? (
                                youtubes.map((yt) => (
                                    <TableRow key={yt.id}>
                                        <TableCell>{yt.name}</TableCell>
                                        <TableCell>{yt.gmail}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://www.youtube.com/${yt.youtube_channel_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {yt.youtube_channel_id}
                                            </a>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={yt.client_id ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {yt.client_id ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={yt.client_secret ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {yt.client_secret ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={yt.access_token ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {yt.access_token ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={yt.refresh_token ? 'Đã cập nhật' : 'Chưa cập nhật'}>
                                                {yt.refresh_token ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{topics.find(t => t.id === yt.topic_id)?.name || '—'}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={yt.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                                                {yt.active ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <UpdateIcon onClick={() => updateToken(yt)} sx={{ cursor: "pointer", color: "blue" }} />
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: "100px" }}>
                                            <IconButton size="small" onClick={() => router.push(`/data/youtube/${yt.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => { setPageYoutubeToDelete(yt); setOpenConfirm(true); }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không tìm thấy dữ liệu</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {!loading && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
                    </Box>
                )}

                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleDelete}
                    title="Xác nhận xoá"
                    description={`Bạn có chắc chắn muốn xoá Youtube \"${pageYoutubeToDelete?.name}\" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem>
        </>
    );
}
