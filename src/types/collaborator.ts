import type { BaseEntity } from './base.type';
import type { CollaboratorType, FieldCooperation } from '@/common/enum';
import type { User } from './user';
import type { Rental } from './rental';


export type Collaborator = BaseEntity & {
    type: CollaboratorType;
    note?: string | null;
    field_cooperation: FieldCooperation;
    active: boolean;

    user: User;
    user_id: string;

    rentals: Rental[];

    is_blacklisted: boolean;
    blacklist_reason?: string | null;
    blacklisted_at?: string | null; // ISO string
};


export type CollaboratorLite = Pick<
    Collaborator,
    | 'id'
    | 'type'
    | 'field_cooperation'
    | 'active'
    | 'user_id'
    | 'is_blacklisted'
>;

export type CollaboratorWithUser = Collaborator & {
    user: Pick<User, 'id' | 'name' | 'phone' | 'email' | 'active'>;
};

export type CreateCollaboratorDto = {
    user_id: string;
    type: CollaboratorType;
    field_cooperation: FieldCooperation;
    note?: string;
};

export type UpdateCollaboratorDto = Partial<
    Pick<
        Collaborator,
        | 'type'
        | 'field_cooperation'
        | 'note'
        | 'active'
        | 'is_blacklisted'
        | 'blacklist_reason'
    >
>;

export type BlacklistCollaboratorDto = {
    is_blacklisted: true;
    blacklist_reason: string;
};

export type CollaboratorTypeForm = {
    user_id: string;
    type: CollaboratorType;
    field_cooperation: FieldCooperation;
    note?: string;
    active: boolean;
};

