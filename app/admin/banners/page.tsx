'use client';

import { useState, useEffect } from 'react';
import { getBanners, createBanner, deleteBanner, reorderBanners } from '@/services/bannerService';
import { uploadImages } from '@/services/uploadService';
import { Banner } from '@/types';
import Button from '@/components/ui/Button';
import { Trash2, Upload, MoveUp, MoveDown } from 'lucide-react';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      // Upload images
      const uploadResult = await uploadImages(Array.from(files), 'banners');
      
      // Create banner for each uploaded image
      for (const img of uploadResult.data) {
        await createBanner({
          image: {
            url: img.url,
            publicId: img.publicId,
          },
          order: banners.length,
        });
      }

      fetchBanners();
      alert('Đã thêm banner thành công!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Có lỗi xảy ra khi upload banner');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      return;
    }

    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Có lỗi xảy ra khi xóa banner');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];

    // Update order numbers
    const reorderedData = newBanners.map((banner, idx) => ({
      id: banner._id,
      order: idx,
    }));

    try {
      await reorderBanners({ banners: reorderedData });
      setBanners(newBanners);
    } catch (error) {
      console.error('Error reordering banners:', error);
      alert('Có lỗi xảy ra khi sắp xếp lại banner');
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
        <p className="text-gray-600 mt-1">Quản lý ảnh banner hiển thị trên trang chủ</p>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#39b54a] text-white rounded-lg cursor-pointer hover:bg-[#2d8f3a] transition-colors">
          <Upload size={20} />
          <span>{uploading ? 'Đang tải lên...' : 'Tải ảnh banner lên'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">Có thể chọn nhiều ảnh cùng lúc</p>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Chưa có banner nào. Hãy tải ảnh lên.
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <div className="relative aspect-video">
                <img
                  src={banner.image.url}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(banner._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Thứ tự: {index + 1} • {new Date(banner.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
