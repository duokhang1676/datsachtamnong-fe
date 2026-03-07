import api from '../lib/api';

export interface OrderItem {
  product: string;
  quantity: number;
}

export interface CreateOrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street?: string;
      ward?: string;
      district?: string;
      city?: string;
      fullAddress: string;
    };
  };
  items: OrderItem[];
  totalAmount: number; // Required - frontend must calculate
  shippingFee?: number;
  paymentMethod?: 'cod' | 'bank-transfer' | 'momo' | 'vnpay';
  note?: string;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

// Get all orders (Admin only)
export const getOrders = async (filters?: OrderFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const response = await api.get(`/orders?${params.toString()}`);
  return response.data;
};

// Get single order
export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Create order
export const createOrder = async (orderData: CreateOrderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Update order (Admin only)
export const updateOrder = async (id: string, orderData: Partial<CreateOrderData>) => {
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
};

// Update order status (Admin only)
export const updateOrderStatus = async (id: string, status: string, note?: string) => {
  const response = await api.put(`/orders/${id}/status`, { status, note });
  return response.data;
};

// Delete order (Admin only)
export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// Get order statistics (Admin only)
export const getOrderStats = async () => {
  const response = await api.get('/orders/stats/dashboard');
  return response.data;
};

export default {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
};
