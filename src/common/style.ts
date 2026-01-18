import { BookingStatus, CollaboratorType, FieldCooperation, RentalStatus, RoomStatus, UserRole } from '@/common/enum';


export const BookingStatusTagStyles: Record<
    BookingStatus,
    {
        color: string;
        background: string;
    }
> = {
    [BookingStatus.Pending]: {
        color: '#D48806',      // amber-7
        background: '#FFF7E6', // amber-1
    },
    [BookingStatus.Confirmed]: {
        color: '#0958D9',      // blue-7
        background: '#E6F4FF', // blue-1
    },
    [BookingStatus.Completed]: {
        color: '#389E0D',      // green-7
        background: '#F6FFED', // green-1
    },
    [BookingStatus.Cancelled]: {
        color: '#CF1322',      // red-7
        background: '#FFF1F0', // red-1
    },
    [BookingStatus.NoShow]: {
        color: '#595959',      // gray-7
        background: '#FAFAFA', // gray-1
    },
};


export const RentalStatusTagStyles: Record<
    RentalStatus,
    { color: string; background: string }
> = {
    [RentalStatus.New]: {
        color: '#0958d9',
        background: '#e6f4ff',
    },
    [RentalStatus.Confirmed]: {
        color: '#237804',
        background: '#f6ffed',
    },
    [RentalStatus.Update]: {
        color: '#ad6800',
        background: '#fff7e6',
    },
    [RentalStatus.Cancelled]: {
        color: '#a8071a',
        background: '#fff1f0',
    },
};


export const RoomStatusTagStyles: Record<
    RoomStatus,
    { color: string; background: string }
> = {
    [RoomStatus.PendingApproval]: {
        color: '#ad6800',
        background: '#fff7e6',
    },
    [RoomStatus.Available]: {
        color: '#237804',
        background: '#f6ffed',
    },
    [RoomStatus.Rented]: {
        color: '#1d39c4',
        background: '#f0f5ff',
    },
    [RoomStatus.Maintenance]: {
        color: '#531dab',
        background: '#f9f0ff',
    },
    [RoomStatus.Disabled]: {
        color: '#a8071a',
        background: '#fff1f0',
    },
};

export const FieldCooperationTagStyles: Record<
    FieldCooperation,
    { color: string; background: string }
> = {
    [FieldCooperation.Undetermined]: {
        color: '#595959',
        background: '#FAFAFA',
    },
    [FieldCooperation.Rental]: {
        color: '#0958d9',
        background: '#e6f4ff',
    },
    [FieldCooperation.Land]: {
        color: '#237804',
        background: '#f6ffed',
    },
};


export const CollaboratorTypeTagStyles: Record<
    CollaboratorType,
    { color: string; background: string }
> = {
    [CollaboratorType.Broker]: {
        color: '#006d75',      // cyan-8
        background: '#e6fffb', // cyan-1
    },
    [CollaboratorType.Owner]: {
        color: '#531dab',      // purple-8
        background: '#f9f0ff', // purple-1
    },
};


export const UserRoleTagStyles: Record<
    UserRole,
    { color: string; background: string }
> = {
    /* ===== SYSTEM ===== */
    [UserRole.Admin]: {
        color: '#a8071a',      // red-7
        background: '#fff1f0', // red-1
    },

    /* ===== INTERNAL STAFF ===== */
    [UserRole.Sale]: {
        color: '#0958d9',      // blue-7
        background: '#e6f4ff', // blue-1
    },

    /* ===== PARTNER ===== */
    [UserRole.Owner]: {
        color: '#531dab',      // purple-8
        background: '#f9f0ff', // purple-1
    },
    [UserRole.Broker]: {
        color: '#006d75',      // cyan-8
        background: '#e6fffb', // cyan-1
    },

    /* ===== CUSTOMER ===== */
    [UserRole.Tenant]: {
        color: '#237804',      // green-7
        background: '#f6ffed', // green-1
    },
};
