import type { BaseEntity } from './base.type';
import type { Room } from './room';

import {
    RentalAmenity,
    RentalStatus,
    RentalType,
    RoomStatus,
} from '@/common/enum';
import { User } from './user';
import { Collaborator } from './collaborator';
import { UploadPreview } from './upload';


export interface Rental extends BaseEntity {
    collaborator_id: string;
    created_by: string;
    collaborator?: Collaborator
    createdBy?: User
    rooms?: Room[];

    /** BUSINESS */
    rental_type: RentalType;
    commission?: string;
    note?: string;
    status: RentalStatus;
    active: boolean;

    /** ADDRESS */
    province: string;
    district: string;
    ward: string;
    street?: string;
    house_number?: string;
    address_detail: string;
    address_detail_display: string;

    /** FEES */
    fee_electric?: number;
    fee_water?: number;
    fee_wifi?: number;
    fee_service?: number;
    fee_parking?: number;
    fee_other?: string;
}


export type RentalForm = {

    /** BUSINESS */
    collaborator_id: string;
    rental_type: RentalType;
    commission?: string;
    note?: string;
    status: RentalStatus;
    active: boolean;

    /** ADDRESS */
    province: string;
    district: string;
    ward: string;
    street?: string;
    house_number?: string;
    address_detail: string;
    address_detail_display: string;

    /** FEES */
    fee_electric?: number;
    fee_water?: number;
    fee_wifi?: number;
    fee_service?: number;
    fee_parking?: number;
    fee_other?: string;

    // ROOM
    title?: string;
    price?: number | undefined;
    deposit?: number | undefined;
    max_people?: number | undefined;
    floor?: number;
    area?: number | undefined;
    room_number?: string;
    amenities?: RentalAmenity[];
    description?: string;
    room_status?: RoomStatus;
    water_unit?: string;

    images?: UploadPreview[];   // 👉 chỉ dùng ở UI
    upload_ids?: string[];      // 👉 chỉ gửi backend

}