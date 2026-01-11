'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';

import {
    BackLink,
    CardItem,
    HeaderRowOneItem,
    TitleMain,
} from '@/styles/common';
import { Box, Button, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
    ErrorMessage,
    isUnitRental,
    RentalStatusLabels,
    RentalTypeLabels
} from '@/common/const';
import {
    CollaboratorType,
    FieldCooperation,
    RentalType
} from '@/common/enum';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
    resolveUploadUrl,
} from '@/common/service';
import { Option, RentalInput, UploadPreview } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useGetRentalDetail from '@/hooks/Rental/useGetRentalDetail';
import useUpdateRental from '@/hooks/Rental/useUpdateRental';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { normalizeImagesPayload } from '../../service';

export default function EditRentalPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getRentalDetail } = useGetRentalDetail();
    const { updateRental } = useUpdateRental();
    const { updateRoom } = useUpdateRoom();
    const { uploadImages } = useUploadImages();
    const { getCollaboratorsAvailable } = useGetCollaboratorsAvailable();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [collaboratorOptions, setCollaboratorOptions] = useState<Option[]>([]);
    const [initialCollaboratorId, setInitialCollaboratorId] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [originalUploadIds, setOriginalUploadIds] = useState<string[]>([]);



    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<RentalInput>({
        shouldUnregister: false,
        defaultValues: {
            active: true,
            images: [],
        },
    });

    const provinceId = useWatch({ control, name: 'province' });
    const districtId = useWatch({ control, name: 'district' });
    const wardId = useWatch({ control, name: 'ward' });
    const street = useWatch({ control, name: 'street' });
    const houseNumber = useWatch({ control, name: 'house_number' });
    const rentalType = useWatch({ control, name: 'rental_type' });

    const provinceOptions = useMemo(() => getProvinceOptions(), []);
    const districtOptions = useMemo(
        () => getDistrictOptions(provinceId),
        [provinceId],
    );
    const wardOptions = useMemo(
        () => getWardOptions(provinceId, districtId),
        [provinceId, districtId],
    );

    useEffect(() => {
        const address = buildAddressDetail({
            provinceId,
            districtId,
            wardId,
            street,
            houseNumber,
        });
        setValue('address_detail', address);
    }, [provinceId, districtId, wardId, street, houseNumber, setValue]);

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
    }, [getCollaboratorsAvailable]);

    useEffect(() => {
        if (!id) return;

        (async () => {
            setPageLoading(true);
            const res = await getRentalDetail(id);
            if (!res?.success) {
                toast.error('Không tìm thấy tin cho thuê');
                router.push('/rental');
                return;
            }

            const rental = res.result;
            const room = rental.rooms?.[0];
            setRoomId(room?.id ?? null);

            setInitialCollaboratorId(rental.collaborator?.id ?? null);

            const uploads = room?.uploads ?? [];

            setOriginalUploadIds(uploads.map((u: any) => u.id));


            setValue('rental_type', rental.rental_type, {
                shouldDirty: false,
                shouldTouch: false,
            });

            reset({
                /* ===== RENTAL ===== */
                rental_type: rental.rental_type,
                status: rental.status,
                province: rental.province,
                district: rental.district,
                ward: rental.ward,
                street: rental.street,
                house_number: rental.house_number,
                address_detail: rental.address_detail,
                address_detail_display: rental.address_detail_display,
                commission_value: rental.commission_value,
                active: rental.active,
                description: rental.description,

                /* ===== ROOM ===== */
                title: room?.title ?? '',
                price: room?.price ? Number(room.price) : undefined,
                area: room?.area ?? undefined,
                amenities: room?.amenities ?? [],
                description_detail: room?.description ?? '',

                images: uploads.map((u: any, idx: number) => ({
                    id: u.id,
                    preview: resolveUploadUrl(u.file_path),
                    isCover: idx === room.cover_index,
                    isExisting: true,
                })) ?? [],
            });

            setPageLoading(false);
        })();
    }, [id, getRentalDetail, reset, router]);

    useEffect(() => {
        if (!initialCollaboratorId) return;
        if (!collaboratorOptions.length) return;

        const exists = collaboratorOptions.some(
            (c) => c.value === initialCollaboratorId,
        );

        if (exists) {
            setValue('collaborator_id', initialCollaboratorId, {
                shouldDirty: false,
                shouldTouch: false,
            });
        }
    }, [collaboratorOptions, initialCollaboratorId, setValue]);


    const onSubmit: SubmitHandler<RentalInput> = async (data) => {
        setLoading(true);
        try {
            const { images, ...payload } = data;

            const updateRes = await updateRental(id, {
                title: data.title,
                active: data.active,
                address_detail: data.address_detail,
                address_detail_display: data.address_detail_display,
                collaborator_id: data.collaborator_id,
                commission_value: data.commission_value,
                description: data.description,
                district: data.district,
                house_number: data.house_number,
                province: data.province,
                rental_type: data.rental_type,
                status: data.status,
                street: data.street,
                ward: data.ward,
                price: payload.price ? Number(payload.price) : undefined,
                amenities: data.amenities,
                description_detail: data.description_detail,
                area: data.area,
            });

            if (!updateRes?.success) {
                toast.error('Cập nhật thất bại');
                return;
            }

            if (roomId) {
                const {
                    upload_ids,
                    cover_index,
                    delete_upload_ids
                } = await normalizeImagesPayload({
                    images: images ?? [],
                    uploadImages,
                    roomId,
                    originalUploadIds,
                });

                await updateRoom(roomId, {
                    upload_ids,
                    cover_index,
                    delete_upload_ids,
                });
            }

            toast.success('Cập nhật thành công');
            router.push('/rental');
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

    return (
        <>
            <TitleMain>Chỉnh sửa thông tin nhà</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackLink href="/rental">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRowOneItem>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={formGridStyles.form}
                >

                    <FormAutocomplete
                        name="province"
                        control={control}
                        label="Tỉnh / Thành phố"
                        options={provinceOptions}
                        required
                    />

                    <FormAutocomplete
                        name="district"
                        control={control}
                        label="Quận / Huyện"
                        options={districtOptions}
                        disabled={!provinceId}
                        required
                    />

                    <FormAutocomplete
                        name="ward"
                        control={control}
                        label="Phường / Xã"
                        options={wardOptions}
                        disabled={!districtId}
                        required
                    />

                    <FormTextField
                        name="street"
                        control={control}
                        label="Đường / Phố"
                        required
                    />

                    <FormTextField
                        name="house_number"
                        control={control}
                        label="Số nhà"
                        required
                    />

                    <FormTextField
                        name="address_detail"
                        control={control}
                        label="Địa chỉ"
                        multiline
                        rows={1}
                        required
                        disabled
                    />

                    <FormTextField
                        name="commission_value"
                        control={control}
                        label="Giá trị hoa hồng"
                        multiline
                        required
                    />

                    <FormTextField
                        name="address_detail_display"
                        control={control}
                        label="Địa chỉ hiển thị"
                        multiline
                        rows={1}
                        required
                    />

                    <FormTextField
                        name="description"
                        control={control}
                        label="Mô tả tổng quan căn nhà"
                        multiline
                        rows={5}
                        sx={formGridStyles.fullWidth}
                    />

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

                    <FormTextField
                        name="rental_type"
                        control={control}
                        label="Loại hình cho thuê"
                        disabled
                        options={[
                            { label: '-- Chọn loại hình --', value: '' },
                            ...Object.entries(RentalTypeLabels).map(([value, label]) => ({
                                label,
                                value,
                            })),
                        ]}
                        required
                    />

                    {
                        isUnitRental(rentalType) &&
                        <>
                            <FormTextField
                                name="title"
                                control={control}
                                label="Tiêu đề"
                                required
                                sx={formGridStyles.fullWidth}
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
                                label="Diện tích"
                                type="number"
                            />

                            {
                                rentalType === RentalType.Apartment &&
                                <>
                                    <FormTextField
                                        name="floor"
                                        control={control}
                                        label="Tầng"
                                        type="number"
                                        required
                                    />

                                    <FormTextField
                                        name="room_number"
                                        control={control}
                                        label="Nhà số mấy trong toà nhà (chung cư)"
                                    />
                                </>
                            }



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
                                            label="Upload hình"
                                        />
                                    )}
                                />
                            </Box>


                            <FormTextField
                                name="description_detail"
                                control={control}
                                label="Mô tả chi tiết căn nhà cho thuê"
                                multiline
                                rows={6}
                                sx={formGridStyles.fullWidth}
                            />
                        </>
                    }

                    <Box sx={formGridStyles.actionRow}>
                        <Box sx={formGridStyles.actionLeft}>
                            <FormTextField
                                name="status"
                                control={control}
                                label="Tình trạng nhà"
                                options={[
                                    { label: '-- Chọn tình trạng --', value: '' },
                                    ...Object.entries(RentalStatusLabels).map(([value, label]) => ({
                                        label,
                                        value,
                                    })),
                                ]}
                                required
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
