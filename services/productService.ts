import api from '../lib/api';
import { Product } from '../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: 'name-asc' | 'popular' | 'newest';
  page?: number;
  limit?: number;
  featured?: boolean;
  status?: 'available' | 'unavailable' | 'discontinued';
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface CreateProductData {
  name: string;
  category: string; // Category ID
  description: string;
  shortDescription?: string;
  specifications?: string;
  packaging?: string;
  features?: string[];
  status?: 'available' | 'unavailable' | 'discontinued';
  images?: Array<{url: string; publicId: string}>;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

// Get all products
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.featured) params.append('featured', 'true');
  if (filters?.status) params.append('status', filters.status);
  
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

// Get single product by ID
export const getProduct = async (id: string): Promise<ProductResponse> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<ProductResponse> => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

// Create product (Admin only)
export const createProduct = async (productData: CreateProductData): Promise<ProductResponse> => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update product (Admin only)
export const updateProduct = async (id: string, productData: UpdateProductData): Promise<ProductResponse> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (Admin only)
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Get product statistics (Admin only)
export const getProductStats = async () => {
  const response = await api.get('/products/stats/dashboard');
  return response.data.data;
};

export default {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};
