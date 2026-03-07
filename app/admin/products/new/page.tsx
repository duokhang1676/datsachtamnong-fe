"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import categoryService, { Category } from "@/services/categoryService";
import * as productService from "@/services/productService";
import { uploadImages } from "@/services/uploadService";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    specifications: "",
    packaging: "",
    status: "available" as "available" | "unavailable" | "discontinued",
    isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getCategories({ type: 'product', isActive: true });
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Không thể tải danh mục');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles([...imageFiles, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setSubmitting(true);

      // Upload images first
      let uploadedImages: any[] = [];
      if (imageFiles.length > 0) {
        const uploadResult = await uploadImages(imageFiles);
        uploadedImages = uploadResult.data.map((img: any) => ({
          url: img.url,
          publicId: img.publicId
        }));
      }
      
      // Prepare product data
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        specifications: formData.specifications,
        packaging: formData.packaging,
        status: formData.status,
        isFeatured: formData.isFeatured,
        images: uploadedImages,
      };

      // Create product via API
      await productService.createProduct(productData);
      
      alert("Đã thêm sản phẩm mới thành công!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert(error.message || "Không thể thêm sản phẩm. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
          <p className="text-gray-600 mt-1">Điền thông tin sản phẩm bên dưới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              placeholder="Ví dụ: Đất sạch hữu cơ 20L"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              disabled={loadingCategories}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{loadingCategories ? 'Đang tải...' : 'Chọn danh mục'}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ảnh sản phẩm
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                <Upload size={20} className="text-gray-600" />
                <span className="text-sm text-gray-700">Tải ảnh lên</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Thông số kỹ thuật
            </label>
            <textarea
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              placeholder="Thành phần: Hữu cơ 100%\nCông dụng: Trồng rau, hoa\nKhối lượng: 20kg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nhập mỗi thông số trên một dòng theo định dạng: Tên: Giá trị
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Đóng gói
            </label>
            <input
              type="text"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              placeholder="Ví dụ: Bao 20L, Bao 50L..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "available" | "unavailable" | "discontinued" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            >
              <option value="available">Còn hàng</option>
              <option value="unavailable">Hết hàng</option>
              <option value="discontinued">Ngừng bán</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 text-[#39b54a] border-gray-300 rounded focus:ring-2 focus:ring-[#39b54a]"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-900 cursor-pointer flex-1">
              ⭐ Hiển thị sản phẩm nổi bật trên trang chủ
              <p className="text-xs text-gray-600 font-normal mt-1">
                Sản phẩm này sẽ được hiển thị ở phần &quot;Sản phẩm nổi bật&quot; trên trang chủ
              </p>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#39b54a] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2d8f3a] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu sản phẩm
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
