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
    RentalTypeLabels,
    RoomStatusLabels
} from '@/common/const';
import {
    CollaboratorType,
    FieldCooperation,
    RentalType,
    WaterUnit
} from '@/common/enum';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
    resolveUploadUrl,
} from '@/common/service';
import { Option } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useGetRentalDetail from '@/hooks/Rental/useGetRentalDetail';
import useUpdateRental from '@/hooks/Rental/useUpdateRental';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { normalizeImagesPayload } from '@/common/page.service';
import { RentalForm, UploadPreview } from '@/types';

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
    } = useForm<RentalForm>({
        shouldUnregister: false,
        defaultValues: {
            active: true,
            images: [],
            water_unit: WaterUnit.PerM3,
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

                province: rental.province,
                district: rental.district,
                ward: rental.ward,
                street: rental.street,
                house_number: rental.house_number,
                address_detail: rental.address_detail,
                address_detail_display: rental.address_detail_display,
                commission: rental.commission,
                note: rental?.note ?? '',
                status: rental.status,
                active: rental.active,

                fee_electric: rental.fee_electric,
                fee_water: rental.fee_water,
                water_unit: rental.water_unit ?? WaterUnit.PerM3,
                fee_wifi: rental.fee_wifi,
                fee_service: rental.fee_service,
                fee_parking: rental.fee_parking,
                fee_other: rental.fee_other,

                /* ===== ROOM ===== */

                title: room?.title ?? '',
                price: room?.price,
                area: room?.area ?? undefined,
                description: room?.description ?? '',
                room_status: room?.status ?? '',
                deposit: room?.deposit,
                max_people: room?.max_people,
                floor: room?.floor,
                room_number: room?.room_number,

                amenities: room?.amenities ?? [],
                images: uploads.map((u: any, idx: number) => ({
                    id: u.id,
                    preview: resolveUploadUrl(u.file_path),
                    isCover: !!u.is_cover,
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


    const onSubmit: SubmitHandler<RentalForm> = async (data) => {
        try {
            if (data.address_detail === data.address_detail_display) {
                toast.error('Cần sửa địa chỉ hiển thị');
                return;
            }

            setLoading(true);

            const isBoardingHouse = data.rental_type === RentalType.BoardingHouse;

            const updateRes = await updateRental(id, {

                collaborator_id: data.collaborator_id,
                commission: data.commission,

                province: data.province,
                district: data.district,
                ward: data.ward,
                street: data.street,
                house_number: data.house_number,
                address_detail: data.address_detail,
                address_detail_display: data.address_detail_display,

                note: data.note,
                status: data.status,
                active: data.active,

                fee_electric: data.fee_electric,
                fee_water: data.fee_water,
                water_unit: data.water_unit,
                fee_wifi: data.fee_wifi,
                fee_service: data.fee_service,
                fee_parking: data.fee_parking,
                fee_other: data.fee_other,

                ...(!isBoardingHouse && {
                    title: data.title,
                    price: data.price ? Number(data.price) : undefined,
                    area: data.area ? Number(data.area) : undefined,
                    max_people: data.max_people ? Number(data.max_people) : undefined,
                    room_status: data.room_status,
                    amenities: data.amenities,
                    deposit: data.deposit,
                    description: data.description,
                    floor: data.floor ? Number(data.floor) : undefined,
                    room_number: data.room_number,
                }),
            });

            if (!updateRes?.success) {
                toast.error('Cập nhật thất bại');
                return;
            }

            if (roomId && rentalType !== RentalType.BoardingHouse) {
                const { images } = data;

                const {
                    upload_ids,
                    delete_upload_ids,
                    cover_upload_id
                } = await normalizeImagesPayload({
                    images: images ?? [],
                    uploadImages,
                    roomId,
                    originalUploadIds,
                });

                await updateRoom(roomId, {
                    upload_ids,
                    delete_upload_ids,
                    cover_upload_id
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
                    sx={formGridStyles.formFour}
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
                        name="address_detail_display"
                        control={control}
                        label="Địa chỉ hiển thị"
                        multiline
                        rows={1}
                        required
                        sx={formGridStyles.fullWidth}
                    />

                    <FormTextField
                        name="fee_electric"
                        control={control}
                        label="Điện (đ/kWh)"
                        format="currency"
                    />

                    <FormTextField
                        name="fee_water"
                        control={control}
                        label="Tiền nước"
                        format="currency"
                    />

                    <FormTextField
                        name="water_unit"
                        control={control}
                        label="Đơn vị nước"
                        options={[
                            { label: 'đ / m³', value: WaterUnit.PerM3 },
                            { label: 'đ / người', value: WaterUnit.PerPerson },
                        ]}
                    />

                    <FormTextField
                        name="fee_wifi"
                        control={control}
                        label="Wifi (đ/tháng)"
                        format="currency"
                    />

                    <FormTextField
                        name="fee_parking"
                        control={control}
                        label="Phí gửi xe (đ/tháng)"
                        format="currency"
                    />

                    <FormTextField
                        name="fee_service"
                        control={control}
                        label="Phí dịch vụ (đ/tháng)"
                        format="currency"
                    />

                    <FormTextField
                        name="fee_other"
                        control={control}
                        label="Phí khác"
                        sx={{
                            gridColumn: 'span 2',
                        }}
                    />

                    <FormTextField
                        name="note"
                        control={control}
                        label="Note"
                        multiline
                        rows={1}
                        sx={{
                            gridColumn: 'span 4',
                        }}
                    />

                    <FormTextField
                        name="commission"
                        control={control}
                        label="Giá trị hoa hồng"
                        multiline
                        sx={{ gridColumn: 'span 4' }}
                    />

                    <FormAutocomplete
                        name="collaborator_id"
                        control={control}
                        label="Chủ nhà"
                        options={[
                            { label: '-- Chọn chủ nhà --', value: '' },
                            ...collaboratorOptions,
                        ]}
                    />

                    <FormTextField
                        name="status"
                        control={control}
                        label="Trạng thái nhà"
                        options={[
                            { label: '-- Chọn tình trạng --', value: '' },
                            ...Object.entries(RentalStatusLabels).map(([value, label]) => ({
                                label,
                                value,
                            })),
                        ]}
                        required
                    />

                    <FormTextField
                        name="rental_type"
                        control={control}
                        label="Loại hình cho thuê"
                        options={[
                            { label: '-- Chọn loại hình --', value: '' },
                            ...Object.entries(RentalTypeLabels).map(([value, label]) => ({
                                label,
                                value,
                            })),
                        ]}
                        required
                        disabled
                    />

                    {
                        isUnitRental(rentalType) &&
                        <>
                            <FormTextField
                                name="title"
                                control={control}
                                label="Tiêu đề"
                                required
                                sx={formGridStyles.fullWidthFormFour}
                            />

                            <FormTextField
                                name="price"
                                control={control}
                                label="Giá thuê (VNĐ/tháng)"
                                required
                                format="currency"
                            />

                            <FormTextField
                                name="deposit"
                                control={control}
                                label="Cọc giữ chỗ (VNĐ)"
                                format="currency"
                            />

                            <FormTextField
                                name="area"
                                control={control}
                                label="Diện tích (m²)"
                                type="number"
                                inputProps={{ min: 0 }}
                            />

                            <FormTextField
                                name="max_people"
                                control={control}
                                label="Số người tối đa"
                                type="number"
                                inputProps={{ min: 0 }}
                            />

                            {
                                rentalType === RentalType.Apartment &&
                                <>
                                    <FormTextField
                                        name="floor"
                                        control={control}
                                        label="Tầng"
                                        placeholder='Để trống nếu tầng trệt'
                                    />

                                    <FormTextField
                                        name="room_number"
                                        control={control}
                                        label="Nhà số mấy trong toà nhà (chung cư)"
                                    />
                                </>
                            }

                            <Box sx={formGridStyles.fullWidth}>
                                <FormAmenityCheckbox
                                    name="amenities"
                                    control={control}

                                />
                            </Box>
                            <Box sx={formGridStyles.fullWidth}>
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
                                name="description"
                                control={control}
                                label="Mô tả chi tiết"
                                multiline
                                rows={10}
                                sx={formGridStyles.fullWidthFormFour}
                            />
                        </>
                    }

                    <Box sx={formGridStyles.actionRowFormFour}>
                        <Box sx={formGridStyles.actionRightInLeft}>
                            {isUnitRental(rentalType) && <FormTextField
                                name="room_status"
                                control={control}
                                label="Trạng thái phòng"
                                options={[
                                    { label: '-- Chọn --', value: '' },
                                    ...Object.entries(RoomStatusLabels).map(([value, label]) => ({
                                        label,
                                        value,
                                    })),
                                ]}
                                required
                                sx={{ width: "50%" }}
                            />}
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
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
