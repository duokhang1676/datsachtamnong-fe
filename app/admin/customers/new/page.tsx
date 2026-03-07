"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createCustomer } from "@/services/customerService";

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Vui lòng nhập tên và email!");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'manual',
        note: formData.note
      });
      alert("Thêm khách hàng thành công!");
      router.push("/admin/customers");
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm khách hàng mới</h1>
        <p className="text-gray-600">
          Nhập thông tin khách hàng để thêm vào danh sách
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên khách hàng"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Ví dụ: Nguyễn Văn A hoặc "Vãng lai" nếu không biết tên
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Email để gửi thông tin và tin tức đến khách hàng
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0912345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            />
            <p className="mt-1 text-sm text-gray-500">
              Số điện thoại liên hệ (không bắt buộc)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Nhập ghi chú về khách hàng (tùy chọn)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 resize-none"
            />
            <p className="mt-1 text-sm text-gray-500">
              Ghi chú nội bộ về khách hàng (VD: sở thích, lịch sử mua hàng, v.v.)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Khách hàng được thêm thủ công sẽ có nguồn là "Thủ công" và trạng thái mặc định là "Đang hoạt động"
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/admin/customers"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8f3a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSubmitting ? 'Đang lưu...' : 'Thêm khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
