'use client';

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { BookingStatusAdminLabels, ErrorMessage } from '@/common/const';
import { BookingStatus } from '@/common/enum';
import { Booking } from '@/types/booking';

import { toDatetimeLocal } from '@/common/time.service';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormTextField from '@/components/FormTextField';
import useUpdateBooking from '@/hooks/Booking/useUpdateBooking';
import { formGridStyles } from '@/styles/formGrid';


type Props = {
    open: boolean;
    booking: Booking | null;
    onClose: () => void;
    onSuccess: () => void;
};

type BookingEditForm = {
    customer_name: string;
    customer_phone: string;
    referrer_phone?: string | undefined;
    viewing_at: string;
    customer_note?: string;
    admin_note?: string;
    status: BookingStatus;
    is_paid_commission?: boolean;
};

export default function BookingEditDialog({
    open,
    booking,
    onClose,
    onSuccess,
}: Props) {
    const { updateBooking } = useUpdateBooking();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<BookingEditForm>();

    const status = useWatch({
        control,
        name: 'status',
    });

    useEffect(() => {
        if (booking) {
            reset({
                customer_name: booking.customer_name,
                customer_phone: booking.customer_phone,
                viewing_at: toDatetimeLocal(booking.viewing_at),
                customer_note: booking.customer_note || '',
                admin_note: booking.admin_note || '',
                status: booking.status,
                is_paid_commission: booking.is_paid_commission ?? false,
                referrer_phone: booking.referrer_phone ?? ""
            });
        }
    }, [booking, reset]);

    const onSubmit = async (data: BookingEditForm) => {
        if (!booking?.id) return;

        const { is_paid_commission, ...payload } = data;

        try {
            const res = await updateBooking(booking.id, {
                ...payload,
                ...(is_paid_commission !== undefined && { is_paid_commission: !!is_paid_commission }),
                viewing_at: data.viewing_at,
            });

            if (!res?.success) {
                toast.error('Cập nhật lịch xem thất bại');
                return;
            }

            toast.success('Cập nhật lịch xem thành công');
            onSuccess();
            onClose();
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh sửa lịch xem phòng</DialogTitle>

            <DialogContent dividers sx={formGridStyles.twoColumnGrid}>
                <FormTextField
                    name="customer_name"
                    control={control}
                    label="Tên khách hàng"
                    required
                />

                <FormTextField
                    name="customer_phone"
                    control={control}
                    label="Số điện thoại"
                    required
                />

                <FormTextField
                    name="referrer_phone"
                    control={control}
                    label="SĐT người giới thiệu"
                />

                <FormTextField
                    name="viewing_at"
                    control={control}
                    label="Thời gian xem"
                    type="datetime-local"
                    required
                />

                <FormTextField
                    name="customer_note"
                    control={control}
                    label="Ghi chú khách"
                    multiline
                    rows={2}
                    sx={formGridStyles.fullWidth}
                />

                <FormTextField
                    name="admin_note"
                    control={control}
                    label="Ghi chú admin"
                    multiline
                    rows={2}
                    sx={formGridStyles.fullWidth}
                />

                <FormAutocomplete
                    name="status"
                    control={control}
                    label="Trạng thái"
                    required
                    options={Object.entries(BookingStatusAdminLabels).map(
                        ([value, label]) => ({
                            value: value as BookingStatus,
                            label,
                        }),
                    )}
                />

                {status === BookingStatus.MovedIn && booking?.referrer_phone && (
                    <Box>
                        <Controller
                            name="is_paid_commission"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={!!field.value}
                                        />
                                    }
                                    label="Đã chi trả hoa hồng cho CTV"
                                />
                            )}
                        />

                        <Typography variant="caption" color="text.secondary">
                            Chỉ áp dụng khi khách đã vào ở
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Huỷ</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
