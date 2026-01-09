import { CollaboratorType, FieldCooperation, RentalAmenity, RentalType, RoomStatus, UserRole } from "./enum";
import { StatusType } from "./type";


// ---------------------    COMMON    --------------------- //
export const HCM_PROVINCE_ID = '79';
export const GO_VAP_DISTRICT_ID = '764';


export const FieldCooperationLabels: Record<FieldCooperation, string> = {
    [FieldCooperation.Rental]: 'Nhà ở cho thuê',
    [FieldCooperation.Land]: 'Bất động sản',
};


export const ErrorMessage = {
    SYSTEM: "Lỗi hệ thống"
}


// ---------------------    AUTH    --------------------- //

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Nhân viên Sale',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};

export const UserRoleOptionsWithoutAdmin = Object.fromEntries(
    Object.entries(UserRoleOptions).filter(([key]) => key !== UserRole.Admin)
) as Record<Exclude<UserRole, UserRole.Admin>, string>;



// ---------------------    RENTAL    --------------------- //

export const RentalTypeLabels: Record<RentalType, string> = {
    [RentalType.BoardingHouse]: 'Dãy trọ',
    [RentalType.WholeHouse]: 'Nhà nguyên căn',
    [RentalType.Apartment]: 'Chung cư',
    [RentalType.BusinessPremises]: 'Mặt bằng kinh doanh',
};

export const UNIT_RENTAL_TYPES = [
    RentalType.WholeHouse,
    RentalType.Apartment,
    RentalType.BusinessPremises,
] as const;

export type UnitRentalType = typeof UNIT_RENTAL_TYPES[number];

export const isUnitRental = (
    type: RentalType,
): type is UnitRentalType => {
    return UNIT_RENTAL_TYPES.includes(type as UnitRentalType);
};


// ---------------------    ROOM    --------------------- //

export const RoomStatusLabels: Record<RoomStatus, string> = {
    [RoomStatus.Available]: 'Trống',
    [RoomStatus.Rented]: 'Đã thuê',
    [RoomStatus.Deposited]: 'Đã cọc',
    [RoomStatus.Maintenance]: 'Bảo trì',
};




export const RentalAmenityOptions: Record<RentalAmenity, string> = {
    [RentalAmenity.FullFurnished]: 'Đầy đủ nội thất',
    [RentalAmenity.Mezzanine]: 'Có gác',
    [RentalAmenity.KitchenShelf]: 'Có kệ bếp',
    [RentalAmenity.AirConditioner]: 'Có máy lạnh',
    [RentalAmenity.WashingMachine]: 'Có máy giặt',
    [RentalAmenity.Refrigerator]: 'Có tủ lạnh',
    [RentalAmenity.Elevator]: 'Có thang máy',
    [RentalAmenity.NoLiveWithOwner]: 'Không chung chủ',
    [RentalAmenity.FreeTime]: 'Giờ giấc tự do',
    [RentalAmenity.Security247]: 'Có bảo vệ 24/24',
    [RentalAmenity.BasementParking]: 'Có hầm để xe',
};




// ---------------------    COMMISSION    --------------------- //



// ---------------------    COLLABORATOR    --------------------- //

export const CollaboratorTypeLabels: Record<CollaboratorType, string> = {
    [CollaboratorType.Owner]: 'Chủ nhà',
    [CollaboratorType.Broker]: 'Môi giới',
};



export const StatusName = {
    active: "active",
    inactive: "inactive"
}

export const Status: StatusType[] = [
    {
        value: StatusName.active,
        label: "Hoạt động"
    },
    {
        value: StatusName.inactive,
        label: "Ngưng hoạt động"
    }
]


