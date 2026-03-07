import api from '../lib/api';

export interface CustomerFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  source?: 'footer' | 'checkout' | 'manual' | 'contact';
  note?: string;
}

// Get all customers (Admin only)
export const getCustomers = async (filters?: CustomerFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.source) params.append('source', filters.source);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const response = await api.get(`/customers?${params.toString()}`);
  return response.data;
};

// Get single customer (Admin only)
export const getCustomer = async (id: string) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

// Create customer (subscribe newsletter)
export const createCustomer = async (customerData: CreateCustomerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

// Update customer (Admin only)
export const updateCustomer = async (id: string, customerData: Partial<CreateCustomerData>) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
};

// Delete customer (Admin only)
export const deleteCustomer = async (id: string) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

// Unsubscribe customer
export const unsubscribeCustomer = async (id: string) => {
  const response = await api.put(`/customers/${id}/unsubscribe`);
  return response.data;
};

// Get customer statistics (Admin only)
export const getCustomerStats = async () => {
  const response = await api.get('/customers/stats/dashboard');
  return response.data;
};

export default {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  unsubscribeCustomer,
  getCustomerStats,
};
