'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormAutocomplete from '@/components/FormAutocomplete';
import FormTextField from '@/components/FormTextField';

import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { formGridStyles } from '@/styles/formGrid';

import { RoomStatusLabels } from '@/common/const';
import { RoomInput, UploadPreview } from '@/common/type';
import ControlledSwitch from '@/components/ControlledSwitch';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormImageUpload from '@/components/FormImageUpload';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useGetRentalsByCollaborator from '@/hooks/Rental/useGetRentalsByCollaborator';
import useCreateRoom from '@/hooks/Room/useCreateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';

export default function CreateRoom() {
    const { createRoom } = useCreateRoom();
    const { getRentalsByCollaborator } = useGetRentalsByCollaborator();
    const { getCollaborators } = useGetCollaborators();
    const { uploadImages } = useUploadImages();
    const { updateRoom } = useUpdateRoom();

    const [loading, setLoading] = useState(false);
    const [rentalOptions, setRentalOptions] = useState<any[]>([]);
    const [collaboratorOptions, setCollaboratorOptions] = useState<any[]>([]);


    const { control, handleSubmit, reset } = useForm<RoomInput>({
        defaultValues: {
            rental_id: '',
            collaborator_id: '',
            price: undefined,
            floor: undefined,
            room_number: '',
            area: undefined,
            max_people: undefined,
            status: 'available',
            images: [],
            amenities: [],
            title: '',
            description: '',
            active: true
        },
    });

    const collaboratorId = useWatch({
        control,
        name: 'collaborator_id',
    });

    useEffect(() => {
        (async () => {
            const res = await getCollaborators();

            if (res?.success) {
                setCollaboratorOptions(
                    res.result.data.map((c: any) => ({
                        label: c.user.name,
                        value: c.id,
                    })),
                );
            }
        })();
    }, []);

    useEffect(() => {
        if (!collaboratorId) {
            setRentalOptions([]);
            return;
        }

        reset((prev) => ({
            ...prev,
            rental_id: '',
        }));

        (async () => {
            const res = await getRentalsByCollaborator({
                collaborator_id: collaboratorId,
                active: true,
            });

            if (res?.success) {
                setRentalOptions(
                    res.result.map((r: any) => ({
                        label: `${r.address_detail}`,
                        value: r.id,
                    })),
                );
            }
        })();
    }, [collaboratorId]);


    const onSubmit: SubmitHandler<RoomInput> = async (data) => {
        setLoading(true);

        try {
            if (!data.images?.length) {
                toast.error('Cần ít nhất 1 tấm hình!');
                return;
            }

            /* ================= 1. CREATE ROOM (NO IMAGES) ================= */

            const { images, ...payload } = data;
            const createRes = await createRoom({
                rental_id: payload.rental_id,
                collaborator_id: payload.collaborator_id,
                title: payload.title,
                floor: payload?.floor ? Number(payload.floor) : undefined,
                room_number: payload.room_number,
                price: Number(payload.price),
                area: data?.area ? Number(payload.area) : undefined,
                max_people: payload.max_people ? Number(payload.max_people) : undefined,
                status: payload.status,
                amenities: data.amenities,
                description: payload.description,
                active: payload.active
            });

            if (!createRes?.success || !createRes.result?.id) {
                toast.error(createRes?.message || 'Tạo phòng thất bại');
                return;
            }

            const roomId = createRes.result.id;

            /* ================= 2. UPLOAD IMAGES ================= */

            const uploadRes = await uploadImages(
                data.images.map(i => i.file),
                {
                    domain: 'rooms',
                    room_id: roomId,
                },
            );

            if (!uploadRes.success || !uploadRes.result.length) {
                toast.error('Upload hình thất bại');
                return;
            }

            const uploadIds = uploadRes.result.map(u => u.id);

            const coverIndex =
                data.images.findIndex(i => i.isCover) >= 0
                    ? data.images.findIndex(i => i.isCover)
                    : 0;

            /* ================= 3. UPDATE ROOM ================= */

            const updateRes = await updateRoom(roomId, {
                upload_ids: uploadIds,
                cover_index: coverIndex,
            });

            if (!updateRes?.success) {
                toast.error('Cập nhật hình thất bại');
                return;
            }

            toast.success('🎉 Tạo phòng thành công!');
            reset();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm phòng trọ</TitleMain>

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

                    <FormAutocomplete
                        name="rental_id"
                        control={control}
                        label="Nhà cho thuê"
                        options={[
                            { label: '-- Chọn nhà --', value: '' },
                            ...rentalOptions,
                        ]}
                        disabled={!collaboratorId}
                        required
                    />

                    <FormTextField
                        name="title"
                        control={control}
                        label="Tiêu đề"
                        required
                        sx={formGridStyles.fullWidth}
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

                    <FormTextField
                        name="description"
                        control={control}
                        label="Mô tả chi tiết"
                        multiline
                        rows={5}
                        sx={formGridStyles.fullWidth}
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
                            name="images"
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
