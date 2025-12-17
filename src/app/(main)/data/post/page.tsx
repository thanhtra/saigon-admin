'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useGetPosts from '@/hooks/Post/useGetPosts';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Collaborator, Topic } from '@/utils/type';
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
import { Post } from './create/page';
import { TopicType, TopicTypeOptions } from '@/utils/const';
import useDeletePost from '@/hooks/Post/useDeletePost';


export default function PostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [socialFilter, setSocialFilter] = useState('');
    const [dataToDelete, setDataToDelete] = useState<Post | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { getPosts } = useGetPosts();
    const { deletePost } = useDeletePost();
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const { fetchTopics } = useGetTopics();
    const { getCollaborators } = useGetCollaborators();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

    const [topicFilter, setTopicFilter] = useState('');
    const [collaFilter, setCollaFilter] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const [resTop, resColla] = await Promise.all([
                fetchTopics({ isPagin: false }),
                getCollaborators({ isPagin: false })
            ]);

            if (resTop?.success) setTopics(resTop.result.data);
            if (resColla) setCollaborators(resColla.result.data);
        };
        fetchData();
    }, []);


    useEffect(() => {
        fetchData();
    }, [keySearch, page, socialFilter, topicFilter, collaFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getPosts({
                keySearch,
                social: socialFilter,
                page: page,
                size: 10,
                topic_id: topicFilter,
                collaborator_id: collaFilter
            });

            if (res?.success) {
                setPosts(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            } else {
                setPosts([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!dataToDelete?.id) return;

        try {
            const res = await deletePost(dataToDelete.id);
            if (res?.success) {
                setOpenConfirm(false);
                setDataToDelete(null);
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
            <TitleMain>Danh sách bài đăng</TitleMain>
            <CardItem>
                <HeaderRow>

                    <Button variant="contained" onClick={() => router.push('/data/post/create-s-house')} sx={{ marginRight: "20px" }}>
                        + Thêm S-House
                    </Button>

                    <Button variant="contained" onClick={() => router.push('/data/post/create-unica')} sx={{ marginRight: "20px" }}>
                        + Thêm Unica
                    </Button>

                    <Button variant="contained" onClick={() => router.push('/data/post/create')} sx={{ marginRight: "20px" }}>
                        + Thêm hàng loạt
                    </Button>

                    <Button variant="contained" onClick={() => router.push('/data/post/create-handcrafted')} sx={{ marginRight: "20px" }}>
                        + Thêm thủ công
                    </Button>

                    <Button variant="contained" onClick={() => router.push('/data/post/get-next-post')}>
                        + Lấy bài đăng
                    </Button>

                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ width: 400 }}
                    />

                    <Select
                        size="small"
                        value={socialFilter}
                        onChange={(e) => {
                            setSocialFilter(e.target.value);
                            setTopicFilter('');
                        }}
                        displayEmpty
                        sx={{ width: 400 }}
                    >
                        <MenuItem value="">Tất cả nền tảng</MenuItem>
                        {
                            ...Object.entries(TopicTypeOptions).map(([value, label]) => (<MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>))
                        }
                    </Select>

                </Box>
                <Box display="flex" gap={2} mb={2}>

                    <Select
                        size="small"
                        value={topicFilter}
                        onChange={(e) => setTopicFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 400 }}
                    >
                        <MenuItem value="">Tất cả chủ đề</MenuItem>
                        {
                            ...topics.map((item) => (<MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>))
                        }
                    </Select>
                    <Select
                        size="small"
                        value={collaFilter}
                        onChange={(e) => setCollaFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 400 }}
                    >
                        <MenuItem value="">Tất cả cộng tác</MenuItem>
                        {
                            ...collaborators.map((item) => (<MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>))
                        }
                    </Select>

                    <Button variant="contained" onClick={fetchData}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow >
                                <TableCell><strong>Hợp tác với</strong></TableCell>
                                <TableCell><strong>Số điện thoại</strong></TableCell>
                                <TableCell><strong>Tiêu đề</strong></TableCell>
                                <TableCell><strong>Nội dung</strong></TableCell>
                                <TableCell><strong>Footer</strong></TableCell>
                                <TableCell><strong>Nền tảng</strong></TableCell>
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
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <TableRow key={post.id} sx={{ height: 36 }}>
                                        <TableCell>{post?.["collaborator"]?.["name"]}</TableCell>
                                        <TableCell>{post?.["collaborator"]?.["phone"]}</TableCell>
                                        <TableCell>
                                            <Box
                                                title={post.title}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(post.title || "")}
                                            >
                                                {post?.title && post.title.length > 20
                                                    ? post.title.slice(0, 20) + '...'
                                                    : post.title}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                title={post.description}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(post.description || "")}
                                            >
                                                {post?.description && post.description.length > 30
                                                    ? post.description.slice(0, 30) + '...'
                                                    : post.description}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                title={post.footer}
                                                sx={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => navigator.clipboard.writeText(post.footer || "")}
                                            >
                                                {post?.footer && post.footer.length > 20
                                                    ? post.footer.slice(0, 20) + '...'
                                                    : post.footer}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{TopicTypeOptions[post.social as TopicType] || '—'}</TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setDataToDelete(post);
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
                                        Không tìm thấy dữ liệu
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
                    description={`Bạn có chắc chắn muốn xoá "${dataToDelete?.title}" không? Hành động này không thể hoàn tác.`}
                />
            </CardItem >
        </>
    );
}
