// ---------------------    COMMON    --------------------- //

export enum Order {
    ASC = "ASC",
    DESC = "DESC",
}



// ---------------------    AUTH    --------------------- //

export enum UserRole {
    Admin = 'admin_saigon',
    Sale = 'sale_saigon',
    Owner = 'owner',    // chủ nhà
    Broker = 'broker',  // môi giới
    Tenant = 'tenant'
}



// ---------------------    RENTAL    --------------------- //

export enum RentalType {
    BoardingHouse = 'boarding_house', // dãy trọ
    WholeHouse = 'whole_house',       // nhà nguyên căn
    ServicedApartment = 'serviced_apartment', // CHDV
    Apartment = 'apartment',          // chung cư
}

export enum RentalStatus {
    New = 'new',           // Nhà mới được tạo, chưa xác nhận
    Confirmed = 'confirmed', // Nhà đã được admin xác nhận
    Update = 'update',     // Nhà đã được chỉnh sửa sau khi tạo
    Cancelled = 'cancelled' // Nhà đã bị huỷ hoặc xoá
}


// ---------------------    ROOM    --------------------- //


export enum RoomStatus {
    Available = 'available',   // Trống
    Rented = 'rented',         // Đã thuê
    Deposited = 'deposited',   // Đã cọc
    Maintenance = 'maintenance' // Bảo trì
}


// ---------------------    COMMISSION    --------------------- //


export enum BookingStatus {
    PENDING = 'pending',     // đã đặt lịch
    CONFIRMED = 'confirmed', // xác nhận với chủ trọ
    COMPLETED = 'completed', // đã đi xem
    CANCELLED = 'cancelled', // khách huỷ
    NO_SHOW = 'no_show',     // khách không đến
}


export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
    Cancelled = 'cancelled'
}

export enum FieldCooperation {
    Land = 'land',     // Bất động sản (mua bán)
    Rental = 'rental', // Cho thuê (phòng trọ, nhà thuê, CHDV)
}

export enum CollaboratorType {
    Owner = 'owner',    // Chủ nhà
    Broker = 'broker',        // Môi giới
}

export enum CustomerType {
    OWNER = 'owner',   // Chủ nhà
    BROKER = 'broker',       // Môi giới
    TENANT = 'tenant',       // Khách thuê / khách hàng
}

export enum ContractStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    CANCELLED = 'cancelled',
}



export enum ProductStatus {
    NEW = 'new',
    UPDATE = 'update',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

export enum ProductStatusOptions {
    new = 'Tin mới',
    update = 'Có chỉnh sửa',
    pending = 'Cần cập nhật',
    confirmed = 'Đã xác nhận',
    cancelled = 'Đã hủy'
}

export enum RentalAmenity {
    FULL_FURNISHED = 'full_furnished',
    MEZZANINE = 'mezzanine',
    KITCHEN_SHELF = 'kitchen_shelf',
    AIR_CONDITIONER = 'air_conditioner',
    WASHING_MACHINE = 'washing_machine',
    REFRIGERATOR = 'refrigerator',
    ELEVATOR = 'elevator',
    NO_LIVE_WITH_OWNER = 'no_live_with_owner',
    FREE_TIME = 'free_time',
    SECURITY_24_7 = 'security_24_7',
    BASEMENT_PARKING = 'basement_parking',
}

export enum TopicType {
    Affiliate = 'affiliate',
    Tiktok = 'tiktok',
    Facebook = 'facebook',
    Threads = 'threads',
    LinkedIn = 'linkedin',
    Youtube = 'youtube',
    Pinterest = 'pinterest'
}


export enum AffiliateCategoryType {
    Tiktok = 'tiktok',
    Shopee = 'shopee',
    Lazada = 'lazada',
    Tiki = 'tiki',
    Sendo = 'sendo',
    Amazone = 'amazone'
}

export enum TypeCheckData {
    VideoTopic = 'video_topic',
    AffiliateTopic = 'affiliate_topic'
}


export enum CronJobTypeEnum {
    FANPAGE_POST_SHOPEE = 'fanpage_post_shopee',
    YOUTUBE_POST_SHOPEE = 'youtube_post_shopee',
    LINKEDIN_POST_SHOPEE = 'linkedin_post_shopee',
    POST_THREADS = 'post_threads',
    SEND_MAIL = 'send_mail',
    ZALO_SEND_MESSAGE = 'zalo_send_message',
    ZALO_ADD_FRIENDS = 'zalo_add_friends'
}

export enum Profession {
    SaleRoom = 'sale_room',
    RealEstate = 'real_estate',
    Recruitment = 'recruitment',
    Tour = 'tour',
    Hotel = 'hotel',
    Learning = 'learning',
    Finance = 'finance',
    Insurance = 'insurance',
    Software = 'software'
}

export enum SourceBroker {
    Cafeland = 'cafeland'
}

export enum ProductTiktokCategory {
    TRANG_PHUC_NU = 'trang_phuc_nu_do_lot',
    DO_CHOI_SO_THICH = 'do_choi_so_thich',
    SUA_CHUA_NHA_CUA = 'sua_chua_nha_cua',
    DIEN_THOAI_DIEN_TU = 'dien_thoai_do_dien_tu',
    OTO_XE_MAY = 'oto_xe_may',
    DO_AN_DO_UONG = 'do_an_do_uong',
    PHU_KIEN_THOI_TRANG = 'phu_kien_thoi_trang',
    THOI_TRANG_TRE_EM = 'thoi_trang_tre_em',
    TRANG_PHUC_NAM = 'trang_phuc_nam_do_lot',
    DO_DUNG_NHA_BEP = 'do_dung_nha_bep',
    SACH_TAP_CHI_AM_THANH = 'sach_tap_chi_am_thanh',
    DO_GIA_DUNG = 'do_gia_dung',
    MAY_TINH_THIET_BI_VAN_PHONG = 'may_tinh_thiet_bi_van_phong',
    THIET_BI_GIA_DUNG = 'thiet_bi_gia_dung',
    CHAM_SOC_SAC_DEP = 'cham_soc_sac_dep_ca_nhan',
    DO_NOI_THAT = 'do_noi_that',
    GIAY = 'giay',
    THE_THAO_NGOAI_TROI = 'the_thao_ngoai_troi',
    HANH_LY_TUI_XACH = 'hanh_ly_tui_xach',
    DO_DUNG_THU_CUNG = 'do_dung_thu_cung',
    HANG_DET_NOI_THAT_MEM = 'hang_det_noi_that_mem',
    CONG_CU_PHAN_CUNG = 'cong_cu_phan_cung',
    PHU_KIEN_TRANG_SUC = 'phu_kien_trang_suc_phai_sinh',
}