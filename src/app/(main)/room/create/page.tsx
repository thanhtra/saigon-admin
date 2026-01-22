'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';

import { BackLink, CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { formGridStyles } from '@/styles/formGrid';

import { ErrorMessage, RoomStatusLabels } from '@/common/const';
import { CollaboratorType, FieldCooperation, RoomStatus, UploadDomain } from '@/common/enum';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useGetRentalsByCollaborator from '@/hooks/Rental/useGetRentalsByCollaborator';
import useCreateRoom from '@/hooks/Room/useCreateRoom';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { RoomForm } from '@/types';

export default function CreateRoom() {
    const { createRoom } = useCreateRoom();
    const { updateRoom } = useUpdateRoom();
    const { uploadImages } = useUploadImages();
    const { getCollaboratorsAvailable } = useGetCollaboratorsAvailable();
    const { getRentalsByCollaborator } = useGetRentalsByCollaborator();

    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<any[]>([]);
    const [rentalOptions, setRentalOptions] = useState<any[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<RoomForm>({
        defaultValues: {
            collaborator_id: '',
            rental_id: '',
            title: '',
            floor: undefined,
            room_number: '',
            price: undefined,
            area: undefined,
            max_people: undefined,
            description: '',
            video_url: '',
            amenities: [],
            images: [],
            status: RoomStatus.Available,
            active: true,
        },
    });

    const collaboratorId = useWatch({ control, name: 'collaborator_id' });

    useEffect(() => {
        (async () => {
            const res = await getCollaboratorsAvailable({
                type: CollaboratorType.Owner,
                field_cooperation: FieldCooperation.Rental,
            });

            if (res?.success) {
                setCollaboratorOptions(
                    res.result.map((c: any) => ({
                        label: `${c.name} - ${c.phone}`,
                        value: c.id,
                    })),
                );
            }
        })();
    }, []);


    useEffect(() => {
        if (!collaboratorId) {
            setRentalOptions([]);
            setValue('rental_id', '');
            return;
        }

        (async () => {
            const res = await getRentalsByCollaborator({
                collaborator_id: collaboratorId,
                active: true,
            });

            if (res?.success) {
                setRentalOptions(
                    res.result.map((r: any) => ({
                        label: r.address_detail,
                        value: r.id,
                    })),
                );
            }
        })();
    }, [collaboratorId, getRentalsByCollaborator, setValue]);


    const onSubmit: SubmitHandler<RoomForm> = async (data) => {
        if (!data.images?.length) {
            toast.error('Cần ít nhất 1 hình ảnh');
            return;
        }

        setLoading(true);
        try {
            const { images, ...payload } = data;

            const createRes = await createRoom({
                rental_id: payload.rental_id,
                title: payload.title,
                floor: payload.floor ? Number(payload.floor) : undefined,
                room_number: payload.room_number,
                price: Number(payload.price),
                area: payload.area ? Number(payload.area) : undefined,
                max_people: payload.max_people ? Number(payload.max_people) : undefined,
                description: payload.description,
                amenities: payload.amenities,
                status: payload.status,
                active: payload.active,
                video_url: payload.video_url
            });

            if (!createRes?.success || !createRes.result?.id) {
                toast.error('Tạo phòng thất bại');
                return;
            }

            const roomId = createRes.result.id;

            const uploadRes = await uploadImages(
                images.map(i => i.file!),
                {
                    domain: UploadDomain.Rooms,
                    room_id: roomId,
                },
            );

            if (!uploadRes.success || !uploadRes.result?.length) {
                toast.error('Upload hình thất bại');
                return;
            }

            const uploadIds = uploadRes.result.map((u: any) => u.id);
            const coverIndex =
                images.findIndex(i => i.isCover) >= 0
                    ? images.findIndex(i => i.isCover)
                    : 0;

            await updateRoom(roomId, {
                upload_ids: uploadIds,
                cover_index: coverIndex,
            });

            toast.success('Tạo phòng thành công');
            reset();
        } catch (error) {
            console.error(error);
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới phòng</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackLink href="/room">← Trở về danh sách</BackLink>
                </HeaderRowOneItem>

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
                        label="Tiêu đề phòng"
                        required
                        sx={formGridStyles.fullWidth}
                    />

                    <FormTextField
                        name="floor"
                        type='number'
                        control={control}
                        label="Tầng"
                        placeholder='Để trống nếu tầng trệt'
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

                    <FormTextField name="area" control={control} label="Diện tích (m²)" type="number" />
                    <FormTextField name="max_people" control={control} label="Số người tối đa" type="number" />

                    <FormTextField
                        name="video_url"
                        control={control}
                        label="Link Video"
                    />

                    <FormTextField
                        name="description"
                        control={control}
                        label="Mô tả chi tiết"
                        multiline
                        rows={5}
                        sx={formGridStyles.fullWidth}
                    />

                    <Box sx={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <FormAmenityCheckbox name="amenities" control={control} />
                        <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                                <FormImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="Hình ảnh phòng"
                                />
                            )}
                        />
                    </Box>

                    <Box sx={formGridStyles.actionRow}>
                        <Box sx={formGridStyles.actionLeft}>
                            <FormTextField
                                name="status"
                                control={control}
                                label="Trạng thái"
                                options={Object.entries(RoomStatusLabels).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                                required
                            />
                        </Box>

                        <Box sx={formGridStyles.actionRight}>
                            <ControlledSwitch name="active" control={control} label="Kích hoạt" />

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
                </Box>
            </CardItem>
        </>
    );
}
