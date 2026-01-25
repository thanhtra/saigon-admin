import { BookingStatus, CollaboratorType, FieldCooperation, RentalAmenity, RentalStatus, RentalType, RoomStatus, UserRole, WaterUnit } from "./enum";
import { StatusType } from "./type";


// ---------------------    COMMON    --------------------- //
export const PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;

export const HCM_PROVINCE_ID = '79';
export const GO_VAP_DISTRICT_ID = '764';


export const FieldCooperationLabels: Record<FieldCooperation, string> = {
    [FieldCooperation.Undetermined]: 'Chưa xác định',
    [FieldCooperation.Rental]: 'Nhà ở cho thuê',
    [FieldCooperation.Land]: 'Bất động sản',
};


export const ErrorMessage = {
    SYSTEM: "Lỗi hệ thống"
}

export const LOGOUT_FLAG = 'force_logout';


// ---------------------    AUTH    --------------------- //

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Nhân viên Sale',
    [UserRole.Owner]: 'Chủ nhà',
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
    [RentalType.BusinessPremises]: 'Mặt bằng kinh doanh, văn phòng',
};


export const RentalStatusLabels: Record<RentalStatus, string> = {
    [RentalStatus.New]: 'Nhà mới tạo',
    [RentalStatus.Confirmed]: 'Đã xác nhận',
    [RentalStatus.Update]: 'Đã chỉnh sửa',
    [RentalStatus.Cancelled]: 'Đã huỷ',
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
    [RoomStatus.PendingApproval]: 'Chờ duyệt',
    [RoomStatus.Available]: 'Trống',
    [RoomStatus.Rented]: 'Đã thuê',
    [RoomStatus.Maintenance]: 'Bảo trì',
    [RoomStatus.Disabled]: 'Vô hiệu hoá'
};

export const RentalAmenityOptions: Record<RentalAmenity, string> = {
    [RentalAmenity.FullFurnished]: 'Nội thất đầy đủ',
    [RentalAmenity.Toilet]: 'WC riêng',
    [RentalAmenity.Mezzanine]: 'Gác lửng',
    [RentalAmenity.KitchenShelf]: 'Kệ bếp',
    [RentalAmenity.AirConditioner]: 'Máy lạnh',
    [RentalAmenity.WashingMachine]: 'Máy giặt',
    [RentalAmenity.Refrigerator]: 'Tủ lạnh',
    [RentalAmenity.Elevator]: 'Thang máy',
    [RentalAmenity.NoLiveWithOwner]: 'Không chung chủ',
    [RentalAmenity.FreeTime]: 'Giờ giấc tự do',
    [RentalAmenity.Security247]: 'An ninh 24/7',
    [RentalAmenity.BasementParking]: 'Chỗ để xe',
    [RentalAmenity.PetAllowed]: 'Nuôi thú cưng',
    [RentalAmenity.ElectricMotorbike]: 'Xe máy điện',
    [RentalAmenity.Window]: 'Cửa sổ',
    [RentalAmenity.Balcony]: 'Ban công',
};


// ---------------------    BOOKING    --------------------- //

export const BookingStatusLabels: Record<BookingStatus, string> = {
    [BookingStatus.Pending]: 'Đã đặt lịch',
    [BookingStatus.Confirmed]: 'Đã xác nhận',
    [BookingStatus.Completed]: 'Đã đi xem',
    [BookingStatus.Cancelled]: 'Đã huỷ',
    [BookingStatus.NoShow]: 'Không đến',
};

export const BookingStatusAdminLabels: Record<BookingStatus, string> = {
    [BookingStatus.Pending]: 'Lịch mới',
    [BookingStatus.Confirmed]: 'Đã xác nhận',
    [BookingStatus.Completed]: 'Đã đi xem',
    [BookingStatus.Cancelled]: 'Khách huỷ',
    [BookingStatus.NoShow]: 'Không đến',
};



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

export const WaterUnitOptions: Record<WaterUnit, string> = {
    [WaterUnit.PerM3]: 'đ / m³',
    [WaterUnit.PerPerson]: 'đ / người',
};

