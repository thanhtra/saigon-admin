'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';

import { BackLink, CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { Box, Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
    ErrorMessage,
    GO_VAP_DISTRICT_ID,
    HCM_PROVINCE_ID,
    isUnitRental,
    RentalTypeLabels,
} from '@/common/const';
import { RentalType } from '@/common/enum';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
    mapCollaboratorOptions,
} from '@/common/service';
import { RentalInput, UploadPreview } from '@/common/type';
import { formGridStyles } from '@/styles/formGrid';

import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useGetRentalDetail from '@/hooks/Rental/useGetRentalDetail';
import useUpdateRoom from '@/hooks/Room/useUpdateRoom';
import useUploadImages from '@/hooks/Upload/uploadImages';


export default function UpdateRental() {
    const { roomId } = useParams();
    const router = useRouter();

    const { getRentalDetail } = useGetRentalDetail();
    const { getCollaborators } = useGetCollaborators();
    const { updateRoom } = useUpdateRoom();
    const { uploadImages } = useUploadImages();

    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<{ label: string; value: string }[]>([]);

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
            room_number: ''
        },
    });

    const provinceId = useWatch({ control, name: 'province' });
    const districtId = useWatch({ control, name: 'district' });
    const wardId = useWatch({ control, name: 'ward' });
    const street = useWatch({ control, name: 'street' });
    const houseNumber = useWatch({ control, name: 'house_number' });
    const rentalType = useWatch({ control, name: 'rental_type' });

    // Load dữ liệu hiện tại
    useEffect(() => {
        if (!roomId) return;

        (async () => {
            try {
                const res = await getRentalDetail(roomId);
                if (res?.success) {
                    const room = res.result;
                    reset({
                        title: room.title,
                        rental_type: room.rental_type,
                        province: room.province,
                        district: room.district,
                        ward: room.ward,
                        street: room.street,
                        house_number: room.house_number,
                        address_detail: room.address_detail,
                        address_detail_display: room.address_detail_display,
                        active: room.active,
                        description: room.description,
                        commission_value: room.commission_value,
                        images: room.images || [],
                        price: room.price,
                        description_detail: room.description_detail,
                        floor: room.floor,
                        area: room.area,
                        room_number: room.room_number,
                        collaborator_id: room.collaborator_id,
                        amenities: room.amenities || [],
                    });
                } else {
                    toast.error('Không thể load thông tin nhà');
                    router.back();
                }
            } catch (error) {
                console.error(error);
                toast.error(ErrorMessage.SYSTEM);
                router.back();
            }
        })();
    }, [roomId, getRentalDetail, reset, router]);

    // Load collaborator
    useEffect(() => {
        (async () => {
            const res = await getCollaborators();
            if (res?.success) {
                setCollaboratorOptions(mapCollaboratorOptions(res.result.data));
            }
        })();
    }, [getCollaborators]);

    // Reset dependent selects
    useEffect(() => {
        if (provinceId !== HCM_PROVINCE_ID) setValue('district', '');
    }, [provinceId, setValue]);

    useEffect(() => {
        setValue('ward', '');
    }, [districtId, setValue]);

    // Build address detail
    useEffect(() => {
        const address = buildAddressDetail({
            provinceId,
            districtId,
            wardId,
            street,
            houseNumber,
        });
        setValue('address_detail', address);
        setValue('address_detail_display', address);
    }, [provinceId, districtId, wardId, street, houseNumber, setValue]);

    const provinceOptions = useMemo(() => getProvinceOptions(), []);
    const districtOptions = useMemo(() => getDistrictOptions(provinceId), [provinceId]);
    const wardOptions = useMemo(() => getWardOptions(provinceId, districtId), [provinceId, districtId]);

    // Submit handler
    const onSubmit: SubmitHandler<RentalInput> = async (data) => {
        if (!roomId) return;

        setLoading(true);
        try {
            const { images, ...payload } = data;

            const updateRes = await updateRoom(roomId, {
                ...payload,
                price: payload.price ? Number(payload.price) : undefined,
            });

            if (!updateRes?.success) {
                toast.error('Cập nhật thất bại');
                return;
            }

            // Upload hình nếu có
            if (images?.length) {
                const uploadRes = await uploadImages(
                    images.map(i => i.file),
                    {
                        domain: 'rooms',
                        room_id: roomId,
                    }
                );

                if (!uploadRes.success || !uploadRes.result?.length) {
                    toast.error('Upload hình thất bại');
                    return;
                }

                const uploadIds = uploadRes.result.map(u => u.id);
                const coverIndex = images.findIndex(i => i.isCover) >= 0 ? images.findIndex(i => i.isCover) : 0;

                await updateRoom(roomId, {
                    upload_ids: uploadIds,
                    cover_index: coverIndex,
                });
            }

            toast.success('Cập nhật thành công!');
        } catch (error) {
            console.error(error);
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật thông tin nhà</TitleMain>

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
                    {/* Province/District/Ward */}
                    <FormAutocomplete name="province" control={control} label="Tỉnh / Thành phố" options={provinceOptions} required />
                    <FormAutocomplete name="district" control={control} label="Quận / Huyện" options={districtOptions} disabled={!provinceId} required />
                    <FormAutocomplete name="ward" control={control} label="Phường / Xã" options={wardOptions} disabled={!districtId} required />

                    <FormTextField name="street" control={control} label="Đường / Phố" required />
                    <FormTextField name="house_number" control={control} label="Số nhà" required />
                    <FormTextField name="address_detail" control={control} label="Địa chỉ" multiline rows={1} required disabled />
                    <FormTextField name="commission_value" control={control} label="Giá trị hoa hồng" multiline required />
                    <FormTextField name="address_detail_display" control={control} label="Địa chỉ hiển thị" multiline rows={1} required />
                    <FormTextField name="description" control={control} label="Mô tả tổng quan căn nhà" multiline rows={5} sx={formGridStyles.fullWidth} />

                    <FormTextField
                        name="rental_type"
                        control={control}
                        label="Loại hình cho thuê"
                        options={[
                            { label: '-- Chọn loại hình --', value: '' },
                            ...Object.entries(RentalTypeLabels).map(([value, label]) => ({ label, value })),
                        ]}
                        required
                    />

                    <FormTextField
                        name="collaborator_id"
                        control={control}
                        label="Chủ nhà"
                        options={[{ label: '-- Chọn chủ nhà --', value: '' }, ...collaboratorOptions]}
                        required
                    />

                    {isUnitRental(rentalType) && (
                        <>
                            <FormTextField name="title" control={control} label="Tiêu đề" required sx={formGridStyles.fullWidth} />
                            <FormTextField name="price" control={control} label="Giá thuê" type="number" required />
                            <FormTextField name="area" control={control} label="Diện tích" type="number" />

                            {rentalType === RentalType.Apartment && (
                                <>
                                    <FormTextField name="floor" control={control} label="Tầng" type="number" required />
                                    <FormTextField name="room_number" control={control} label="Nhà số mấy trong toà nhà (chung cư)" />
                                </>
                            )}

                            <Box sx={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'flex-start' }}>
                                <FormAmenityCheckbox name="amenities" control={control} />
                                <Controller
                                    name="images"
                                    control={control}
                                    defaultValue={[] as UploadPreview[]}
                                    render={({ field }) => (
                                        <FormImageUpload value={field.value} onChange={field.onChange} label="Upload hình" />
                                    )}
                                />
                            </Box>

                            <FormTextField name="description_detail" control={control} label="Mô tả chi tiết căn nhà cho thuê" multiline rows={6} sx={formGridStyles.fullWidth} />
                        </>
                    )}

                    <Box sx={formGridStyles.actionRow}>
                        <ControlledSwitch name="active" control={control} label="Kích hoạt" />
                        <Button type="submit" variant="contained" disabled={loading} sx={formGridStyles.submitButton}>
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
