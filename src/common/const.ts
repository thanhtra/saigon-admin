import { AffiliateCategoryType, CollaboratorType, CronJobTypeEnum, FieldCooperation, ProductTiktokCategory, Profession, RentalType, SourceBroker, TopicType, TypeCheckData, UserRole } from "./enum";
import { StatusType } from "./type";


// ---------------------    COMMON    --------------------- //
export const HCM_PROVINCE_ID = '79';
export const GO_VAP_DISTRICT_ID = '764';


export const FieldCooperationLabels: Record<FieldCooperation, string> = {
    [FieldCooperation.Land]: 'Bất động sản (mua bán)',
    [FieldCooperation.Rental]: 'Cho thuê (phòng trọ, nhà thuê, CHDV)',
};




// ---------------------    AUTH    --------------------- //

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Người bán hàng',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};



// ---------------------    RENTAL    --------------------- //

export const RentalTypeLabels: Record<RentalType, string> = {
    [RentalType.BoardingHouse]: 'Dãy trọ',
    [RentalType.WholeHouse]: 'Nhà nguyên căn',
    [RentalType.ServicedApartment]: 'Căn hộ dịch vụ',
    [RentalType.Apartment]: 'Chung cư',
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

export const TopicTypeOptions: Record<TopicType, string> = {
    [TopicType.Affiliate]: 'Affiliate',
    [TopicType.Tiktok]: 'Tiktok',
    [TopicType.Facebook]: 'Facebook',
    [TopicType.Threads]: 'Threads',
    [TopicType.LinkedIn]: 'LinkedIn',
    [TopicType.Youtube]: 'Youtube',
    [TopicType.Pinterest]: 'Pinterest'
};

export const AffiliateCategoryOptions = {
    [AffiliateCategoryType.Tiktok]: 'TikTok',
    [AffiliateCategoryType.Shopee]: 'Shopee',
    [AffiliateCategoryType.Lazada]: 'Lazada',
    [AffiliateCategoryType.Tiki]: 'Tiki',
    [AffiliateCategoryType.Sendo]: 'Sendo',
    [AffiliateCategoryType.Amazone]: 'Amazone',
};



export const TypeCheckDataOptions = {
    [TypeCheckData.VideoTopic]: "Kiểm tra video còn không",
    [TypeCheckData.AffiliateTopic]: "Kiểm tra link affiliate đã có chưa"
}

export const redirectUriLinkedIn = "http://localhost:3002/linkedin/oauth2callback";


export const JobTypeDescription = {
    [CronJobTypeEnum.FANPAGE_POST_SHOPEE]: "Fanpage Facebook đăng hình ảnh/video shopee",
    [CronJobTypeEnum.YOUTUBE_POST_SHOPEE]: "Youtube đăng video shopee",
    [CronJobTypeEnum.LINKEDIN_POST_SHOPEE]: "LinkedIn đăng hình ảnh/video shopee",
    [CronJobTypeEnum.POST_THREADS]: "Lấy bài post hoặc shopee đăng lên threads",
    [CronJobTypeEnum.SEND_MAIL]: "Gửi mail",
    [CronJobTypeEnum.ZALO_SEND_MESSAGE]: "Gửi tin nhắn zalo",
    [CronJobTypeEnum.ZALO_ADD_FRIENDS]: "Kết bạn zalo",
}

export const ProfessionOptions: Record<Profession, string> = {
    [Profession.SaleRoom]: 'Thuê phòng trọ',
    [Profession.RealEstate]: 'Bất động sản',
    [Profession.Recruitment]: 'Tuyển dụng',
    [Profession.Tour]: 'Tour',
    [Profession.Hotel]: 'Khách sạn',
    [Profession.Learning]: 'Khoá học',
    [Profession.Finance]: 'Tài chính',
    [Profession.Insurance]: 'Bảo hiểm',
    [Profession.Software]: 'Phần mềm',
};


export const SourceBrokerOptions: Record<SourceBroker, string> = {
    [SourceBroker.Cafeland]: 'Cafeland',
}

export const ProductTiktokCategoryLabel: Record<ProductTiktokCategory, string> = {
    [ProductTiktokCategory.TRANG_PHUC_NU]: 'Trang phục nữ & Đồ lót',
    [ProductTiktokCategory.DO_CHOI_SO_THICH]: 'Đồ chơi & sở thích',
    [ProductTiktokCategory.SUA_CHUA_NHA_CUA]: 'Sửa chữa nhà cửa',
    [ProductTiktokCategory.DIEN_THOAI_DIEN_TU]: 'Điện thoại & Đồ điện tử',
    [ProductTiktokCategory.OTO_XE_MAY]: 'Ô tô & xe máy',
    [ProductTiktokCategory.DO_AN_DO_UONG]: 'Đồ ăn & Đồ uống',
    [ProductTiktokCategory.PHU_KIEN_THOI_TRANG]: 'Phụ kiện thời trang',
    [ProductTiktokCategory.THOI_TRANG_TRE_EM]: 'Thời trang trẻ em',
    [ProductTiktokCategory.TRANG_PHUC_NAM]: 'Trang phục nam & Đồ lót',
    [ProductTiktokCategory.DO_DUNG_NHA_BEP]: 'Đồ dùng nhà bếp',
    [ProductTiktokCategory.SACH_TAP_CHI_AM_THANH]: 'Sách, tạp chí & âm thanh',
    [ProductTiktokCategory.DO_GIA_DUNG]: 'Đồ gia dụng',
    [ProductTiktokCategory.MAY_TINH_THIET_BI_VAN_PHONG]: 'Máy tính & Thiết bị Văn phòng',
    [ProductTiktokCategory.THIET_BI_GIA_DUNG]: 'Thiết bị gia dụng',
    [ProductTiktokCategory.CHAM_SOC_SAC_DEP]: 'Chăm sóc sắc đẹp & Chăm sóc cá nhân',
    [ProductTiktokCategory.DO_NOI_THAT]: 'Đồ nội thất',
    [ProductTiktokCategory.GIAY]: 'Giày',
    [ProductTiktokCategory.THE_THAO_NGOAI_TROI]: 'Thể thao & Ngoài trời',
    [ProductTiktokCategory.HANH_LY_TUI_XACH]: 'Hành lý & Túi xách',
    [ProductTiktokCategory.DO_DUNG_THU_CUNG]: 'Đồ dùng cho thú cưng',
    [ProductTiktokCategory.HANG_DET_NOI_THAT_MEM]: 'Hàng dệt & Đồ nội thất mềm',
    [ProductTiktokCategory.CONG_CU_PHAN_CUNG]: 'Công cụ & Phần cứng',
    [ProductTiktokCategory.PHU_KIEN_TRANG_SUC]: 'Phụ kiện trang sức & Phái sinh',
};