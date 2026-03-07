export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: Category;
  images: Array<{url: string; publicId: string}>;
  packaging?: string;
  specifications?: string; // Changed to string
  features?: string[];
  isFeatured: boolean;
  isActive: boolean;
  status: 'available' | 'unavailable' | 'discontinued';
  stock?: number;
  sku?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | {url: string; publicId: string};
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin" | string;
  avatar?: string;
  token?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  paymentQRCode?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Banner {
  _id: string;
  image: {
    url: string;
    publicId: string;
  };
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  logo?: string;
  favicon?: string;
  slogan?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  factory?: string;
  socialMedia?: {
    facebook?: string;
    zalo?: string;
    instagram?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  _id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
  ipAddress?: string;
  source?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  source: "footer" | "checkout" | "manual";
  status: "active" | "unsubscribed";
  ipAddress?: string;
  note?: string;
}
