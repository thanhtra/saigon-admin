'use client';

import {
    BackLink,
    CardItem,
    HeaderRowOneItem,
    TitleMain,
} from '@/styles/common';
import { Box, Button, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';
import FormTinyMCE from '@/components/FormTinyMCE';

import { ErrorMessage, FurnitureStatusOptions, GO_VAP_DISTRICT_ID, HouseDirectionOptions, LandTypeLabels, LegalStatusOptions } from '@/common/const';
import { FieldCooperation, FurnitureStatus, HouseDirection, LandType, LegalStatus } from '@/common/enum';
import { normalizeLandImagesPayload } from '@/common/page.service';
import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
    resolveUploadUrl,
} from '@/common/service';

import { formGridStyles } from '@/styles/formGrid';

import useGetLandDetail from '@/hooks/Land/useGetLandDetail';
import useUpdateLand from '@/hooks/Land/useUpdateLand';
import useUploadImages from '@/hooks/Upload/uploadImages';

import { HCM_PROVINCE_ID } from '@/common/const';
import { LandForm, UploadPreview } from '@/types';
import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import FormLandAmenityCheckbox from '@/components/Land/FormLandAmenityCheckbox';

export default function EditLandPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getLandDetail } = useGetLandDetail();
    const { updateLand } = useUpdateLand();
    const { uploadImages } = useUploadImages();
    const { getCollaboratorsAvailable } = useGetCollaboratorsAvailable();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [originalUploadIds, setOriginalUploadIds] = useState<string[]>([]);
    const [collaboratorOptions, setCollaboratorOptions] = useState<any[]>([]);
    const isInitialLoadRef = useRef(true);
    const isDisplayManuallyEditedRef = useRef(false);


    const { control, handleSubmit, reset } = useForm<LandForm>({
        shouldUnregister: false,
        defaultValues: {
            province: HCM_PROVINCE_ID,
            district: GO_VAP_DISTRICT_ID,
            images: [],
            active: true,
        },
    });

    const provinceId = useWatch({ control, name: 'province' });
    const districtId = useWatch({ control, name: 'district' });
    const wardId = useWatch({ control, name: 'ward' });
    const street = useWatch({ control, name: 'street' });
    const houseNumber = useWatch({ control, name: 'house_number' });

    useEffect(() => {
        (async () => {
            const res = await getCollaboratorsAvailable({
                field_cooperation: FieldCooperation.Land,
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

            const res = await getLandDetail(id);
            if (!res?.success) {
                toast.error('Không tìm thấy bất động sản');
                router.push('/land');
                return;
            }

            const land = res.result;
            const uploads = land.uploads ?? [];

            setOriginalUploadIds(uploads.map((u: any) => u.id));

            reset({
                collaborator_id: land.collaborator_id,
                commission: land.commission ?? '',
                land_type: land.land_type,
                title: land.title,
                price: Number(land.price),
                area: land.area ?? undefined,
                structure: land.structure ?? '',
                bedrooms: land.bedrooms,
                toilets: land.toilets,
                width_top: land.width_top ?? undefined,
                width_bottom: land.width_bottom ?? undefined,
                length_left: land.length_left ?? undefined,
                length_right: land.length_right ?? undefined,

                province: land.province,
                district: land.district,
                ward: land.ward,
                street: land.street ?? '',
                house_number: land.house_number ?? '',
                address_detail: land.address_detail,
                address_detail_display: land.address_detail_display,

                description: land.description ?? '',
                private_note: land.private_note ?? '',
                video_url: land.video_url ?? '',
                daitheky_link: land.daitheky_link ?? '',
                active: land.active,

                house_direction: land.house_direction,
                legal_status: land.legal_status,
                furniture_status: land.furniture_status,
                amenities: land.amenities,

                images: uploads.map((u: any) => ({
                    id: u.id,
                    preview: resolveUploadUrl(u.file_path),
                    isCover: u.is_cover === true,
                    isExisting: true,
                })) as UploadPreview[],
            });

            isInitialLoadRef.current = false;
            setPageLoading(false);
        })();
    }, [id, getLandDetail, reset, router]);

    const addressDisplay = useWatch({
        control,
        name: 'address_detail_display',
    });

    useEffect(() => {
        if (isInitialLoadRef.current) return;

        isDisplayManuallyEditedRef.current = true;
    }, [addressDisplay]);

    useEffect(() => {
        if (isInitialLoadRef.current) return;

        const autoAddress = buildAddressDetail({
            provinceId,
            districtId,
            wardId,
            street,
            houseNumber,
        });

        reset(prev => ({
            ...prev,

            address_detail: autoAddress,

            address_detail_display: isDisplayManuallyEditedRef.current
                ? prev.address_detail_display
                : autoAddress,
        }));
    }, [provinceId, districtId, wardId, street, houseNumber]);


    const onSubmit: SubmitHandler<LandForm> = async (data) => {
        setLoading(true);
        try {
            if (data.address_detail === data.address_detail_display) {
                toast.error("Cần sửa địa chỉ hiển thị");
                return;
            }

            if (!data.images?.length) {
                toast.error("Cần tải ít nhất 1 hình");
                return;
            }

            const { images, ...payload } = data;

            const {
                upload_ids,
                delete_upload_ids,
                cover_upload_id,
            } = await normalizeLandImagesPayload({
                images: data.images ?? [],
                uploadImages,
                landId: id,
                originalUploadIds,
            });

            const res = await updateLand(id, {
                ...payload,
                price: Number(payload.price),
                area: payload.area ? Number(payload.area) : undefined,
                upload_ids,
                delete_upload_ids,
                cover_upload_id,
            });

            if (!res?.success) {
                toast.error('Cập nhật bất động sản thất bại');
                return;
            }

            toast.success('Cập nhật bất động sản thành công');
            router.push('/land');
        } catch (e) {
            console.error(e);
            toast.error(ErrorMessage.SYSTEM);
        } finally {
            setLoading(false);
        }
    };

    const provinceOptions = useMemo(() => getProvinceOptions(), []);
    const districtOptions = useMemo(
        () => getDistrictOptions(provinceId),
        [provinceId],
    );
    const wardOptions = useMemo(
        () => getWardOptions(provinceId, districtId),
        [provinceId, districtId],
    );

    if (pageLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TitleMain>Chỉnh sửa bất động sản</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackLink href="/land">← Trở về danh sách</BackLink>
                </HeaderRowOneItem>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={formGridStyles.form}
                >
                    <Box sx={formGridStyles.formTwo}>
                        <FormAutocomplete
                            name="collaborator_id"
                            control={control}
                            label="Cộng tác"
                            options={[
                                { label: '-- Chọn cộng tác --', value: '' },
                                ...collaboratorOptions,
                            ]}
                            required
                        />

                        <FormTextField
                            name="commission"
                            control={control}
                            label="Hoa hồng"
                            placeholder='3%'
                        />
                    </Box>

                    <FormTextField
                        name="land_type"
                        control={control}
                        label="Loại bất động sản"
                        options={Object.entries(LandTypeLabels).map(([key, label]) => ({
                            value: key as LandType, // ENUM
                            label,                  // TEXT
                        }))}
                        required
                    />

                    <FormTextField
                        name="title"
                        control={control}
                        label="Tiêu đề"
                        required
                        sx={formGridStyles.fullWidth}
                    />

                    <Box sx={formGridStyles.formTwo}>
                        <FormAutocomplete
                            name="province"
                            control={control}
                            label="Tỉnh / Thành phố"
                            options={provinceOptions}
                            disabled
                        />

                        <FormAutocomplete
                            name="district"
                            control={control}
                            label="Quận / Huyện"
                            options={districtOptions}
                            required
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormAutocomplete
                            name="ward"
                            control={control}
                            label="Phường / Xã"
                            options={wardOptions}
                            required
                        />

                        <FormTextField
                            name="street"
                            control={control}
                            label="Đường / Phố"
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormTextField
                            name="house_number"
                            control={control}
                            label="Số nhà"
                        />

                        <FormTextField
                            name="address_detail"
                            control={control}
                            label="Địa chỉ"
                            disabled
                        />
                    </Box>

                    <FormTextField
                        name="address_detail_display"
                        control={control}
                        label="Địa chỉ hiển thị"
                    />

                    <Box sx={formGridStyles.formFour}>
                        <FormTextField name="area" control={control} label="Diện tích (m²)" type="number" />
                        <FormTextField
                            name="structure"
                            control={control}
                            label="Kết cấu"
                        />
                        <FormTextField name="width_top" control={control} label="Ngang trên" type="number" />
                        <FormTextField name="width_bottom" control={control} label="Ngang dưới" type="number" />
                    </Box>

                    <Box sx={formGridStyles.formFour}>
                        <FormTextField name="length_left" control={control} label="Dài trái" type="number" />
                        <FormTextField name="length_right" control={control} label="Dài phải" type="number" />

                        <FormTextField
                            name="price"
                            control={control}
                            label="Giá"
                            type="number"
                            inputProps={{ min: 1 }}
                            required
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormTextField
                            name="daitheky_link"
                            control={control}
                            label="Link nhà Daitheky"
                            placeholder='https://tuan123.daitheky.net/bi-kip/bi-kip-cong-ty/f1ca890bc3158a1d8679cedef7a8394d2e445dc7'
                        />

                        <FormTextField
                            name="video_url"
                            control={control}
                            label="Link video"
                            placeholder="https://youtube.com/shorts/xRhWG6O87y4?si=ulD0wWjF34357RSZ"
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormTextField
                            name="bedrooms"
                            control={control}
                            label="Số phòng ngủ"
                            type="number"
                            inputProps={{ min: 0 }}
                        />
                        <FormTextField
                            name="toilets"
                            control={control}
                            label="Số WC"
                            type="number"
                            inputProps={{ min: 0 }}
                        />
                    </Box>

                    <Box sx={formGridStyles.fullWidth}>
                        <FormTinyMCE
                            name="description"
                            control={control}
                            label="Mô tả chi tiết"
                            height={500}
                        />
                    </Box>

                    <Box sx={formGridStyles.fullWidth}>
                        <FormTinyMCE
                            name="private_note"
                            control={control}
                            label="Lưu ý"
                            height={300}
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormTextField
                            name="house_direction"
                            control={control}
                            label="Hướng nhà"
                            options={Object.entries(HouseDirectionOptions).map(([key, label]) => ({
                                value: key as HouseDirection,
                                label,
                            }))}
                        />

                        <FormTextField
                            name="legal_status"
                            control={control}
                            label="Pháp lý"
                            options={Object.entries(LegalStatusOptions).map(([key, label]) => ({
                                value: key as LegalStatus,
                                label,
                            }))}
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
                        <FormTextField
                            name="furniture_status"
                            control={control}
                            label="Nội thất"
                            options={Object.entries(FurnitureStatusOptions).map(([key, label]) => ({
                                value: key as FurnitureStatus,
                                label,
                            }))}
                        />
                    </Box>

                    <Box
                        sx={{
                            gridColumn: 'span 2',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 2,
                        }}
                    >
                        <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                                <FormImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="Hình ảnh bất động sản"
                                />
                            )}
                        />

                        <FormLandAmenityCheckbox
                            name="amenities"
                            control={control}
                        />
                    </Box>

                    <Box sx={formGridStyles.actionRow}>
                        <Box />

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
