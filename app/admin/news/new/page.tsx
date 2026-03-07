"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import categoryService from "@/services/categoryService";
import { createNews } from "@/services/newsService";
import { uploadImages } from "@/services/uploadService";
import RichTextEditor from "@/components/admin/RichTextEditor";

// Disable static generation for this admin page
export const dynamic = 'force-dynamic';

export default function NewNewsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories({ type: 'news' });
      setCategories(data.filter((cat: any) => cat.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      alert("Vui lòng nhập đầy đủ tiêu đề, nội dung và danh mục!");
      return;
    }

    try {
      setSubmitting(true);

      // Upload featured image if selected
      let featuredImage = { url: "", publicId: "" };
      if (imageFile) {
        const uploadResult = await uploadImages([imageFile], 'news');
        featuredImage = {
          url: uploadResult.data[0].url,
          publicId: uploadResult.data[0].publicId
        };
      }

      // Create news
      await createNews({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        featuredImage: featuredImage.url || undefined,
        category: formData.category,
        tags: [],
        isActive: formData.isActive,
        publishedAt: new Date(),
      });

      alert("Đã thêm tin tức mới thành công!");
      router.push("/admin/news");
    } catch (error: any) {
      console.error("Error creating news:", error);
      alert(error.response?.data?.message || "Không thể thêm tin tức. Vui lòng thử lại!");
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
        <h1 className="text-3xl font-bold text-gray-900">Viết bài mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ảnh đại diện
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                <Upload size={20} className="text-gray-600" />
                <span className="text-sm text-gray-700">Tải ảnh lên</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-64 h-40">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tóm tắt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              placeholder="Mô tả ngắn gọn về bài viết..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Nhập nội dung bài viết. Sử dụng toolbar để định dạng văn bản và chèn ảnh..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.isActive ? "published" : "draft"}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "published" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo mới
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
