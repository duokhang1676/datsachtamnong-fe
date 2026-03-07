import api from '../lib/api';

export interface ContactFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Get all contacts (Admin only)
export const getContacts = async (filters?: ContactFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const response = await api.get(`/contacts?${params.toString()}`);
  return response.data;
};

// Get single contact (Admin only)
export const getContact = async (id: string) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

// Create contact (submit contact form)
export const createContact = async (contactData: CreateContactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

// Update contact status (Admin only)
export const updateContactStatus = async (id: string, status: string, replyNote?: string) => {
  const response = await api.put(`/contacts/${id}/status`, { status, replyNote });
  return response.data;
};

// Delete contact (Admin only)
export const deleteContact = async (id: string) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// Get contact statistics (Admin only)
export const getContactStats = async () => {
  const response = await api.get('/contacts/stats/dashboard');
  return response.data;
};
