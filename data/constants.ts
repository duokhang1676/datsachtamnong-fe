import { SiteSettings } from "@/types";

export const SITE_INFO: SiteSettings = {
  siteName: "Đất Sạch Tam Nông",
  slogan: "Nông nghiệp - Nông dân - Nông thôn",
  contactEmail: "datcsachtamnong@gmail.com",
  contactPhone: "0867.68.68.69",
  address: "121/1 ấp Thạnh Mỹ, xã Quới Điền, tỉnh Vĩnh Long",
  factory: "Nhà máy sản xuất: Ấp An Nhơn 2, xã Mỏ Cày, tỉnh Vĩnh Long",
  socialMedia: {
    facebook: "https://facebook.com/datsachtamnong",
    zalo: "https://zalo.me/0867686869",
  },
  seo: {
    metaTitle: "Đất Sạch Tam Nông - Đất hữu cơ chất lượng cao",
    metaDescription: "Đất sạch dinh dưỡng Tam Nông - Sử dụng trực tiếp tốt cho mọi loại cây trồng. Tơi xốp, thoát nước tốt, giàu hữu cơ.",
  },
};

export const PRODUCT_FEATURES = [
  "Sử dụng trực tiếp tốt cho mọi loại cây trồng",
  "Tơi xốp - thoát nước tốt",
  "Giàu hữu cơ",
  "Giữ ẩm ổn định",
  "Rau, củ, quả sạch",
];

export const COMPANY_INFO = {
  fullName: "CÔNG TY TNHH DỊCH VỤ THIẾT BỊ MÔI TRƯỜNG BẾN TRE",
  shortName: "Đất Sạch Tam Nông",
  businessLicense: "Đang cập nhật",
};

export const SHIPPING_FEE = 30000;
export const FREE_SHIPPING_THRESHOLD = 500000;

// Product categories (matching backend enum)
export const PRODUCT_CATEGORIES = [
  {
    value: 'organic-soil',
    label: 'Đất hữu cơ',
    description: 'Đất sạch dinh dưỡng cao cấp cho mọi loại cây trồng'
  },
  {
    value: 'fertilizer',
    label: 'Phân bón',
    description: 'Phân bón hữu cơ từ thiên nhiên'
  },
  {
    value: 'tools',
    label: 'Dụng cụ',
    description: 'Dụng cụ trồng trọt và chăm sóc cây'
  },
  {
    value: 'seeds',
    label: 'Hạt giống',
    description: 'Hạt giống rau, củ, quả chất lượng cao'
  },
  {
    value: 'other',
    label: 'Khác',
    description: 'Các sản phẩm khác'
  }
];

// News categories (matching backend enum)
export const NEWS_CATEGORIES = [
  'Kiến thức nông nghiệp',
  'Tin tức',
  'Hướng dẫn',
  'Khuyến mãi',
  'Khác'
];
