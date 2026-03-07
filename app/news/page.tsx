"use client";

import Link from "next/link";
import { Calendar, ArrowRight, Search, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import * as newsService from "@/services/newsService";
import categoryService, { Category } from "@/services/categoryService";
import Button from "@/components/ui/Button";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Read category from URL query parameter
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load categories and news in parallel
      const [newsResponse, categoriesData] = await Promise.all([
        newsService.getNews({ isActive: true }),
        categoryService.getCategories({ type: 'news', isActive: true })
      ]);
      
      setNews(newsResponse.data || []);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news
    .filter(newsItem => {
      const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || newsItem.category?.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#005e35] to-[#39b54a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tin tức & Kiến thức</h1>
            <p className="text-xl opacity-90">
              Cập nhật thông tin hữu ích về trồng trọt và nông nghiệp hữu cơ
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#39b54a] focus:outline-none text-gray-900 placeholder:text-gray-600"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#39b54a] focus:outline-none cursor-pointer text-gray-900 font-medium"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category._id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy tin tức phù hợp</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((newsItem) => (
                  <article key={newsItem._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                    {/* Image */}
                    <Link href={`/news/${newsItem.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={newsItem.featuredImage?.url || newsItem.image || "/placeholder-news.jpg"}
                          alt={newsItem.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#39b54a] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {newsItem.category?.name || 'Chưa phân loại'}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-3" suppressHydrationWarning>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(newsItem.publishedAt || newsItem.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{newsItem.views || 0}</span>
                        </div>
                      </div>

                      <Link href={`/news/${newsItem.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#39b54a] transition-colors">
                          {newsItem.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {newsItem.excerpt}
                      </p>

                      <Link href={`/news/${newsItem.slug}`}>
                        <Button variant="outline" size="sm" className="group/btn">
                          Xem thêm
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
