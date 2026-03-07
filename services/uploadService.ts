import api from '../lib/api';

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Upload single image
export const uploadImage = async (file: File, folder: string = 'products') => {
  const base64 = await fileToBase64(file);
  const response = await api.post('/upload/image', { image: base64, folder });
  return response.data;
};

// Upload multiple images
export const uploadImages = async (files: File[], folder: string = 'products') => {
  const base64Promises = files.map(file => fileToBase64(file));
  const base64Images = await Promise.all(base64Promises);
  
  const response = await api.post('/upload/images', { images: base64Images, folder });
  return response.data;
};

// Delete image
export const deleteImage = async (publicId: string) => {
  const response = await api.delete(`/upload/image/${publicId}`);
  return response.data;
};
