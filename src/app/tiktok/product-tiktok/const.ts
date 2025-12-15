import { ProductTiktokCategory } from "@/utils/const";

// export const PROMPT_TEMPLATE = `Tạo một kịch bản video quảng cáo ngắn xịn thu hút người xem và mua theo chuẩn TikTok Policy từ một hình ảnh sản phẩm tôi tải lên, thời lượng 8 giây, định dạng dọc (9:16), 
// video có người đang giới thiệu sản phẩm và sử dụng tiếng việt để giới thiệu sản phẩm. Lưu ý quan trọng là không dùng ảnh tĩnh, không tạo dòng chữ hiển thị lên video, hãy giới thiệu rõ về sản phẩm
// Lưu ý cực kỳ quan trọng video tạo hình ảnh giống với sản phẩm được tải lên bởi vì nếu sai hình thì sẽ dẫn đến vi phạm

// Sản phẩm: {{title}}

// Yêu cầu:
// - Giữ hình ảnh trung thực, có giá trị thẩm mỹ, không chỉnh sửa quá mức. 
// - Tuân thủ đầy đủ TikTok Policy: không chứa bạo lực, khiêu dâm, cực đoan; không dùng từ ngữ tuyệt đối như “duy nhất”, “100%”, “số 1”; không có liên kết ngoài hoặc thông tin mạng xã hội. 
// - Lưu ý video không có text overlay, không có caption, không thêm nhạc nền.
// - Có giọng đọc TTS tiếng Việt tự nhiên, giọng nữ, mô tả ngắn gọn và trung thực về sản phẩm, ví dụ: “Đây là MIAA Quần Jeans Nữ Ống Rộng Loe 37cm, màu Retro Xanh Nhạt và Xanh Xám. Chất vải jeans mềm mại, thoáng mát, dễ phối đồ và tôn dáng tự nhiên.”
// - Sử dụng hiệu ứng nhẹ nhàng, ví dụ như zoom chậm hoặc fade in/out để tạo cảm giác tinh tế, hiện đại.
// - Lưu ý quan trọng là không tạo dòng chữ hiển thị lên video
// - hãy tạo video người dùng đang dùng sản phẩm, không hiển thị chữ trên màn hình
// - Lưu ý hãy tạo video đúng 100% hình ảnh sản phẩm được tải lên
// `;


export const PROMPT_TEMPLATE = `
Hãy tạo một video quảng cáo ngắn hấp dẫn theo chuẩn TikTok Policy, sử dụng hình ảnh sản phẩm tôi tải lên.  
Yêu cầu video:
- Thời lượng: 8 giây  
- Định dạng: dọc (9:16)  
- Ngôn ngữ: Tiếng Việt  
- Có người đang giới thiệu và sử dụng sản phẩm (không phải ảnh tĩnh)  
- Không hiển thị bất kỳ dòng chữ, phụ đề, caption hay logo nào trên video  
- Không thêm nhạc nền  

🎯 Mục tiêu:
Tạo video quảng cáo tự nhiên, sinh động, giúp người xem dễ hiểu và có cảm xúc muốn mua sản phẩm: {{title}}

🧠 Hướng dẫn chi tiết:
- Giọng đọc: TTS tiếng Việt tự nhiên, giọng nữ, nói rõ ràng, dễ nghe.  
- Nội dung giọng đọc: mô tả ngắn gọn, trung thực, có tính gợi hình
- Hiệu ứng hình ảnh: nhẹ nhàng (zoom chậm, fade in/out) để tạo cảm giác tinh tế, hiện đại.  
- Hình ảnh phải trung thực, có giá trị thẩm mỹ, **giống 100% sản phẩm đã tải lên**, không chỉnh sửa quá mức.  

⚠️ Tuân thủ nghiêm ngặt TikTok Policy:
- Không chứa yếu tố bạo lực, khiêu dâm, cực đoan.  
- Không dùng từ ngữ tuyệt đối như “duy nhất”, “100%”, “số 1”.  
- Không chứa liên kết ngoài, thông tin mạng xã hội, hoặc văn bản quảng cáo trực tiếp.  
`;



export const MAIL_TO = "gocphovangem260317@gmail.com";

// 1 Thời trang nữ
// 2 Đồ gia dụng
// 3 Nào mới có ghệ
// 4 Thời trang nam
// 5 Chỉ bán hàng chuẩn xịn
// 6 Đồ nội thất
// 7 Mỹ phẩm
// 8 Review chi tiết

export const NickTiktok: Record<ProductTiktokCategory, string> = {
  [ProductTiktokCategory.TRANG_PHUC_NU]: '1',
  [ProductTiktokCategory.DO_CHOI_SO_THICH]: '5',
  [ProductTiktokCategory.SUA_CHUA_NHA_CUA]: '6',
  [ProductTiktokCategory.DIEN_THOAI_DIEN_TU]: '5',
  [ProductTiktokCategory.OTO_XE_MAY]: '3',
  [ProductTiktokCategory.DO_AN_DO_UONG]: '8',
  [ProductTiktokCategory.PHU_KIEN_THOI_TRANG]: '4',
  [ProductTiktokCategory.THOI_TRANG_TRE_EM]: '1',
  [ProductTiktokCategory.TRANG_PHUC_NAM]: '4',
  [ProductTiktokCategory.DO_DUNG_NHA_BEP]: '2',
  [ProductTiktokCategory.SACH_TAP_CHI_AM_THANH]: '5',
  [ProductTiktokCategory.DO_GIA_DUNG]: '2',
  [ProductTiktokCategory.MAY_TINH_THIET_BI_VAN_PHONG]: '5',
  [ProductTiktokCategory.THIET_BI_GIA_DUNG]: '2',
  [ProductTiktokCategory.CHAM_SOC_SAC_DEP]: '1',
  [ProductTiktokCategory.DO_NOI_THAT]: '6',
  [ProductTiktokCategory.GIAY]: '1',
  [ProductTiktokCategory.THE_THAO_NGOAI_TROI]: '3',
  [ProductTiktokCategory.HANH_LY_TUI_XACH]: '3',
  [ProductTiktokCategory.DO_DUNG_THU_CUNG]: '2',
  [ProductTiktokCategory.HANG_DET_NOI_THAT_MEM]: '6',
  [ProductTiktokCategory.CONG_CU_PHAN_CUNG]: '5',
  [ProductTiktokCategory.PHU_KIEN_TRANG_SUC]: '1',
};