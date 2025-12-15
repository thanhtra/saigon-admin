'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import useDeleteAppFacebook from '@/hooks/AppFacebook/useDeleteAppFacebook';
import useGetAccountFacebooks from '@/hooks/AccountFacebook/useGetAccountFacebooks';
import useGetAppFacebooks from '@/hooks/AppFacebook/useGetAppFacebooks';
import { CardItem, HeaderRow, TextOver, TitleMain } from '@/styles/common';
import { AccountFacebook, AppFacebook } from '@/utils/type';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  TextField,
  Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function AppFacebookPage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppFacebook[]>([]);
  const [accFacebooks, setAccFacebooks] = useState<AccountFacebook[]>([]);
  const [keySearch, setKeySearch] = useState('');
  const [facebookToDelete, setFacebookToDelete] = useState<AppFacebook | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { getAppFacebooks } = useGetAppFacebooks();
  const { fetchAccountFacebooks } = useGetAccountFacebooks();
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { deleteAppFacebook } = useDeleteAppFacebook();
  const [page, setPage] = useState(1);
  const [accFilter, setAccFilter] = useState<string>("");


  useEffect(() => {
    getAccountFs();
  }, []);

  useEffect(() => {
    fetchData();
  }, [keySearch, page, accFilter]);


  const getAccountFs = async () => {
    const resAcc = await fetchAccountFacebooks({ isPagin: false });
    if (resAcc?.success) {
      setAccFacebooks(resAcc.result.data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppFacebooks({
        keySearch,
        page,
        size: 10,
      });

      if (response.success) {
        setApps(response.result.data);
        setTotalPages(response.result.meta.pageCount);
      } else {
        setApps([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching:', error);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleDelete = async () => {
    if (!facebookToDelete?.id) return;
    try {
      const res = await deleteAppFacebook(facebookToDelete.id);
      if (res?.success) {
        setOpenConfirm(false);
        setFacebookToDelete(null);
        fetchData();
      } else {
        toast.error('Xoá thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi xoá');
    }
  };

  return (
    <>
      <TitleMain>Danh sách app developer facebook</TitleMain>
      <CardItem>
        <HeaderRow>
          <Button variant="contained" onClick={() => router.push('/facebook/app/create')}>
            + Thêm mới
          </Button>
        </HeaderRow>

        <Box display="flex" gap={2} mb={2}>
          <Select
            size="small"
            displayEmpty
            value={accFilter}
            onChange={(e) => setAccFilter(e.target.value)}
            sx={{ width: 250 }}
          >
            <MenuItem value="">Tên Facebook</MenuItem>
            {accFacebooks.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            size="small"
            label="Tìm kiếm app"
            value={keySearch}
            onChange={(e) => setKeySearch(e.target.value)}
            sx={{ minWidth: 400 }}
          />

          <Button variant="contained" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Box>

        {/* Table */}
        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Tài khoản Facebook</strong></TableCell>
                <TableCell><strong>Gmail</strong></TableCell>
                <TableCell><strong>Tên App Facebook</strong></TableCell>
                <TableCell><strong>Client Id</strong></TableCell>
                <TableCell><strong>Client Secret</strong></TableCell>
                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
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
              ) : apps.length > 0 ? (
                apps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <a
                        href={`https://www.facebook.com/profile.php?id=${app?.account?.facebook_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        {app?.account?.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      {app?.account?.gmail}
                    </TableCell>
                    <TableCell>
                      {app.app_name}
                    </TableCell>
                    <TableCell>
                      <TextOver
                        title={app.client_id}
                      >
                        {app.client_id.length > 10
                          ? app.client_id.slice(0, 10) + '...'
                          : app.client_id}
                      </TextOver>
                    </TableCell>
                    <TableCell>
                      <TextOver
                        title={app.client_secret}
                      >
                        {app.client_secret.length > 10
                          ? app.client_secret.slice(0, 10) + '...'
                          : app.client_secret}
                      </TextOver>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={app.active ? 'Đang hoạt động' : 'Không hoạt động'}>
                        {app.active ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <CancelIcon color="error" fontSize="small" />
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => router.push(`/facebook/app/${app.id}/edit`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setFacebookToDelete(app);
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
          description={`Bạn có chắc chắn muốn xoá tài khoản facebook "${facebookToDelete?.id}" không? Hành động này không thể hoàn tác.`}
        />
      </CardItem>
    </>
  );
}
