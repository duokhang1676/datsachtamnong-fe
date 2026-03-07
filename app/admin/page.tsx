"use client";

import { useState, useEffect } from "react";
import { Package, Newspaper, MessageSquare, Eye, Users, TrendingUp, BarChart3 } from "lucide-react";
import * as productService from "@/services/productService";
import * as customerService from "@/services/customerService";
import * as contactService from "@/services/contactService";
import * as newsService from "@/services/newsService";
import Link from "next/link";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalProducts: number;
  productsInStock: number;
  totalCustomers: number;
  totalContacts: number;
  newContacts: number;
  totalNews: number;
  activeNews: number;
  totalProductViews: number;
  totalNewsViews: number;
}

interface ViewStats {
  productViews: {
    name: string;
    views: number;
  }[];
  newsViews: {
    title: string;
    views: number;
  }[];
}

// Custom Tooltip with black text
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-black mb-1">{label}</p>
        <p className="text-sm text-black">
          <span className="font-medium">Lượt xem:</span> {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsRes, customersRes, contactsRes, newsRes, productStatsRes, newsStatsRes] = await Promise.all([
        productService.getProducts({ limit: 5 }),
        customerService.getCustomerStats(),
        contactService.getContacts({ limit: 100 }),
        newsService.getNews({ limit: 5, isActive: true }),
        productService.getProductStats(),
        newsService.getNewsStats()
      ]);

      // Extract stats
      const products = productsRes.data || [];
      const contactsData = contactsRes.data || [];
      const newsData = newsRes.data || [];
      
      setStats({
        totalProducts: productsRes.total || 0,
        productsInStock: products.filter((p: any) => p.status === 'in-stock').length,
        totalCustomers: customersRes.data?.total || 0,
        totalContacts: contactsData.length,
        newContacts: contactsData.filter((c: any) => c.status === 'new').length,
        totalNews: newsRes.total || 0,
        activeNews: newsData.length,
        totalProductViews: productStatsRes?.totalViews || 0,
        totalNewsViews: newsStatsRes?.mostViewed?.reduce((sum: number, item: any) => sum + item.views, 0) || 0
      });

      // Prepare view stats for charts
      setViewStats({
        productViews: productStatsRes?.mostViewed?.map((p: any) => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          views: p.views
        })) || [],
        newsViews: newsStatsRes?.mostViewed?.map((n: any) => ({
          title: n.title.length > 20 ? n.title.substring(0, 20) + '...' : n.title,
          views: n.views
        })) || []
      });

      setRecentProducts(products);
      setRecentNews(newsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: Package, 
      label: "Tổng sản phẩm", 
      value: stats?.totalProducts || 0, 
      change: `${stats?.productsInStock || 0} còn hàng`,
      href: "/admin/products",
      color: "bg-blue-500"
    },
    { 
      icon: Users, 
      label: "Khách hàng", 
      value: stats?.totalCustomers || 0, 
      change: "Đăng ký nhận tin",
      href: "/admin/customers",
      color: "bg-green-500"
    },
    { 
      icon: MessageSquare, 
      label: "Liên hệ & Góp ý", 
      value: stats?.totalContacts || 0, 
      change: `${stats?.newContacts || 0} mới`,
      href: "/admin/contacts",
      color: "bg-orange-500"
    },
    { 
      icon: Newspaper, 
      label: "Tin tức", 
      value: stats?.totalNews || 0, 
      change: `${stats?.activeNews || 0} đã xuất bản`,
      href: "/admin/news",
      color: "bg-purple-500"
    },
  ];

  const viewCards = [
    {
      icon: Eye,
      label: "Lượt xem sản phẩm",
      value: stats?.totalProductViews || 0,
      change: "Tổng số lượt xem",
      color: "bg-cyan-500"
    },
    {
      icon: TrendingUp,
      label: "Lượt xem tin tức",
      value: stats?.totalNewsViews || 0,
      change: "Tổng số lượt xem",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng quan</h1>
        <p className="text-gray-600">Chào mừng bạn đến với trang quản lý Đất Sạch Tam Nông</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* View Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {viewCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Views Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-cyan-600" />
            <h3 className="font-bold text-lg text-gray-900">Top 5 sản phẩm được xem nhiều nhất</h3>
          </div>
          {viewStats && viewStats.productViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewStats.productViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Chưa có dữ liệu
            </div>
          )}
        </div>

        {/* News Views Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-indigo-600" />
            <h3 className="font-bold text-lg text-gray-900">Top 5 tin tức được xem nhiều nhất</h3>
          </div>
          {viewStats && viewStats.newsViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewStats.newsViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Sản phẩm gần đây</h3>
            <Link href="/admin/products" className="text-sm text-[#39b54a] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category?.name || 'Chưa phân loại'} • 
                      <span className={
                        product.status === 'available' ? "text-green-600" : 
                        product.status === 'unavailable' ? "text-red-600" : 
                        "text-gray-600"
                      }>
                        {" "}{
                          product.status === 'available' ? 'Còn hàng' :
                          product.status === 'unavailable' ? 'Hết hàng' :
                          'Ngừng bán'
                        }
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có sản phẩm</p>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Tin tức mới nhất</h3>
            <Link href="/admin/news" className="text-sm text-[#39b54a] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.map((article) => (
              <div key={article._id} className="py-3 border-b last:border-b-0">
                <p className="font-medium text-gray-900 mb-1 line-clamp-2">{article.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-[#39b54a] text-white rounded text-xs">
                    {article.category?.name || 'Chưa phân loại'}
                  </span>
                  <span suppressHydrationWarning>
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
            {recentNews.length === 0 && (
              <p className="text-gray-500 text-center py-4">Chưa có tin tức</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Package size={32} className="mb-3" />
            <h4 className="font-bold text-lg mb-1">Quản lý sản phẩm</h4>
            <p className="text-sm text-blue-100">Thêm, sửa, xóa sản phẩm</p>
          </Link>

          <Link
            href="/admin/news"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Newspaper size={32} className="mb-3" />
            <h4 className="font-bold text-lg mb-1">Quản lý tin tức</h4>
            <p className="text-sm text-green-100">Đăng bài viết mới</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <MessageSquare size={32} className="mb-3" />
            <h4 className="font-bold text-lg mb-1">Cài đặt</h4>
            <p className="text-sm text-purple-100">Quản lý thông tin công ty</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
