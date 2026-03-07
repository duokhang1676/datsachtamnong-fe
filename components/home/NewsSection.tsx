"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import * as newsService from "@/services/newsService";
import Button from "../ui/Button";

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNews({ 
        isActive: true,
        limit: 3
      });
      setNews(response.data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tin tức & Kiến thức</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cập nhật thông tin hữu ích về trồng trọt, chăm sóc cây và kiến thức nông nghiệp
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tin tức & Kiến thức</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cập nhật thông tin hữu ích về trồng trọt, chăm sóc cây và kiến thức nông nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {news.length > 0 ? (
            news.map((newsItem) => (
              <article key={newsItem._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Image */}
                <Link href={`/news/${newsItem.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={newsItem.featuredImage || "/placeholder-news.jpg"}
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
                      <span>{newsItem.views || 0} lượt xem</span>
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
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Chưa có tin tức</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/news">
            <Button size="lg" className="group">
              Xem tất cả tin tức
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
