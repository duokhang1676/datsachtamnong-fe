"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Mail, Phone, MapPin, Globe } from "lucide-react";
import { COMPANY_INFO } from "@/data/constants";
import { createCustomer } from "@/services/customerService";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage("Vui lòng nhập email hợp lệ!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      await createCustomer({
        name: email.split('@')[0], // Use email username as name
        email: email,
        source: 'footer'
      });
      setMessage("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
      setEmail("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <>
      <footer className="bg-[#005e35] text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{COMPANY_INFO.fullName}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#39b54a] mt-1 flex-shrink-0" />
                  <p>{settings?.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#39b54a] mt-1 flex-shrink-0" />
                  <p>{settings?.factory}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#39b54a]" />
                  <a href={`tel:${settings?.contactPhone}`} className="hover:text-[#39b54a]">
                    {settings?.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#39b54a]" />
                  <a href={`mailto:${settings?.contactEmail}`} className="hover:text-[#39b54a]">
                    {settings?.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-[#39b54a]" />
                  <span>www.datsachtamnong.vn</span>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hỗ trợ khách hàng</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shipping-policy" className="hover:text-[#39b54a] transition-colors">
                    Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-[#39b54a] transition-colors">
                    Chính sách đổi/trả
                  </Link>
                </li>
                <li>
                  <Link href="/payment-policy" className="hover:text-[#39b54a] transition-colors">
                    Hình thức thanh toán
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#39b54a] transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#39b54a] transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#39b54a] transition-colors">
                    Giới thiệu công ty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h3 className="text-xl font-bold mb-4">Đăng ký nhận tin</h3>
              <p className="text-sm mb-4">Nhận thông tin khuyến mãi và sản phẩm mới nhất</p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 bg-white border-2 border-white focus:outline-none focus:border-[#39b54a] disabled:bg-gray-100"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#39b54a] hover:bg-[#02a319] rounded-r-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
                  </button>
                </div>
                {message && (
                  <p className={`mt-2 text-sm ${message.includes('thành công') ? 'text-green-300' : 'text-red-300'}`}>
                    {message}
                  </p>
                )}
              </form>

              <h4 className="text-lg font-bold mb-3">Kết nối với chúng tôi</h4>
              <div className="flex gap-3 mb-6">
                {settings?.socialMedia?.facebook && (
                  <a
                    href={settings.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {settings?.socialMedia?.zalo && (
                  <a
                    href={settings.socialMedia.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Zalo"
                  >
                    <Image src="/icons8-zalo.svg" alt="Zalo" width={24} height={24} />
                  </a>
                )}
              </div>

              <h4 className="text-lg font-bold mb-3">Thanh toán linh hoạt</h4>
              <p className="text-sm">Thanh toán sau (COD)</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar - Desktop */}
        <div className="hidden md:block bg-[#004428] border-t border-[#39b54a]">
          <div className="container mx-auto px-4">
            <nav className="flex justify-center items-center py-3">
              <ul className="flex gap-8 text-sm">
                <li>
                  <Link href="/" className="hover:text-[#39b54a] transition-colors">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#39b54a] transition-colors">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#39b54a] transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#39b54a] transition-colors">
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-[#39b54a] transition-colors">
                    Tin tức
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-[#003820] py-4 text-center text-xs text-gray-300">
          <div className="container mx-auto px-4">
            <p className="mb-1">{COMPANY_INFO.fullName}</p>
            <p className="mb-1">Giấy phép kinh doanh số: {COMPANY_INFO.businessLicense}</p>
            <p>Copyrights © {new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Fixed Contact Buttons - Right Side (Like LAVAMIX TOC buttons) */}
      <div className="fixed right-4 bottom-20 z-40 flex flex-col gap-3">
        {/* Zalo */}
        {settings?.socialMedia?.zalo && (
          <a
            href={settings.socialMedia.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label="Chat Zalo"
          >
            <Image src="/icons8-zalo.svg" alt="Zalo" width={32} height={32} />
          </a>
        )}
        
        {/* Phone */}
        <a
          href={`tel:${settings?.contactPhone}`}
          className="w-14 h-14 bg-[#39b54a] hover:bg-[#02a319] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Gọi điện"
        >
          <Phone size={28} className="text-white" />
        </a>

        {/* Facebook Messenger */}
        {settings?.socialMedia?.facebook && (
          <a
            href={settings.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label="Chat Facebook"
          >
            <Facebook size={28} className="text-white" />
          </a>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Like LAVAMIX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#005e35]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-[10px] text-gray-700 mt-1">Trang chủ</span>
          </Link>
          
          <Link
            href="/products"
            className="flex flex-col items-center justify-center py-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#005e35]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span className="text-[10px] text-gray-700 mt-1">Sản phẩm</span>
          </Link>
          
          <a
            href={`tel:${settings?.contactPhone}`}
            className="flex flex-col items-center justify-center py-2 hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 -mt-6 bg-[#39b54a] rounded-full flex items-center justify-center shadow-lg">
              <Phone size={24} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-700 mt-1">Gọi ngay</span>
          </a>
          
          <Link
            href="/about"
            className="flex flex-col items-center justify-center py-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#005e35]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] text-gray-700 mt-1">Giới thiệu</span>
          </Link>
          
          <Link
            href="/contact"
            className="flex flex-col items-center justify-center py-2 hover:bg-gray-100 transition-colors"
          >
            <Mail size={24} className="text-[#005e35]" />
            <span className="text-[10px] text-gray-700 mt-1">Liên hệ</span>
          </Link>
        </div>
      </div>
    </>
  );
}
