"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, Sprout } from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Sản phẩm", href: "/products", icon: Sprout },
    { name: "Tin tức", href: "/news", icon: Search },
    { name: "Liên hệ", href: "/contact", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          {/* Large 404 Text */}
          <div className="relative">
            <h1 className="text-[180px] md:text-[240px] font-black text-gray-100 leading-none select-none">
              404
            </h1>
            
            {/* Plant Icons Decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Sprout 
                  size={80} 
                  className="text-[#39b54a] animate-bounce" 
                  style={{ animationDuration: '3s' }}
                />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#39b54a] rounded-full animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
          </p>
          <p className="text-gray-500">
            Có thể trang đã bị xóa, thay đổi đường dẫn hoặc không bao giờ tồn tại.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#39b54a] hover:bg-[#02a319] text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            Về trang chủ
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Hoặc truy cập các trang sau:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#39b54a]/10 rounded-full flex items-center justify-center group-hover:bg-[#39b54a] transition-colors">
                    <Icon size={24} className="text-[#39b54a] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#39b54a] transition-colors">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Nếu bạn cho rằng đây là lỗi, vui lòng</p>
          <Link href="/contact" className="text-[#39b54a] hover:underline font-semibold">
            liên hệ với chúng tôi
          </Link>
        </div>
      </div>
    </div>
  );
}
