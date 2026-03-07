"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderTree, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import categoryService, { Category } from "@/services/categoryService";

export default function ProductCategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories({ type: 'product' });
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
      alert('Xóa danh mục thành công!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh mục Sản phẩm</h1>
        <p className="text-gray-600 mt-2">Quản lý danh mục cho sản phẩm</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          />
        </div>
        <button
          onClick={() => router.push('/admin/product-categories/new')}
          className="flex items-center gap-2 px-6 py-3 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8b3a] transition-colors"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mô tả</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thứ tự</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {category.image?.url ? (
                          <img 
                            src={category.image.url} 
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FolderTree size={24} className="text-[#39b54a]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-md line-clamp-2">
                      {category.description || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{category.order}</span>
                  </td>
                  <td className="px-6 py-4">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye size={12} />
                        Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <EyeOff size={12} />
                        Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/product-categories/${category._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <FolderTree size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy danh mục nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <p>
          Hiển thị <span className="font-medium text-gray-900">{filteredCategories.length}</span> / <span className="font-medium text-gray-900">{categories.length}</span> danh mục
        </p>
      </div>
    </div>
  );
}
