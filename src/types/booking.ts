import { BookingStatus } from '@/common/enum';
import { Room } from './room';
import { BaseEntity } from './base.type';


export type Booking = BaseEntity & {
    rental_id: string;
    room_id: string;
    room: Room;
    customer_name: string;
    customer_phone: string;
    customer_note?: string | null;
    admin_note?: string | null;
    viewing_at: string;
    referrer_phone?: string | null;
    status: BookingStatus;
    is_paid_commission?: boolean;
};


export type CreateBookingInput = {
    room_id: string;
    rental_id: string;
    customer_name: string;
    customer_phone: string;
    viewing_at: string; // ISO UTC
    status?: BookingStatus;
    referrer_phone?: string;
    customer_note?: string;
    admin_note?: string;
};

export type UpdateBookingInput = Partial<CreateBookingInput> & {
    status?: BookingStatus;
};


export type CreateBookingForm = {
    room_id: string;
    rental_id: string;
    customer_name: string;
    customer_phone: string;
    referrer_phone?: string;
    customer_note?: string;
    admin_note?: string;
    viewing_at: string; // local datetime-local
    status: BookingStatus;
};
