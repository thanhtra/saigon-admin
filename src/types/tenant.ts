import type { BaseEntity } from './base.type';
import type { User } from './user';
import type { Contract } from './contract';

export type Tenant = BaseEntity & {
    /* ===== RELATION ===== */
    user: User;
    user_id: string;

    contracts: Contract[];

    /* ===== VIRTUAL / AGG ===== */
    contractCount?: number;

    /* ===== DATA ===== */
    note?: string;
    active: boolean;
};

export type TenantWithUser = Tenant & {
    user: Pick<
        User,
        'id' | 'name' | 'phone' | 'email' | 'zalo'
    >;
};

export type CreateTenantDto = {
    user_id: string;
    note?: string;
};

export type UpdateTenantDto = {
    note?: string;
    active?: boolean;
};
