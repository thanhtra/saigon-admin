'use client';

import FormTextField from '@/components/FormTextField';
import ControlledSwitch from '@/components/ControlledSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';

import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Box, Button } from '@mui/material';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';

import useCreateRental from '@/hooks/Rental/useCreateRental';
import { RentalInput } from '@/common/type';
import { RentalType } from '@/common/enum';
import {
    GO_VAP_DISTRICT_ID,
    HCM_PROVINCE_ID,
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
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';

export default function CreateRental() {
    const { createRental } = useCreateRental();
    const { getCollaborators } = useGetCollaborators();

    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<
        { label: string; value: string }[]
    >([]);

    /* ================= FORM ================= */
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
            price: undefined,
            active: true,
            description: '',
            commission_value: ''
        },
    });

    /* ================= WATCH ================= */
    const provinceId = useWatch({ control, name: 'province' });
    const districtId = useWatch({ control, name: 'district' });
    const wardId = useWatch({ control, name: 'ward' });
    const street = useWatch({ control, name: 'street' });
    const houseNumber = useWatch({ control, name: 'house_number' });

    /* ================= RESET CASCADE ================= */
    useEffect(() => {
        if (provinceId !== HCM_PROVINCE_ID) {
            setValue('district', '');
            setValue('ward', '');
        }
    }, [provinceId, setValue]);

    useEffect(() => {
        setValue('ward', '');
    }, [districtId, setValue]);

    /* ================= AUTO BUILD ADDRESS ================= */
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

    /* ================= OPTIONS (CACHE) ================= */
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
                setCollaboratorOptions(mapCollaboratorOptions(res.result.data));
            }
        })();
    }, [getCollaborators]);


    /* ================= SUBMIT ================= */
    const onSubmit: SubmitHandler<RentalInput> = async (data) => {
        setLoading(true);
        try {
            if (data.address_detail === data.address_detail_display) {
                toast.error("Cần sửa địa chỉ hiển thị");
                return;
            }

            const res = await createRental(data);
            if (res?.success) {
                toast.success('Tạo tin cho thuê thành công!');
                reset();
            } else {
                toast.error(res?.message || 'Tạo thất bại');
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */
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
                    {/* ===== THÔNG TIN CƠ BẢN ===== */}
                    <FormTextField
                        name="title"
                        control={control}
                        label="Tiêu đề"
                        required
                        sx={formGridStyles.fullWidth}
                    />

                    {/* ===== ĐỊA CHỈ ===== */}
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
                        label="Địa chỉ đầy đủ"
                        multiline
                        rows={1}
                        required
                        disabled
                    />

                    <FormTextField
                        name="price"
                        control={control}
                        label="Giá thuê"
                        type="number"
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
                        name="commission_value"
                        control={control}
                        label="Giá trị hoa hồng"
                        multiline
                        rows={3}
                        required
                    />


                    {/* ===== MÔ TẢ ===== */}
                    <FormTextField
                        name="description"
                        control={control}
                        label="Mô tả"
                        multiline
                        rows={3}
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


                    {/* ===== TRẠNG THÁI ===== */}
                    <ControlledSwitch
                        name="active"
                        control={control}
                        label="Kích hoạt"
                    />

                    {/* ===== SUBMIT ===== */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, width: 200 }}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Box>
                </Box>
            </CardItem>
        </>
    );
}
