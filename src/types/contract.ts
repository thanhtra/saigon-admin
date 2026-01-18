import type { BaseEntity } from './base.type';
import { Commission } from './commission';
import type { Rental } from './rental';
import type { Room } from './room';
import { Tenant } from './tenant';



export type Contract = BaseEntity & {
    /* ===== RELATION ===== */
    rental: Rental;
    rental_id: string;

    room?: Room | null;
    room_id?: string | null;

    tenant: Tenant;
    tenant_id: string;

    /* ===== TIME ===== */
    start_date: string;      // ISO string
    end_date?: string | null;

    /* ===== MONEY ===== */
    rent_price: number;
    deposit: number;

    /* ===== EXTRA ===== */
    commission?: Commission | null;
};

export type ContractLite = Pick<
    Contract,
    | 'id'
    | 'rental_id'
    | 'room_id'
    | 'tenant_id'
    | 'start_date'
    | 'end_date'
    | 'rent_price'
    | 'deposit'
>;

export type CreateContractDto = {
    rental_id: string;
    tenant_id: string;
    room_id?: string | null;

    start_date: string;
    end_date?: string | null;

    rent_price: number;
    deposit: number;
};

export type UpdateContractDto = Partial<CreateContractDto>;
