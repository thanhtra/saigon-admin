import { User, UserRole } from '@/types/user';

export const USER_DEFAULT_VALUES: User = {
    name: '',
    phone: '',
    password: '',
    email: '',
    role: UserRole.Tenant,
    note: '',
    active: true,
};
