'use client';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormAutocomplete from '@/components/FormAutocomplete';
import FormTextField from '@/components/FormTextField';

import { BookingStatusAdminLabels, ErrorMessage, PHONE_REGEX } from '@/common/const';
import { BookingStatus } from '@/common/enum';
import { isAtLeastMinutesLater } from '@/common/time.service';
import useCreateBooking from '@/hooks/Booking/useCreateBooking';
import { formGridStyles } from '@/styles/formGrid';
import { CreateBookingForm, CreateBookingInput } from '@/types/booking';

interface Props {
    open: boolean;
    room: {
        id: string;
        rental_id: string;
        room_code?: string;
        title?: string;
    } | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const DEFAULT_FORM: CreateBookingForm = {
    room_id: '',
    rental_id: '',
    customer_name: '',
    customer_phone: '',
    referrer_phone: '',
    customer_note: '',
    admin_note: '',
    viewing_at: '',
    status: BookingStatus.Pending,
};

export default function RoomBookingDialog({
    open,
    room,
    onClose,
    onSuccess,
}: Props) {
    const { createBooking, loading } = useCreateBooking();

    const { control, handleSubmit, reset } = useForm<CreateBookingForm>({
        defaultValues: DEFAULT_FORM,
    });

    /** Sync room → form */
    useEffect(() => {
        if (!open || !room) return;

        reset({
            ...DEFAULT_FORM,
            room_id: room.id,
            rental_id: room.rental_id,
        });
    }, [open, room, reset]);

    const onSubmit: SubmitHandler<CreateBookingForm> = async (form) => {
        try {
            const payload: CreateBookingInput = {
                room_id: form.room_id,
                rental_id: form.rental_id,
                customer_name: form.customer_name.trim(),
                customer_phone: form.customer_phone,
                viewing_at: form.viewing_at,
                status: form.status,
                ...(form.referrer_phone && { referrer_phone: form.referrer_phone }),
                ...(form.customer_note && { customer_note: form.customer_note }),
                ...(form.admin_note && { admin_note: form.admin_note }),
            };

            const res = await createBooking(payload);

            if (!res?.success) {
                toast.error(res?.message || 'Tạo lịch xem thất bại');
                return;
            }

            toast.success('Tạo lịch xem thành công');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    const roomOptions = useMemo(
        () =>
            room
                ? [
                    {
                        value: room.id,
                        label: `${room.room_code ?? ''} ${room.title ?? ''}`.trim(),
                    },
                ]
                : [],
        [room],
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={500}>Thêm lịch xem phòng</DialogTitle>

            <DialogContent dividers sx={formGridStyles.twoColumnGrid}>
                <FormAutocomplete
                    name="room_id"
                    control={control}
                    label="Phòng"
                    options={roomOptions}
                    disabled
                    required
                />

                <FormTextField
                    name="viewing_at"
                    control={control}
                    label="Thời gian xem"
                    type="datetime-local"
                    required
                    rules={{
                        validate: (value) => isAtLeastMinutesLater(value, 10),
                    }}
                />

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
                    required="Vui lòng nhập số điện thoại"
                    rules={{
                        pattern: {
                            value: PHONE_REGEX,
                            message: 'Số điện thoại không hợp lệ',
                        },
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <FormTextField
                    name="referrer_phone"
                    control={control}
                    label="SĐT người giới thiệu"
                    rules={{
                        pattern: {
                            value: PHONE_REGEX,
                            message: 'Số điện thoại không hợp lệ',
                        },
                    }}
                />

                <FormAutocomplete
                    name="status"
                    control={control}
                    label="Trạng thái"
                    options={Object.entries(BookingStatusAdminLabels).map(([value, label]) => ({
                        value,
                        label,
                    }))}
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
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Huỷ
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    {loading ? 'Đang lưu...' : 'Tạo lịch xem'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
