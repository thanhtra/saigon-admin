import type { BaseEntity } from './base.type';
import type { CommissionStatus } from '@/common/enum';
import type { Contract } from './contract';
import type { User } from './user';

export type Commission = BaseEntity & {
    /* ===== RELATION ===== */
    contract: Contract;
    contract_id: string;

    sale: User;
    sale_id: string;

    /* ===== DATA ===== */
    amount: number;
    status: CommissionStatus;
};

export type CommissionWithRelation = Commission & {
    sale: Pick<User, 'id' | 'name' | 'phone'>;
    contract: Pick<Contract, 'id' | 'rent_price' | 'start_date'>;
};

export type CreateCommissionDto = {
    contract_id: string;
    sale_id: string;
    amount: number;
};

export type UpdateCommissionStatusDto = {
    status: CommissionStatus;
};
