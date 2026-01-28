'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormTextField from '@/components/FormTextField';

import { BackLink, CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { Box, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
    ErrorMessage,
    GO_VAP_DISTRICT_ID,
    HCM_PROVINCE_ID,
    isUnitRental,
    RentalStatusLabels,
    RentalTypeLabels,
    RoomStatusLabels,
} from '@/common/const';
import { CollaboratorType, FieldCooperation, RentalStatus, RentalType, RoomStatus, UploadDomain, WaterUnit } from '@/common/enum';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions
} from '@/common/service';
import { Option } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';

import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormImageUpload from '@/components/FormImageUpload';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCreateRental from '@/hooks/Rental/useCreateRental';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { Controller } from 'react-hook-form';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import { RentalForm, UploadPreview } from '@/types';



export default function CreateRental() {
    const { createRental } = useCreateRental();
    const { getCollaborators } = useGetCollaborators();
    const { uploadImages } = useUploadImages();
    const { updateRoom } = useUpdateRoom();
    const { getCollaboratorsAvailable } = useGetCollaboratorsAvailable();

    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<Option[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<RentalForm>({
        defaultValues: {
            rental_type: RentalType.BoardingHouse,
            province: HCM_PROVINCE_ID,
            district: GO_VAP_DISTRICT_ID,
            ward: '',
            street: '',
            house_number: '',
            address_detail: '',
            address_detail_display: '',
            active: true,
            description: '',
            commission: '',
            images: [],
            price: undefined,
            note: '',
            title: '',
            floor: undefined,
            area: undefined,
            room_number: '',
            status: RentalStatus.Confirmed,
            fee_electric: undefined,
            fee_water: undefined,
            water_unit: WaterUnit.PerM3,
            fee_wifi: undefined,
            fee_service: undefined,
            fee_parking: undefined,
            fee_other: '',
            room_status: RoomStatus.Available
        },
    });


    const provinceId = useWatch({ control, name: 'province' });
    const districtId = useWatch({ control, name: 'district' });
    const wardId = useWatch({ control, name: 'ward' });
    const street = useWatch({ control, name: 'street' });
    const houseNumber = useWatch({ control, name: 'house_number' });
    const rentalType = useWatch({ control, name: 'rental_type' });


    useEffect(() => {
        if (provinceId !== HCM_PROVINCE_ID) {
            setValue('district', '');
            setValue('ward', '');
        }
    }, [provinceId, setValue]);

    useEffect(() => {
        setValue('ward', '');
    }, [districtId, setValue]);


    useEffect(() => {
        const address = buildAddressDetail({
            provinceId,
            districtId,
            wardId,
            street,
            houseNumber,
        });

        setValue('address_detail', address);
        setValue('address_detail_display', address)
    }, [provinceId, districtId, wardId, street, houseNumber, setValue]);


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
        (async () => {
            const res = await getCollaboratorsAvailable({ type: CollaboratorType.Owner, field_cooperation: FieldCooperation.Rental });
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


    const onSubmit: SubmitHandler<RentalForm> = async (data) => {
        if (data.address_detail === data.address_detail_display) {
            toast.error('Cần sửa địa chỉ hiển thị');
            return;
        }

        setLoading(true);
        try {
            const { images } = data;

            const createRes = await createRental({
                title: data.title,
                active: data.active,
                address_detail: data.address_detail,
                address_detail_display: data.address_detail_display,
                collaborator_id: data.collaborator_id,
                commission: data.commission,
                description: data.description,
                district: data.district,
                house_number: data.house_number,
                province: data.province,
                rental_type: data.rental_type,
                status: data.status,
                street: data.street,
                ward: data.ward,
                price: data.price ? Number(data.price) : undefined,
                amenities: data.amenities,
                note: data.note,
                area: data.area,
                room_number: data.room_number,
                floor: data.floor ? Number(data.floor) : undefined,
                max_people: data.max_people,
                deposit: data.deposit,
                room_status: data.room_status,
                fee_electric: data.fee_electric,
                fee_water: data.fee_water,
                water_unit: data.water_unit,
                fee_wifi: data.fee_wifi,
                fee_service: data.fee_service,
                fee_parking: data.fee_parking,
                fee_other: data.fee_other,
            });

            if (!createRes?.success) {
                toast.error('Tạo tin thất bại');
                return;
            }

            const roomId = createRes.result?.room?.id;

            if (
                rentalType !== RentalType.BoardingHouse &&
                images?.length &&
                roomId
            ) {
                const hasCover = images.some(img => img.isCover);

                const files = images
                    .filter((img): img is UploadPreview & { file: File } => img.file instanceof File)
                    .map((img, index) => ({
                        file: img.file,
                        is_cover: img.isCover || (index === 0 && !hasCover),
                    }));

                if (!files.length) {
                    toast.error('Chưa có hình ảnh hợp lệ để upload');
                    return;
                }

                const uploadRes = await uploadImages(files, {
                    domain: UploadDomain.Rooms,
                    room_id: roomId,
                });

                if (!uploadRes.success || !uploadRes.result?.length) {
                    toast.error('Upload hình thất bại');
                    return;
                }
            }

            toast.success('Tạo tin cho thuê thành công');
            reset();
        } catch (e) {
            console.error(e);
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm mới thông tin nhà</TitleMain>

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
                        required
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
                        required
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
                                        type='number'
                                        label="Tầng"
                                        placeholder='Để trống nếu tầng trệt'
                                        sx={formGridStyles.fullWidth}
                                    />

                                    <FormTextField
                                        name="room_number"
                                        control={control}
                                        label="Nhà số mấy trong toà nhà (chung cư)"
                                        sx={formGridStyles.fullWidth}
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
