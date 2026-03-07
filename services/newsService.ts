import api from '../lib/api';

export interface NewsFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface CreateNewsData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string | {url: string; publicId: string};
  category: string;
  tags?: string[];
  isActive?: boolean;
  publishedAt?: Date;
}

// Get all news
export const getNews = async (filters?: NewsFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  
  const response = await api.get(`/news?${params.toString()}`);
  return response.data;
};

// Get single news by ID
export const getNewsById = async (id: string) => {
  const response = await api.get(`/news/${id}`);
  return response.data.data;
};

// Get news by slug
export const getNewsBySlug = async (slug: string) => {
  const response = await api.get(`/news/slug/${slug}`);
  return response.data.data;
};

// Create news (Admin only)
export const createNews = async (newsData: CreateNewsData) => {
  const response = await api.post('/news', newsData);
  return response.data.data;
};

// Update news (Admin only)
export const updateNews = async (id: string, newsData: Partial<CreateNewsData>) => {
  const response = await api.put(`/news/${id}`, newsData);
  return response.data.data;
};

// Delete news (Admin only)
export const deleteNews = async (id: string) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};

// Get news statistics (Admin only)
export const getNewsStats = async () => {
  const response = await api.get('/news/stats/dashboard');
  return response.data.data;
};
