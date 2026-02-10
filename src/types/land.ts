import { BaseEntity } from './base.type';
import { FurnitureStatus, HouseDirection, LandAmenity, LandType, LegalStatus } from '@/common/enum';
import { Upload, UploadPreview } from './upload';
import { Collaborator } from './collaborator';

export type Land = BaseEntity & {
    title: string;
    land_code: string;
    slug: string;

    land_type: LandType;

    /**
     * decimal từ backend → string
     */
    price: string;

    area?: number | null;

    structure?: string | null;
    bedrooms?: number | undefined;
    toilets?: number | undefined;
    width_top?: string | null;
    width_bottom?: string | null;
    length_left?: string | null;
    length_right?: string | null;

    // ADDRESS
    province: string;
    district: string;
    ward: string;
    street?: string | null;
    house_number?: string | null;
    address_detail: string;
    address_detail_display: string;

    description: string;

    active: boolean;

    video_url?: string | null;

    uploads?: Upload[];
    collaborator?: Collaborator;

    house_direction?: HouseDirection;
    legal_status?: LegalStatus;
    furniture_status?: FurnitureStatus;
    amenities?: LandAmenity[];
};

export type LandOption = {
    id: string;
    title: string;
    land_code?: string;
};


export type LandForm = {
    collaborator_id?: string;

    title: string;
    land_type: LandType;

    daitheky_link?: string;

    commission?: string;

    price: number;
    area?: number;

    structure?: string;
    bedrooms?: number | undefined;
    toilets?: number | undefined;

    width_top?: number;
    width_bottom?: number;
    length_left?: number;
    length_right?: number;

    province: string;
    district: string;
    ward: string;
    street?: string;
    house_number?: string;
    address_detail: string;
    address_detail_display: string;

    images?: UploadPreview[];
    upload_ids?: string[];
    delete_upload_ids?: string[];
    cover_upload_id?: string;

    description: string;
    private_note?: string;
    video_url?: string;

    amenities?: LandAmenity[];
    house_direction?: HouseDirection | null;
    legal_status?: LegalStatus | null;
    furniture_status?: FurnitureStatus | null;

    active?: boolean;
};
