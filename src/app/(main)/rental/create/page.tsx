'use client';

import FormTextField from '@/components/FormTextField';
import ControlledSwitch from '@/components/ControlledSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';

import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Box, Button } from '@mui/material';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';

import { RentalInput, UploadPreview } from '@/common/type';
import { RentalType } from '@/common/enum';
import {
    GO_VAP_DISTRICT_ID,
    HCM_PROVINCE_ID,
    isUnitRental,
    RentalTypeLabels,
} from '@/common/const';
import { formGridStyles } from '@/styles/formGrid';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
    mapCollaboratorOptions,
} from '@/common/service';

import FormAmenityCheckbox from '@/components/FormAmenityCheckbox';
import useUploadImages from '@/hooks/Upload/uploadImages';
import useCreateRental from '@/hooks/Rental/useCreateRental';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import { Controller } from 'react-hook-form';
import FormImageUpload from '@/components/FormImageUpload';



export default function CreateRental() {
    const { createRental } = useCreateRental();
    const { getCollaborators } = useGetCollaborators();
    const { uploadImages } = useUploadImages();


    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<
        { label: string; value: string }[]
    >([]);

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
            const res = await getCollaborators();
            if (res?.success) {
                const coll = mapCollaboratorOptions(res.result.data);
                setCollaboratorOptions(coll);
            }
        })();
    }, [getCollaborators]);


    const onSubmit: SubmitHandler<RentalInput> = async (data) => {
        if (data.address_detail === data.address_detail_display) {
            toast.error('Cần sửa địa chỉ hiển thị');
            return;
        }

        setLoading(true);
        try {
            let uploadIds = [];
            let coverIndex = undefined;

            if (rentalType !== RentalType.BoardingHouse) {
                if (!data.images?.length) {
                    toast.error('Vui lòng upload ít nhất 1 hình');
                    return;
                }

                const uploadRes = await uploadImages(
                    data.images.map(i => i.file),
                );

                if (!uploadRes.success || !uploadRes.result?.length) {
                    toast.error('Upload hình thất bại');
                    return;
                }

                uploadIds = uploadRes.result.map((u: any) => u.id);
                coverIndex =
                    data.images.findIndex(i => i.isCover) >= 0
                        ? data.images.findIndex(i => i.isCover)
                        : 0;
            }

            const res = await createRental({
                ...data,
                price: Number(data.price),
                upload_ids: uploadIds,
                cover_index: coverIndex,
            });

            if (res?.success) {
                toast.success('Tạo tin cho thuê thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo thất bại');
            }
        } catch (e) {
            console.error(e);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm mới thông tin nhà</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackLink href="/rental">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

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


                    <FormTextField
                        name="collaborator_id"
                        control={control}
                        label="Chủ nhà"
                        options={[
                            { label: '-- Chọn chủ nhà --', value: '' },
                            ...collaboratorOptions,
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
