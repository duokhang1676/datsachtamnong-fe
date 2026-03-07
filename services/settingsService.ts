import api from '../lib/api';

export interface SettingsData {
  siteName: string;
  slogan?: string;
  logo?: string;
  favicon?: string;
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

// Get settings
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data.data;
};

// Update settings (Admin only)
export const updateSettings = async (settingsData: Partial<SettingsData>) => {
  const response = await api.put('/settings', settingsData);
  return response.data.data;
};

// Reset settings to default (Admin only)
export const resetSettings = async () => {
  const response = await api.post('/settings/reset');
  return response.data.data;
};
