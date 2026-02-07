'use client';

import {
    BackLink,
    CardItem,
    HeaderRowOneItem,
    TitleMain,
} from '@/styles/common';
import { Box, Button, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';

import { ErrorMessage, RoomStatusLabels } from '@/common/const';
import { formGridStyles } from '@/styles/formGrid';

import { CollaboratorType, FieldCooperation } from '@/common/enum';
import { normalizeImagesPayload } from '@/common/page.service';
import { resolveUploadUrl } from '@/common/service';
import { Option } from '@/common/type';
import FormAutocomplete from '@/components/FormAutocomplete';
import useGetCollaboratorsCtv from '@/hooks/Collaborator/useGetCollaboratorsCtv';
import useGetRoomDetail from '@/hooks/Room/useGetRoomDetail';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { RoomForm, UploadPreview } from '@/types';


export default function EditRoomPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getRoomDetail } = useGetRoomDetail();
    const { updateRoom } = useUpdateRoom();
    const { uploadImages } = useUploadImages();
    const { getCollaboratorsCtv } = useGetCollaboratorsCtv();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [originalUploadIds, setOriginalUploadIds] = useState<string[]>([]);
    const [collaboratorOptions, setCollaboratorOptions] = useState<Option[]>([]);

    const { control, handleSubmit, reset } = useForm<RoomForm>({
        shouldUnregister: false,
        defaultValues: {
            images: [],
            active: true,
        },
    });

    useEffect(() => {
        (async () => {
            const res = await getCollaboratorsCtv({
                type: CollaboratorType.Broker,
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
    }, [getCollaboratorsCtv]);

    useEffect(() => {
        if (!id) return;

        (async () => {
            setPageLoading(true);

            const res = await getRoomDetail(id);
            if (!res?.success) {
                toast.error('Không tìm thấy phòng');
                router.push('/room');
                return;
            }

            const room = res.result;
            const uploads = room.uploads ?? [];

            setOriginalUploadIds(uploads.map((u: any) => u.id));

            reset({
                title: room.title,
                price: room.price,
                deposit: room.deposit,
                floor: room.floor,
                room_number: room.room_number ?? '',
                area: room.area ?? undefined,
                max_people: room.max_people ?? undefined,
                status: room.status,
                amenities: room.amenities ?? [],
                description: room.description ?? '',
                active: room.active,
                video_url: room.video_url,
                ctv_collaborator_id: room.ctv_collaborator_id,

                images: uploads.map((u: any, idx: number) => ({
                    id: u.id,
                    preview: resolveUploadUrl(u.file_path),
                    isCover: u.is_cover === true,
                    isExisting: true,
                })) as UploadPreview[],
            });

            setPageLoading(false);
        })();
    }, [id, getRoomDetail, reset, router]);

    const onSubmit: SubmitHandler<RoomForm> = async (data) => {
        setLoading(true);
        try {
            const { images } = data;

            const updateRes = await updateRoom(id, {
                title: data.title,
                price: data.price ? Number(data.price) : undefined,
                deposit: data.deposit ? Number(data.deposit) : undefined,
                floor: data.floor ? Number(data.floor) : undefined,
                room_number: data.room_number,
                area: data.area ? Number(data.area) : undefined,
                max_people: data.max_people ? Number(data.max_people) : undefined,
                status: data.status,
                amenities: data.amenities,
                description: data.description,
                active: data.active,
                video_url: data.video_url,
                ctv_collaborator_id: data.ctv_collaborator_id
            });

            if (!updateRes?.success) {
                toast.error('Cập nhật phòng thất bại');
                return;
            }

            const {
                upload_ids,
                delete_upload_ids,
                cover_upload_id
            } = await normalizeImagesPayload({
                images: images ?? [],
                uploadImages,
                roomId: id,
                originalUploadIds,
            });

            await updateRoom(id, {
                upload_ids,
                delete_upload_ids,
                cover_upload_id
            });

            toast.success('Cập nhật phòng thành công');
            router.push('/room');
        } catch (e) {
            console.error(e);
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    /* ================= RENDER ================= */
    return (
        <>
            <TitleMain>Chỉnh sửa phòng</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackLink href="/room">
                        ← Trở về danh sách
                    </BackLink>
                </HeaderRowOneItem>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={formGridStyles.form}
                >
                    <FormTextField
                        name="title"
                        control={control}
                        label="Tiêu đề"
                        required
                        sx={formGridStyles.fullWidth}
                    />

                    <FormTextField
                        name="floor"
                        type='number'
                        inputProps={{ min: 1 }}
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
                        format="currency"
                        required
                    />

                    <FormTextField
                        name="deposit"
                        control={control}
                        label="Cọc giữ phòng"
                        format="currency"
                    />

                    <FormTextField
                        name="area"
                        control={control}
                        label="Diện tích (m²)"
                        type="number"
                        inputProps={{ min: 1 }}
                    />

                    <FormTextField
                        name="max_people"
                        control={control}
                        label="Số người tối đa"
                        type="number"
                        inputProps={{ min: 1 }}
                    />

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
                        rows={10}
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
                        <Box sx={formGridStyles.actionLeft}>
                            <FormAutocomplete
                                name="ctv_collaborator_id"
                                control={control}
                                label="Cộng tác viên"
                                options={[
                                    { label: '-- Chọn cộng tác viên --', value: '' },
                                    ...collaboratorOptions,
                                ]}
                                sx={{ width: "50%" }}
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
                                sx={{ width: "50%" }}
                            />
                        </Box>

                        <Box sx={formGridStyles.actionRight}>
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
                                {loading ? 'Đang lưu...' : 'Cập nhật'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
