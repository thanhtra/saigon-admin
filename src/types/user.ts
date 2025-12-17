import { Commission } from "./commission";


export enum UserRole {
    Admin = 'admin_saigon',
    Sale = 'sale_saigon',
    Owner = 'owner',    // chủ nhà
    Broker = 'broker',  // môi giới
    Tenant = 'tenant'
}

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Người bán hàng',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};

export interface User {
    id?: string;
    name: string;
    phone: string;
    password?: string;
    cccd?: string;
    email?: string;
    link_facebook?: string;
    zalo?: string;
    role?: UserRole;
    note?: string;
    address?: string;
    active?: boolean;
}

