'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useDeleteFacebookPage from '@/hooks/FacebookPage/useDeleteFacebookPage';
import useGetFacebookPages from '@/hooks/FacebookPage/useGetFacebookPages';
import useUpdateFacebookPage from '@/hooks/FacebookPage/useUpdateFacebookPage';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { Status, StatusName } from '@/utils/const';
import { AccountFacebook } from '@/utils/type';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button,
    CircularProgress,
    FormControlLabel,
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
import { toast } from 'react-toastify';


type FacebookPage = {
    id: string;
    page_id: string;
    page_name: string;
    page_access_token: string;
    topic_id: string;
    facebook_id: string;
    active: boolean;
    token_updated_at?: string;
};

export default function FacebookPagesPage() {
    const router = useRouter();
    const [pages, setPages] = useState<FacebookPage[]>([]);
    const [keySearch, setKeySearch] = useState('');
    const [facebookIdFilter, setFacebookIdFilter] = useState('');
    const [topicIdFilter, setTopicIdFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [pageSelected, setPageSelected] = useState<FacebookPage | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmStatus, setOpenConfirmStatus] = useState(false);
    const { fetchTopics } = useGetTopics();
    const { fetchAccountFacebooks } = useGetAccountFacebooks();
    const [topics, setTopics] = useState([]);
    const { fetchFacebookPages } = useGetFacebookPages();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { deleteFacebookPage } = useDeleteFacebookPage();
    const [page, setPage] = useState(1);
    const [accountFacebooks, setAccountFacebooks] = useState<AccountFacebook[]>([]);
    const [statusUpdate, setStatusUpdate] = useState<boolean | null>(null);
    const { updateFacebookPage } = useUpdateFacebookPage();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [resAcc, resTopic] = await Promise.all([
                    fetchAccountFacebooks({ isPagin: false }),
                    fetchTopics({ isPagin: false })
                ]);

                if (resAcc?.success && resTopic?.success) {
                    setAccountFacebooks(resAcc.result.data);
                    setTopics(resTopic.result.data);
                    fetchDataPagebookPages();
                }

            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchDataPagebookPages();
    }, [keySearch, topicIdFilter, facebookIdFilter, page, statusFilter]);

    const fetchDataPagebookPages = async () => {
        setLoading(true);
        try {
            const params: GetFacebookPagesParams = {
                keySearch,
                topic_id: topicIdFilter,
                facebook_id: facebookIdFilter,
                page,
                size: 10,
            }
            if (statusFilter !== "") {
                params["active"] = statusFilter === StatusName.active ? true : false
            }
            const response = await fetchFacebookPages(params);

            if (response.success) {
                setPages(response.result.data);
                setTotalPages(response.result.meta.pageCount);
            } else {
                setPages([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            setPages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchDataPagebookPages();
    };

    const handleDelete = async () => {
        if (!pageSelected) return;
        try {
            const res = await deleteFacebookPage(pageSelected.id);
            if (res?.success) {
                setOpenConfirm(false);
                setPageSelected(null);
                fetchDataPagebookPages();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi xoá');
        }
    };

    const calculateDaysLeft = (updatedAt?: string) => {
        if (!updatedAt) return '—';
        const updatedDate = new Date(updatedAt);
        const expiryDate = new Date(updatedDate.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 ngày
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} ngày` : 'Đã hết hạn';
    };

    const updatePageStatus = (checked: boolean, page: FacebookPage) => {
        setStatusUpdate(checked);
        setPageSelected(page);
        setOpenConfirmStatus(true);
    };

    const handleUpdatePageStatus = async () => {
        if (!pageSelected || statusUpdate === null) return;
        try {
            const res = await updateFacebookPage(pageSelected.id, { active: statusUpdate });
            if (res?.success) {
                setOpenConfirmStatus(false);
                setPageSelected(null);
                fetchDataPagebookPages();
                toast.success('Cập nhật thành công');
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (err) {
            setPageSelected(null);
            console.error(err);
            toast.error('Có lỗi xảy ra');
        }
    };


    return (
        <>
            <TitleMain>Danh sách Fanpage Facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/facebook/page-facebook/token')} sx={{ marginRight: "30px", background: "green" }}>
                        + Cập nhật token
                    </Button>
                    <Button variant="contained" onClick={() => router.push('/facebook/page-facebook/create')}>
                        + Thêm mới
                    </Button>
                </HeaderRow>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        size="small"
                        label="Tìm kiếm fanpage"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        sx={{ width: 300 }}
                    />

                    <Select
                        size="small"
                        value={facebookIdFilter}
                        onChange={(e) => setFacebookIdFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="">Tất cả Facebook ID</MenuItem>
                        {accountFacebooks.map((account) => (
                            <MenuItem key={account.facebook_id} value={account.facebook_id}>
                                {account.name} ({account.gmail})
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        size="small"
                        value={topicIdFilter}
                        onChange={(e) => setTopicIdFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="">Tất cả chủ đề</MenuItem>
                        {topics.map((topic: any) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="">Tất cả trạng thái</MenuItem>
                        {Status.map((s: any) => (
                            <MenuItem key={s.value} value={s.value}>
                                {s.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tên fanpage</strong></TableCell>
                                <TableCell><strong>Token còn hạn</strong></TableCell>
                                <TableCell><strong>Page ID</strong></TableCell>
                                <TableCell><strong>Facebook quản lý</strong></TableCell>
                                <TableCell><strong>Chủ đề video</strong></TableCell>
                                <TableCell><strong>Trạng thái</strong></TableCell>
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
                            ) : pages.length > 0 && topics.length > 0 ? (
                                pages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell>{page.page_name}</TableCell>
                                        <TableCell>
                                            {calculateDaysLeft(page.token_updated_at)}
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://www.facebook.com/profile.php?id=${page.page_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                {page.page_id}
                                            </a>
                                        </TableCell>
                                        <TableCell>{accountFacebooks.find((f: any) => f.facebook_id === page.facebook_id)?.name}</TableCell>
                                        <TableCell>
                                            {
                                                topics.find((t: any) => t.id === page.topic_id)?.name || '—'
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControlLabel
                                                control={
                                                    <IOSSwitch
                                                        checked={page.active}
                                                        onChange={(e) => updatePageStatus(e.target.checked, page)}
                                                        name="iosSwitch"
                                                    />
                                                }
                                                label=""
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => router.push(`/facebook/page-facebook/${page.id}/edit`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setPageSelected(page);
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
                    description={`Bạn có chắc chắn muốn xoá fanpage facebook "${pageSelected?.page_name}" không? Hành động này không thể hoàn tác.`}
                />

                <ConfirmDialog
                    open={openConfirmStatus}
                    onClose={() => setOpenConfirmStatus(false)}
                    onConfirm={handleUpdatePageStatus}
                    title="Cập nhật trạng thái"
                    description={`Bạn có chắc chắn muốn cập nhật trạng thái "${pageSelected?.page_name}" không?`}
                    confirmText="Đồng ý"
                />
            </CardItem>
        </>
    );
}
