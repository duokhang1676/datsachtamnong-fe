import api from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type: 'product' | 'news';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  byType: {
    product: number;
    news: number;
  };
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  type: 'product' | 'news';
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export interface GetCategoriesParams {
  type?: 'product' | 'news';
  isActive?: boolean;
  search?: string;
}

const categoryService = {
  // Get all categories with optional filters
  getCategories: async (params?: GetCategoriesParams) => {
    const response = await api.get('/categories', { params });
    return response.data.data as Category[];
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data as Category;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data as Category;
  },

  // Create new category (admin only)
  createCategory: async (data: CreateCategoryData) => {
    const response = await api.post('/categories', data);
    return response.data.data as Category;
  },

  // Update category (admin only)
  updateCategory: async (id: string, data: UpdateCategoryData) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data as Category;
  },

  // Delete category (admin only)
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Get category statistics (admin only)
  getCategoryStats: async () => {
    const response = await api.get('/categories/stats/dashboard');
    return response.data.data as CategoryStats;
  },
};

export default categoryService;
