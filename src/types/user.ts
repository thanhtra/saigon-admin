import type { BaseEntity } from './base.type';
import type { Rental } from './rental';
import { UserRole } from '@/common/enum';

export type User = BaseEntity & {
    /* ===== AUTH ===== */
    role: UserRole;

    /* ===== BASIC INFO ===== */
    name: string;
    phone: string;
    email?: string | null;

    /* ===== STATUS ===== */
    active: boolean;
    password_version: number;

    /* ===== CONTACT ===== */
    zalo?: string | null;
    link_facebook?: string | null;

    /* ===== EXTRA ===== */
    address?: string | null;
    note?: string | null;

    /* ===== RELATION ===== */
    createdRentals?: Rental[];
};

export type UserLite = Pick<
    User,
    | 'id'
    | 'name'
    | 'phone'
    | 'email'
    | 'role'
    | 'active'
    | 'zalo'
    | 'link_facebook'
>;

export type AuthUser = Pick<
    User,
    | 'id'
    | 'name'
    | 'phone'
    | 'role'
    | 'active'
>;

export type CreateUserDto = {
    name: string;
    phone: string;
    email?: string | null;
    role?: UserRole;
    active?: boolean;

    zalo?: string | null;
    link_facebook?: string | null;
    address?: string | null;
    note?: string | null;
};

export type UpdateUserDto = Partial<CreateUserDto>;
