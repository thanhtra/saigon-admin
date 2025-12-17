'use client';

import useGetAffiliateCategories from '@/hooks/AffiliateCategory/useGetAffiliateCategories';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import {
    Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    TextField, Pagination,
    Button,
    Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TopicAffiliateCategoryListPage() {
    const router = useRouter();
    const { fetchAffiliateCategories } = useGetAffiliateCategories();
    const { fetchTopics } = useGetTopics();

    const [affiliateCategories, setAffiliateCategories] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const resCat = await fetchAffiliateCategories({ isPagin: false });

            const resTop = await fetchTopics({
                page,
                size: pageSize,
                keySearch: search,  // Truyền search vào API
            });

            if (resCat?.success) setAffiliateCategories(resCat.result.data);
            console.log('dasfd', resTop)
            if (resTop?.success) {
                setTopics(resTop.result.data);
                setTotal(resTop.result.meta.count);  // Lấy tổng số kết quả từ API
            }

            setLoading(false);
        };

        fetchData();
    }, [search, page]);  // Chạy lại khi có thay đổi trong search hoặc page

    // Tìm các danh mục liên quan đến topic
    const getCategoriesForTopic = (topicId: string) => {
        return affiliateCategories.filter((cat) =>
            cat.topics?.some((t: any) => t.id === topicId)
        );
    };

    return (
        <>
            <TitleMain>Chủ đề và các danh mục liên quan</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/data/affiliate-category-topic/create')}>
                        + Thiết lập
                    </Button>
                </HeaderRow>

                <Box my={2} display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        label="Tìm kiếm chủ đề"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);  // Reset trang khi tìm kiếm
                        }}
                        fullWidth
                        sx={{ width: "50%" }}
                    />
                </Box>

                <Paper>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Chủ đề video</strong></TableCell>
                                <TableCell><strong>Danh mục sản phẩm</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : topics.length > 0 ? (
                                topics.map((topic) => {
                                    const relatedCategories = getCategoriesForTopic(topic.id);
                                    return (
                                        <TableRow key={topic.id}>
                                            <TableCell sx={{ width: "40%" }}>{topic.name}</TableCell>
                                            <TableCell sx={{ padding: '0px 0px' }} >
                                                {
                                                    relatedCategories.length > 0 ? (
                                                        relatedCategories.map((cat) => (
                                                            <Chip
                                                                key={cat.id}
                                                                label={cat.name}
                                                                sx={{
                                                                    margin: '0px 4px',  // Giảm khoảng cách giữa các Chip
                                                                    height: '30px',      // Giảm chiều cao của Chip
                                                                    fontSize: '12px',    // Giảm kích thước chữ trong Chip
                                                                    padding: '2px 8px',  // Giảm padding bên trong Chip
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        '-'
                                                    )
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>


                </Paper>
                <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Pagination
                        count={Math.ceil(total / pageSize)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            </CardItem >
        </>
    );
}
