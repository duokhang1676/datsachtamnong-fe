"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Newspaper, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import * as newsService from "@/services/newsService";
import categoryService, { Category } from "@/services/categoryService";

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch news from API
  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories({ type: 'news' });
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await newsService.getNews({});
      setNews(data.data || []);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (articleId: string) => {
    router.push(`/admin/news/${articleId}`);
  };

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${articleTitle}"?`)) {
      return;
    }

    try {
      await newsService.deleteNews(articleId);
      alert('Đã xóa bài viết thành công!');
      fetchNews(); // Reload news list
    } catch (err: any) {
      console.error("Error deleting news:", err);
      alert(err.response?.data?.message || 'Không thể xóa bài viết');
    }
  };

  const handleView = (articleId: string) => {
    window.open(`/news/${articleId}`, '_blank');
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category?.slug === selectedCategory;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && article.isActive) ||
      (selectedStatus === "inactive" && !article.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tin tức</h1>
              <p className="text-gray-600">Tổng {news.length} bài viết • {news.filter(n => n.isActive).length} đã xuất bản</p>
            </div>
            <button 
              onClick={() => router.push('/admin/news/new')}
              className="bg-[#39b54a] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#2d8f3a] transition-colors"
            >
              <Plus size={20} />
              Viết bài mới
            </button>
          </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đã xuất bản</option>
            <option value="inactive">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bài viết</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lượt xem</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-40">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 w-40">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNews.map((article, index) => (
                <tr key={article._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {article.featuredImage?.url ? (
                        <img 
                          src={article.featuredImage.url} 
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Newspaper size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="max-w-md">
                        <p className="font-medium text-gray-900 line-clamp-2">{article.title}</p>
                        <p className="text-sm text-gray-500">N{String(index + 1).padStart(3, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {article.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600" suppressHydrationWarning>
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye size={16} />
                      <span className="text-sm">{article.views || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {article.isActive ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(article._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(article._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(article._id, article.title)}
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
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Không tìm thấy bài viết</p>
            <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Tổng bài viết</p>
            <p className="text-2xl font-bold text-gray-900">{news.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Đã xuất bản</p>
            <p className="text-2xl font-bold text-green-600">{news.filter(n => n.isActive).length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Bản nháp</p>
            <p className="text-2xl font-bold text-gray-600">{news.filter(n => !n.isActive).length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Danh mục</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
