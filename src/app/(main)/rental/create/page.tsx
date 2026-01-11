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
} from '@/common/const';
import { CollaboratorType, FieldCooperation, RentalStatus, RentalType, UploadDomain } from '@/common/enum';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions
} from '@/common/service';
import { Option, RentalInput, UploadPreview } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';

import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormImageUpload from '@/components/FormImageUpload';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCreateRental from '@/hooks/Rental/useCreateRental';
import useUploadImages from '@/hooks/Upload/uploadImages';
import { Controller } from 'react-hook-form';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';



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
    } = useForm<RentalInput>({
        defaultValues: {
            title: '',
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
            commission_value: '',
            images: [],
            price: undefined,
            description_detail: '',
            floor: undefined,
            area: undefined,
            room_number: '',
            status: RentalStatus.New
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


    const onSubmit: SubmitHandler<RentalInput> = async (data) => {
        if (data.address_detail === data.address_detail_display) {
            toast.error('Cần sửa địa chỉ hiển thị');
            return;
        }

        setLoading(true);
        try {
            const { images, ...payload } = data;

            const createRes = await createRental({
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
            }

            toast.success('Tạo tin cho thuê thành công');
            reset({});
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
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
