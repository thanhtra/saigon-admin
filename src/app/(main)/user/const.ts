import { UserRole } from "@/common/enum";
import { User } from "@/common/type";


export const USER_DEFAULT_VALUES: User = {
    name: '',
    phone: '',
    password: '',
    email: '',
    role: UserRole.Tenant,
    note: '',
    active: true,
};
