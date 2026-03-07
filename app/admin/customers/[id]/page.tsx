"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import * as customerService from "@/services/customerService";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    status: "active" as "active" | "unsubscribed"
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await customerService.getCustomer(customerId);
        const customer = response.data;
        
        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          note: customer.note || "",
          status: customer.status || "active"
        });
      } catch (error: any) {
        console.error('Failed to fetch customer:', error);
        alert("Không tìm thấy khách hàng!");
        router.push("/admin/customers");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [customerId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Vui lòng nhập tên và email!");
      return;
    }

    try {
      setIsSubmitting(true);
      await customerService.updateCustomer(customerId, formData);
      alert("Cập nhật khách hàng thành công!");
      router.push("/admin/customers");
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa khách hàng</h1>
        <p className="text-gray-600">
          Cập nhật thông tin khách hàng
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "unsubscribed" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            >
              <option value="active">Đang hoạt động</option>
              <option value="unsubscribed">Đã hủy</option>
            </select>
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
