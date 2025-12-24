'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormTextField from '@/components/FormTextField';
import FormAutocomplete from '@/components/FormAutocomplete';

import { CardItem, HeaderRow, TitleMain, BackLink } from '@/styles/common';
import { formGridStyles } from '@/styles/formGrid';

import { RoomInput, UploadPreview } from '@/common/type';
import useGetRentals from '@/hooks/Rental/useGetRentals';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCreateRoom from '@/hooks/Room/useCreateRoom';
import { RoomStatusLabels } from '@/common/const';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormImageUpload from '@/components/FormImageUpload';
import ControlledSwitch from '@/components/ControlledSwitch';

export default function CreateRoom() {
    const { createRoom } = useCreateRoom();
    const { getRentals } = useGetRentals();
    const { getCollaborators } = useGetCollaborators();

    const [loading, setLoading] = useState(false);
    const [rentalOptions, setRentalOptions] = useState<any[]>([]);
    const [collaboratorOptions, setCollaboratorOptions] = useState<any[]>([]);

    /* ================= FORM ================= */
    const { control, handleSubmit, reset } = useForm<RoomInput>({
        defaultValues: {
            rental_id: '',
            collaborator_id: '',
            room_code: '',
            price: undefined,
            floor: undefined,
            room_number: '',
            area: undefined,
            max_people: undefined,
            status: 'available',
            room_images: [],
            amenities: []
        },
    });

    /* ================= LOAD OPTIONS ================= */
    useEffect(() => {
        (async () => {
            const [rentalRes, collRes] = await Promise.all([
                getRentals({ active: true }),
                getCollaborators(),
            ]);

            if (rentalRes?.success) {
                setRentalOptions(
                    rentalRes.result.data.map((r: any) => ({
                        label: r.title,
                        value: r.id,
                    })),
                );
            }

            if (collRes?.success) {
                setCollaboratorOptions(
                    collRes.result.data.map((c: any) => ({
                        label: c.user.name,
                        value: c.id,
                    })),
                );
            }
        })();
    }, []);

    /* ================= SUBMIT ================= */
    const onSubmit: SubmitHandler<RoomInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createRoom({
                ...data,
                price: Number(data.price),
            });

            if (res?.success) {
                toast.success('Tạo phòng thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */
    return (
        <>
            <TitleMain>Thêm phòng</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackLink href="/room">
                        ← Trở về danh sách phòng
                    </BackLink>
                </HeaderRow>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={formGridStyles.form}
                >
                    {/* ===== CHỦ NHÀ ===== */}
                    <FormAutocomplete
                        name="collaborator_id"
                        control={control}
                        label="Chủ nhà"
                        options={[
                            { label: '-- Chọn chủ nhà --', value: '' },
                            ...collaboratorOptions,
                        ]}
                        required
                    />
                    {/* ===== NHÀ ===== */}
                    <FormAutocomplete
                        name="rental_id"
                        control={control}
                        label="Nhà cho thuê"
                        options={[
                            { label: '-- Chọn nhà --', value: '' },
                            ...rentalOptions,
                        ]}
                        required
                    />



                    <FormTextField
                        name="floor"
                        control={control}
                        label="Tầng"
                        type="number"
                    />

                    <FormTextField
                        name="room_number"
                        control={control}
                        label="Phòng số"
                    />



                    <FormTextField
                        name="price"
                        control={control}
                        label="Giá thuê"
                        type="number"
                        required
                    />

                    <FormTextField
                        name="area"
                        control={control}
                        label="Diện tích (m²)"
                        type="number"
                    />

                    <FormTextField
                        name="max_people"
                        control={control}
                        label="Số người tối đa"
                        type="number"
                    />

                    <FormTextField
                        name="status"
                        control={control}
                        label="Trạng thái"
                        options={Object.entries(RoomStatusLabels).map(
                            ([value, label]) => ({
                                value,
                                label,
                            }),
                        )}
                        required
                    />

                    <Box
                        sx={{
                            gridColumn: 'span 2',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 2,
                            alignItems: 'flex-start',
                        }}
                    >
                        <FormAmenityCheckbox
                            name="amenities"
                            control={control}
                        />

                        <Controller
                            name="room_images"
                            control={control}
                            defaultValue={[] as UploadPreview[]}
                            render={({ field }) => (
                                <FormImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="Upload hình phòng"
                                />
                            )}
                        />
                    </Box>

                    <Box sx={formGridStyles.actionRow}>
                        <ControlledSwitch
                            name="active"
                            control={control}
                            label="Kích hoạt"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={formGridStyles.submitButton}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
