import api from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  
  // Save token and user to localStorage
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data;
};

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  
  // Save token and user to localStorage
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

// Update user details
export const updateDetails = async (data: { name: string; email: string }) => {
  const response = await api.put('/auth/updatedetails', data);
  
  // Update user in localStorage
  if (response.data.success) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data.data }));
  }
  
  return response.data.data;
};

// Update password
export const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const response = await api.put('/auth/updatepassword', data);
  
  // Update token
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/admin/login';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
