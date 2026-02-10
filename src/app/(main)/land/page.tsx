'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
    Tooltip,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import PaginationWrapper from '@/components/common/PaginationWrapper';
import ConfirmDialog from '@/components/ConfirmDialog';
import { CardItem, HeaderRowFilter, TitleMain } from '@/styles/common';

import { ErrorMessage, LandTypeLabels } from '@/common/const';
import { LandType } from '@/common/enum';

import { TruncateWithTooltip } from '@/components/TruncateWithTooltip';
import type { Land } from '@/types';

import FormTextField from '@/components/FormTextField';
import useDeleteLand from '@/hooks/Land/useDeleteLand';
import useGetLands from '@/hooks/Land/useGetLands';
import { useForm } from 'react-hook-form';

type LandFilterForm = {
    key_search?: string;
    land_type?: LandType | '';
    active?: boolean | '';
};

export default function LandPage() {
    const router = useRouter();

    const { getLands } = useGetLands();
    const { deleteLand } = useDeleteLand();

    const [lands, setLands] = useState<Land[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [landToDelete, setLandToDelete] = useState<Land | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    const [filters, setFilters] = useState<LandFilterForm>({});

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<LandFilterForm>({
        defaultValues: {
            key_search: '',
            land_type: '',
            active: '',
        },
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const fActive = filters.active === '' || filters.active === undefined
                ? undefined
                : filters.active === true;

            const res = await getLands({
                page,
                size: 10,
                key_search: filters.key_search || undefined,
                land_type: filters.land_type || undefined,
                active: fActive
            });

            if (res?.success) {
                setLands(res.result.data);
                setTotalPages(res.result.meta.pageCount);
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    }, [getLands, filters, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onSearch = (data: LandFilterForm) => {
        setPage(1);
        setFilters({
            key_search: data.key_search || undefined,
            land_type: data.land_type || undefined,
            active: data.active ?? undefined,
        });
    };

    const onReset = () => {
        reset({
            key_search: '',
            land_type: '',
            active: '',
        });
        setPage(1);
        setFilters({});
    };

    const handleDelete = async () => {
        if (!landToDelete?.id) return;

        try {
            const res = await deleteLand(landToDelete.id);
            if (res?.success) {
                toast.success('Xoá bất động sản thành công');
                setOpenConfirm(false);
                setLandToDelete(null);
                fetchData();
            } else {
                toast.error('Xoá thất bại');
            }
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Danh sách bất động sản</TitleMain>

            <CardItem>
                <HeaderRowFilter>
                    <form onSubmit={handleSubmit(onSearch)} className="filter-form">
                        <div className="filter-bar">
                            <div className="filter-inputs">
                                <FormTextField
                                    name="key_search"
                                    control={control}
                                    size="small"
                                    label="Mã / Tiêu đề / Địa chỉ"
                                />

                                <FormTextField
                                    name="land_type"
                                    control={control}
                                    size="small"
                                    label="Loại BĐS"
                                    options={[
                                        { label: 'Tất cả', value: '' },
                                        ...Object.entries(LandTypeLabels).map(
                                            ([value, label]) => ({
                                                value,
                                                label,
                                            }),
                                        ),
                                    ]}
                                />

                                <FormTextField
                                    name="active"
                                    control={control}
                                    size="small"
                                    label="Trạng thái"
                                    options={[
                                        { label: 'Tất cả', value: '' },
                                        { label: 'Đang hiển thị', value: 'true' },
                                        { label: 'Tạm ẩn', value: 'false' },
                                    ]}
                                />
                            </div>

                            <div className="filter-actions">
                                <Button type="submit" variant="contained" size="small">
                                    Tìm kiếm
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={onReset}
                                >
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                    </form>

                    <div className="header-actions">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/land/create')}
                        >
                            Thêm
                        </Button>
                    </div>
                </HeaderRowFilter>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 1200 }}>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Mã BĐS</strong></TableCell>
                                <TableCell><strong>Cộng tác</strong></TableCell>
                                <TableCell sx={{ minWidth: 260 }}>
                                    <strong>Địa chỉ</strong>
                                </TableCell>
                                <TableCell><strong>Loại</strong></TableCell>
                                <TableCell><strong>Diện tích</strong></TableCell>
                                <TableCell sx={{ minWidth: 260 }}>
                                    <strong>Kích thước</strong>
                                </TableCell>

                                <TableCell sx={{ minWidth: "70px" }}><strong>Giá</strong></TableCell>
                                <TableCell align="center">
                                    <strong>Kích hoạt</strong>
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: "100px" }}>
                                    <strong>Hành động</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : lands.length ? (
                                lands.map((l) => (
                                    <TableRow key={l.id} hover>
                                        <TableCell>{l.land_code}</TableCell>

                                        <TableCell>
                                            {l.collaborator?.user?.phone} -{' '}
                                            {l.collaborator?.user?.name}
                                        </TableCell>

                                        <TableCell>
                                            <TruncateWithTooltip
                                                text={l.address_detail_display}
                                                limit={40}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {LandTypeLabels[l.land_type]}
                                        </TableCell>

                                        <TableCell>
                                            {l.area ? `${Number(l.area)} m²` : '--'}
                                        </TableCell>

                                        <TableCell>
                                            {[
                                                l.width_top && `Ngang trên: ${l.width_top}m`,
                                                l.width_bottom &&
                                                `Ngang dưới: ${l.width_bottom}m`,
                                                l.length_left &&
                                                `Dài trái: ${l.length_left}m`,
                                                l.length_right &&
                                                `Dài phải: ${l.length_right}m`,
                                            ]
                                                .filter(Boolean)
                                                .join(' | ') || '--'}
                                        </TableCell>

                                        <TableCell>
                                            {Number(l.price)} tỷ
                                        </TableCell>

                                        <TableCell align="center">
                                            <Tooltip
                                                title={
                                                    l.active
                                                        ? 'Đang hiển thị'
                                                        : 'Tạm ẩn'
                                                }
                                            >
                                                {l.active ? (
                                                    <CheckCircleIcon
                                                        color="success"
                                                        fontSize="small"
                                                    />
                                                ) : (
                                                    <CancelIcon
                                                        color="error"
                                                        fontSize="small"
                                                    />
                                                )}
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    router.push(`/land/${l.id}/edit`)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setLandToDelete(l);
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
                                    <TableCell colSpan={9} align="center">
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
                    title="Xác nhận xoá bất động sản"
                    description={`Bạn có chắc muốn xoá "${landToDelete?.land_code}" không?`}
                />
            </CardItem>
        </>
    );
}
