"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import { COMPANY_INFO } from "@/data/constants";
import { createContact } from "@/services/contactService";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsSubmitting(true);
      await createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message
      });
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ văn phòng",
      content: settings?.address,
      color: "bg-blue-500"
    },
    {
      icon: MapPin,
      title: "Nhà máy sản xuất",
      content: settings?.factory,
      color: "bg-green-500"
    },
    {
      icon: Phone,
      title: "Hotline",
      content: settings?.contactPhone,
      link: `tel:${settings?.contactPhone}`,
      color: "bg-orange-500"
    },
    {
      icon: Mail,
      title: "Email",
      content: settings?.contactEmail,
      link: `mailto:${settings?.contactEmail}`,
      color: "bg-red-500"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
      color: "bg-purple-500"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-[#005e35] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className={`w-14 h-14 ${info.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 hover:text-[#39b54a] transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.content}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Form & Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Gửi Góp Ý Cho Chúng Tôi
                  </h2>
                  <p className="text-gray-600">
                    Vui lòng điền thông tin vào form dưới đây. Chúng tôi sẽ phản hồi trong 24 giờ.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Gửi thành công!
                    </h3>
                    <p className="text-gray-600">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#39b54a] focus:outline-none transition-colors text-gray-900 placeholder:text-gray-600"
                        placeholder="Nhập họ tên của bạn"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#39b54a] focus:outline-none transition-colors text-gray-900 placeholder:text-gray-600"
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10,11}"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#39b54a] focus:outline-none transition-colors text-gray-900 placeholder:text-gray-600"
                        placeholder="0912345678"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung góp ý <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#39b54a] focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-600"
                        placeholder="Nhập nội dung góp ý, câu hỏi hoặc yêu cầu hỗ trợ của bạn..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#39b54a] hover:bg-[#02a319] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Gửi góp ý
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Company Info & Map */}
              <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Image
                      src="/logo.jpg"
                      alt={COMPANY_INFO.fullName}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {COMPANY_INFO.fullName}
                      </h2>
                      <p className="text-[#39b54a] font-semibold">
                        {COMPANY_INFO.shortName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-[#39b54a] mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Văn phòng:</p>
                        <p>{settings?.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-[#39b54a] mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Nhà máy:</p>
                        <p>{settings?.factory}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-[#39b54a]" />
                      <div>
                        <p className="font-semibold text-gray-900">Hotline:</p>
                        <a
                          href={`tel:${settings?.contactPhone}`}
                          className="text-[#39b54a] font-bold hover:underline"
                        >
                          {settings?.contactPhone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-[#39b54a]" />
                      <div>
                        <p className="font-semibold text-gray-900">Email:</p>
                        <a
                          href={`mailto:${settings?.contactEmail}`}
                          className="text-[#39b54a] hover:underline"
                        >
                          {settings?.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {settings?.factory ? (
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(settings.factory.replace(/^Nhà máy sản xuất:\s*/i, ''))}&output=embed`}
                      width="100%"
                      height="256"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-64"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Đang tải bản đồ...</p>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Kết nối với chúng tôi
                  </h3>
                  <div className="flex gap-4">
                    {settings?.socialMedia?.facebook && (
                      <a
                        href={settings.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#1877F2] hover:bg-[#166FE5] rounded-full flex items-center justify-center transition-colors"
                        aria-label="Facebook"
                      >
                        <span className="text-white text-2xl font-bold">f</span>
                      </a>
                    )}
                    {settings?.socialMedia?.zalo && (
                      <a
                        href={settings.socialMedia.zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Zalo"
                      >
                        <Image src="/icons8-zalo.svg" alt="Zalo" width={28} height={28} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#005e35] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bạn cần tư vấn ngay?
            </h2>
            <p className="text-lg mb-6 text-gray-100">
              Liên hệ hotline để được tư vấn miễn phí về sản phẩm và giải pháp canh tác
            </p>
            <a
              href={`tel:${settings?.contactPhone}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#39b54a] hover:bg-[#02a319] text-white rounded-lg font-bold text-lg transition-colors"
            >
              <Phone size={24} />
              {settings?.contactPhone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
