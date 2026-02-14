'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormAutocomplete from '@/components/FormAutocomplete';
import FormImageUpload from '@/components/FormImageUpload';
import FormTextField from '@/components/FormTextField';

import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { formGridStyles } from '@/styles/formGrid';

import { ErrorMessage, FurnitureStatusOptions, GO_VAP_DISTRICT_ID, HouseDirectionOptions, LandTypeLabels, LegalStatusOptions } from '@/common/const';
import { FieldCooperation, FurnitureStatus, HouseDirection, LandType, LegalStatus, UploadDomain } from '@/common/enum';

import useGetCollaboratorsAvailable from '@/hooks/Collaborator/useGetCollaboratorsAvailable';
import useUploadImages from '@/hooks/Upload/uploadImages';

import useCreateLand from '@/hooks/Land/useCreateLand';
import { LandForm, UploadPreview } from '@/types';

import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import {
    buildAddressDetail,
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
} from '@/common/service';

import {
    HCM_PROVINCE_ID,
} from '@/common/const';

import FormTinyMCE from '@/components/FormTinyMCE';
import FormLandAmenityCheckbox from '@/components/Land/FormLandAmenityCheckbox';
import useCheckLinkDaitheky from '@/hooks/Land/useCheckLinkDaitheky';


export default function CreateLandPage() {
    const { createLand } = useCreateLand();
    const { uploadImages } = useUploadImages();
    const { getCollaboratorsAvailable } = useGetCollaboratorsAvailable();
    const { checkLinkDaitheky } = useCheckLinkDaitheky();

    const [loading, setLoading] = useState(false);
    const [collaboratorOptions, setCollaboratorOptions] = useState<any[]>([]);

    const [checkingLink, setCheckingLink] = useState(false);
    const [linkStatus, setLinkStatus] = useState<null | 'exist' | 'not_exist'>(null);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<LandForm>({
        defaultValues: {
            title: '',
            land_type: LandType.Townhouse,
            commission: 'Hoa hồng Tuấn 123',
            price: undefined,
            area: undefined,
            structure: '',
            bedrooms: undefined,
            toilets: undefined,
            province: HCM_PROVINCE_ID,
            district: GO_VAP_DISTRICT_ID,
            ward: '',
            street: '',
            house_number: '',
            address_detail: '',
            address_detail_display: '',
            images: [],
            video_url: '',
            active: true,
            private_note: '',
            daitheky_link: '',
            house_direction: HouseDirection.Updating,
            legal_status: LegalStatus.Updating,
            furniture_status: FurnitureStatus.Updating,
            amenities: [],
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
        if (provinceId !== HCM_PROVINCE_ID) {
            reset(prev => ({
                ...prev,
                district: '',
                ward: '',
            }));
        }
    }, [provinceId, reset]);

    useEffect(() => {
        reset(prev => ({
            ...prev,
            ward: '',
        }));
    }, [districtId]);

    useEffect(() => {
        const address = buildAddressDetail({
            provinceId,
            districtId,
            wardId,
            street,
            houseNumber,
        });

        reset(prev => ({
            ...prev,
            address_detail: address,
            address_detail_display: address,
        }));
    }, [provinceId, districtId, wardId, street, houseNumber]);


    const onSubmit: SubmitHandler<LandForm> = async (data) => {
        if (!data.images?.length) {
            toast.error('Cần ít nhất 1 hình ảnh');
            return;
        }

        setLoading(true);
        try {
            const { images, ...payload } = data;

            const createRes = await createLand({
                collaborator_id: payload.collaborator_id,
                title: payload.title,
                land_type: payload.land_type,

                price: Number(payload.price),
                commission: payload.commission,

                area: payload.area ? Number(payload.area) : undefined,
                structure: payload.structure,
                bedrooms: payload.bedrooms,
                toilets: payload.toilets,
                width_top: payload.width_top,
                width_bottom: payload.width_bottom,
                length_left: payload.length_left,
                length_right: payload.length_right,

                province: payload.province,
                district: payload.district,
                ward: payload.ward,
                street: payload.street,
                house_number: payload.house_number,
                address_detail: payload.address_detail,
                address_detail_display: payload.address_detail_display,

                description: payload.description,
                private_note: payload.private_note,
                video_url: payload.video_url,
                daitheky_link: payload.daitheky_link,

                house_direction: payload.house_direction,
                legal_status: payload.legal_status,
                furniture_status: payload.furniture_status,
                amenities: payload.amenities,

                active: payload.active
            });

            const landId = createRes?.result?.id;

            if (!createRes?.success || !landId) {
                toast.error('Tạo bất động sản thất bại');
                return;
            }

            const hasCover = images.some(img => img.isCover);

            const files = images
                .filter(
                    (img): img is UploadPreview & { file: File } =>
                        img.file instanceof File,
                )
                .map((img, index) => ({
                    file: img.file,
                    is_cover: img.isCover || (!hasCover && index === 0),
                }));

            const uploadRes = await uploadImages(files, {
                domain: UploadDomain.Lands,
                land_id: landId,
            });

            if (!uploadRes?.success) {
                toast.error('Upload hình ảnh thất bại');
                reset();
                return;
            }

            toast.success('Tạo bất động sản thành công');
            reset();
        } catch (error) {
            console.error(error);
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

    const daithekyLink = useWatch({ control, name: 'daitheky_link_check' }) || "";
    const checkDaithekyLink = async (link: string) => {
        if (!link) {
            toast.error('Nhập link trước');
            return;
        }
        setCheckingLink(true);

        try {
            const res = await checkLinkDaitheky(link);
            if (res?.success && res.result === true) {
                setLinkStatus('exist');
            } else {
                setLinkStatus('not_exist');
            }
        } catch {
            toast.error('Không kiểm tra được link');
        } finally {
            setCheckingLink(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm mới bất động sản</TitleMain>

            <CardItem>
                <HeaderRow>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <FormTextField
                            name="daitheky_link_check"
                            control={control}
                            label=""
                            placeholder="Dán link Daitheky để kiểm tra"
                            size="small"
                            rules={{
                                onChange: () => setLinkStatus(null)
                            }}
                            sx={{ width: "400px", margin: "0px" }}
                        />

                        <Button
                            variant="outlined"
                            disabled={checkingLink}
                            onClick={() => checkDaithekyLink(daithekyLink)}
                        >
                            {checkingLink ? '...' : 'Check'}
                        </Button>

                        {linkStatus === 'exist' && (
                            <span style={{ color: 'orange', fontSize: 13 }}>
                                Đã tồn tại
                            </span>
                        )}

                        {linkStatus === 'not_exist' && (
                            <span style={{ color: 'green', fontSize: 13 }}>
                                Chưa có
                            </span>
                        )}
                    </Box>

                    <BackLink href="/land">← Trở về danh sách</BackLink>
                </HeaderRow>

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
                            required
                            disabled
                        />

                        <FormAutocomplete
                            name="district"
                            control={control}
                            label="Quận / Huyện"
                            options={districtOptions}
                            disabled={!provinceId}
                            required
                        />
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
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
                    </Box>

                    <Box sx={formGridStyles.formTwo}>
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
                            disabled
                            required
                        />
                    </Box>

                    <FormTextField
                        name="address_detail_display"
                        control={control}
                        label="Địa chỉ hiển thị"
                        multiline
                        rows={1}
                        required
                    />

                    <Box sx={formGridStyles.formFour}>
                        <FormTextField
                            name="area"
                            control={control}
                            label="Diện tích (m²)"
                            type="number"
                            inputProps={{ min: 1 }}
                        />

                        <FormTextField
                            name="structure"
                            control={control}
                            label="Kết cấu"
                            placeholder="VD: 1 trệt 2 lầu"
                        />

                        <FormTextField
                            name="width_top"
                            control={control}
                            label="Ngang trên"
                            type="number"
                            inputProps={{ min: 1 }}
                        />

                        <FormTextField
                            name="width_bottom"
                            control={control}
                            label="Ngang dưới"
                            type="number"
                            inputProps={{ min: 1 }}
                        />
                    </Box>

                    <Box sx={formGridStyles.formFour}>
                        <FormTextField
                            name="length_left"
                            control={control}
                            label="Dài trái"
                            type="number"
                            inputProps={{ min: 1 }}
                        />

                        <FormTextField
                            name="length_right"
                            control={control}
                            label="Dài phải"
                            type="number"
                            inputProps={{ min: 1 }}
                        />

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
                            required
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
                        <Box sx={formGridStyles.actionLeft}>
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
