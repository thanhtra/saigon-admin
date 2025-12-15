import { StatusType } from './type';


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

export enum TopicType {
    Affiliate = 'affiliate',
    Tiktok = 'tiktok',
    Facebook = 'facebook',
    Threads = 'threads',
    LinkedIn = 'linkedin',
    Youtube = 'youtube',
    Pinterest = 'pinterest'
}

export const TopicTypeOptions: Record<TopicType, string> = {
    [TopicType.Affiliate]: 'Affiliate',
    [TopicType.Tiktok]: 'Tiktok',
    [TopicType.Facebook]: 'Facebook',
    [TopicType.Threads]: 'Threads',
    [TopicType.LinkedIn]: 'LinkedIn',
    [TopicType.Youtube]: 'Youtube',
    [TopicType.Pinterest]: 'Pinterest'
};

export enum AffiliateCategoryType {
    Tiktok = 'tiktok',
    Shopee = 'shopee',
    Lazada = 'lazada',
    Tiki = 'tiki',
    Sendo = 'sendo',
    Amazone = 'amazone'
}

export const AffiliateCategoryOptions = {
    [AffiliateCategoryType.Tiktok]: 'TikTok',
    [AffiliateCategoryType.Shopee]: 'Shopee',
    [AffiliateCategoryType.Lazada]: 'Lazada',
    [AffiliateCategoryType.Tiki]: 'Tiki',
    [AffiliateCategoryType.Sendo]: 'Sendo',
    [AffiliateCategoryType.Amazone]: 'Amazone',
};

export enum TypeCheckData {
    VideoTopic = 'video_topic',
    AffiliateTopic = 'affiliate_topic'
}

export const TypeCheckDataOptions = {
    [TypeCheckData.VideoTopic]: "Kiểm tra video còn không",
    [TypeCheckData.AffiliateTopic]: "Kiểm tra link affiliate đã có chưa"
}

export const redirectUriLinkedIn = "http://localhost:3002/linkedin/oauth2callback";

export enum CronJobTypeEnum {
    FANPAGE_POST_SHOPEE = 'fanpage_post_shopee',
    YOUTUBE_POST_SHOPEE = 'youtube_post_shopee',
    LINKEDIN_POST_SHOPEE = 'linkedin_post_shopee',
    POST_THREADS = 'post_threads',
    SEND_MAIL = 'send_mail',
    ZALO_SEND_MESSAGE = 'zalo_send_message',
    ZALO_ADD_FRIENDS = 'zalo_add_friends'
}


export const JobTypeDescription = {
    [CronJobTypeEnum.FANPAGE_POST_SHOPEE]: "Fanpage Facebook đăng hình ảnh/video shopee",
    [CronJobTypeEnum.YOUTUBE_POST_SHOPEE]: "Youtube đăng video shopee",
    [CronJobTypeEnum.LINKEDIN_POST_SHOPEE]: "LinkedIn đăng hình ảnh/video shopee",
    [CronJobTypeEnum.POST_THREADS]: "Lấy bài post hoặc shopee đăng lên threads",
    [CronJobTypeEnum.SEND_MAIL]: "Gửi mail",
    [CronJobTypeEnum.ZALO_SEND_MESSAGE]: "Gửi tin nhắn zalo",
    [CronJobTypeEnum.ZALO_ADD_FRIENDS]: "Kết bạn zalo",
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

export enum SourceBroker {
    Cafeland = 'cafeland'
}

export const SourceBrokerOptions: Record<SourceBroker, string> = {
    [SourceBroker.Cafeland]: 'Cafeland',
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