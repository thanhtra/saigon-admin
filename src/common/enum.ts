// ---------------------    COMMON    --------------------- //

export enum Order {
    ASC = "ASC",
    DESC = "DESC",
}

// ---------------------    AUTH    --------------------- //

export enum UserRole {
    Admin = 'admin_saigon',
    Sale = 'sale_saigon',
    Owner = 'owner',       // Chủ nhà
    Broker = 'broker',     // Môi giới
    Tenant = 'tenant',     // Khách hàng
}

export enum CollaboratorType {
    Owner = UserRole.Owner,       // Chủ nhà
    Broker = UserRole.Broker,     // Môi giới
}

export enum CustomerType {
    Owner = UserRole.Owner,     // Chủ nhà
    Broker = UserRole.Broker,   // Môi giới
    Tenant = UserRole.Tenant,   // Khách thuê / khách hàng
}


// ---------------------    UPLOAD    --------------------- //
export enum UploadDomain {
    Rooms = 'rooms',
    Lands = 'lands',
    Contracts = 'contracts',
}

// ---------------------    RENTAL    --------------------- //
export enum RentalType {
    BoardingHouse = 'boarding_house',   // Dãy trọ (nhiều phòng)
    WholeHouse = 'whole_house',         // Nhà nguyên căn (1 unit)
    Apartment = 'apartment',            // Chung cư (1 unit)
    BusinessPremises = 'business_premises', // Mặt bằng kinh doanh (1 unit)
}


export enum RentalStatus {
    New = 'new',               // Nhà mới được tạo, chưa xác nhận
    Confirmed = 'confirmed',   // Nhà đã được admin xác nhận
    Update = 'update',         // Nhà đã được chỉnh sửa sau khi tạo
    Cancelled = 'cancelled',   // Nhà đã bị huỷ hoặc xoá
}

// ---------------------    ROOM    --------------------- //


export enum RoomStatus {
    PendingApproval = 'pending_approval',   // Chờ duyệt
    Available = 'available',       // Trống
    Rented = 'rented',             // Đã thuê
    Maintenance = 'maintenance',   // Bảo trì
    Disabled = 'disabled'          // Vô hiệu
}


// ---------------------    COMMISSION    --------------------- //

export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
    Cancelled = 'cancelled'
}

export enum BookingStatus {
    Pending = 'pending',           // Đã đặt lịch
    Confirmed = 'confirmed',       // Đã xác nhận với chủ trọ
    Completed = 'completed',       // Đã đi xem
    Deposited = 'deposited',       // ✅ Đã cọc giữ phòng
    MovedIn = 'moved_in',           // ✅ Đã vào ở
    Cancelled = 'cancelled',       // Khách huỷ
    NoShow = 'no_show',             // Khách không đến
}

export enum FieldCooperation {
    Undetermined = 'undetermined',  // user tạo tài khoản nên chưa xác định
    Land = 'land',       // Bất động sản (mua bán)
    Rental = 'rental',   // Cho thuê
}


export enum ContractStatus {
    Active = 'active',
    Ended = 'ended',
    Cancelled = 'cancelled',
}

export enum CommissionType {
    Fixed = 'fixed',         // Số tiền cố định
    Percent = 'percent',     // % tiền thuê
}

export enum ProductStatus {
    New = 'new',
    Update = 'update',
    Pending = 'pending',
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
}

// Enum dùng cho hiển thị (label)
export enum ProductStatusOptions {
    New = 'Tin mới',
    Update = 'Có chỉnh sửa',
    Pending = 'Cần cập nhật',
    Confirmed = 'Đã xác nhận',
    Cancelled = 'Đã hủy',
}

export enum RentalAmenity {
    FullFurnished = 'full_furnished',
    Toilet = 'toilet',
    KitchenShelf = 'kitchen_shelf',
    Mezzanine = 'mezzanine',
    AirConditioner = 'air_conditioner',
    WashingMachine = 'washing_machine',
    Refrigerator = 'refrigerator',
    NoLiveWithOwner = 'no_live_with_owner',
    FreeTime = 'free_time',
    Security247 = 'security_24_7',
    BasementParking = 'basement_parking',
    ElectricMotorbike = 'electric_motorbike',   // Xe máy điện
    PetAllowed = 'pet_allowed',                 // Nuôi thú cưng
    Window = 'window',                          // Cửa sổ
    Balcony = 'balcony',                        // Ban công
    Elevator = 'elevator',
}

export enum WaterUnit {
    PerM3 = 'per_m3',
    PerPerson = 'per_person'
}

export enum LandType {
    Apartment = 'apartment',                 // Chung cư
    Townhouse = 'townhouse',                  // Nhà phố
    ProjectHouse = 'project_house',           // Nhà dự án
    Shophouse = 'shophouse',                  // Shophouse, nhà phố thương mại
    VillaTownhouse = 'villa_townhouse',       // Biệt thự, liền kề
}