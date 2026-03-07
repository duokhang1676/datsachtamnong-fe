import api from '../lib/api';
import { Banner } from '../types';

export interface BannersResponse {
  success: boolean;
  count: number;
  data: Banner[];
}

export interface BannerResponse {
  success: boolean;
  data: Banner;
}

export interface CreateBannerData {
  image: {
    url: string;
    publicId: string;
  };
  order?: number;
}

export interface ReorderBannersData {
  banners: Array<{
    id: string;
    order: number;
  }>;
}

// Get all banners
export const getBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/banners');
  return response.data;
};

// Create banner (admin)
export const createBanner = async (data: CreateBannerData): Promise<BannerResponse> => {
  const response = await api.post('/banners', data);
  return response.data;
};

// Delete banner (admin)
export const deleteBanner = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

// Reorder banners (admin)
export const reorderBanners = async (data: ReorderBannersData): Promise<{ success: boolean; message: string }> => {
  const response = await api.put('/banners/reorder', data);
  return response.data;
};

export default {
  getBanners,
  createBanner,
  deleteBanner,
  reorderBanners,
};
