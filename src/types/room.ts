import { BaseEntity } from './base.type';
import { RoomStatus, RentalAmenity } from '@/common/enum';
import { Upload, UploadPreview } from './upload';
import { Rental } from './rental';

export type Room = BaseEntity & {
    title: string;
    room_code: string;
    slug: string;

    floor?: number;
    room_number?: string | null;

    /**
     * decimal từ backend → string
     */
    price: string;

    area?: number | null;
    max_people?: number | null;

    status: RoomStatus;
    description: string;

    active: boolean;

    rental_id: string;

    cover_index?: number;

    amenities?: RentalAmenity[];

    /**
     * relations (tuỳ API)
     */
    uploads?: Upload[];
    rental?: Rental;
};


export type RoomLite = Pick<
    Room,
    | 'id'
    | 'title'
    | 'room_code'
    | 'floor'
    | 'room_number'
    | 'price'
    | 'area'
    | 'max_people'
    | 'description'
    | 'amenities'
>;


export type RoomOption = {
    id: string;
    rental_id: string;
    title: string;
    room_code?: string;
};

export type RoomForm = {
    rental_id: string;
    collaborator_id?: string;
    title: string;
    floor?: number;
    room_number?: string;
    price: number;
    area?: number;
    max_people?: number;
    status: string;
    images?: UploadPreview[];
    amenities: RentalAmenity[];
    cover_index?: number;
    upload_ids?: string[];
    description: string;
    active?: boolean;
    delete_upload_ids?: string[];
}
