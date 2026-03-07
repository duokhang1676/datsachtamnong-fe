"use client";

import { useState, useEffect } from "react";
import { Save, Building2, Phone, Mail, MapPin, Facebook, RefreshCw } from "lucide-react";
import * as settingsService from "@/services/settingsService";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    slogan: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    factory: "",
    facebook: "",
    zalo: "",
    instagram: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await settingsService.getSettings();
      
      setFormData({
        siteName: data.siteName || "",
        slogan: data.slogan || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        address: data.address || "",
        factory: data.factory || "",
        facebook: data.socialMedia?.facebook || "",
        zalo: data.socialMedia?.zalo || "",
        instagram: data.socialMedia?.instagram || "",
        metaTitle: data.seo?.metaTitle || "",
        metaDescription: data.seo?.metaDescription || "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải cài đặt");
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError("");
      
      await settingsService.updateSettings({
        siteName: formData.siteName,
        slogan: formData.slogan,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
        factory: formData.factory,
        socialMedia: {
          facebook: formData.facebook,
          zalo: formData.zalo,
          instagram: formData.instagram,
        },
        seo: {
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        },
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu cài đặt");
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Bạn có chắc muốn khôi phục cài đặt mặc định? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await settingsService.resetSettings();
      await fetchSettings();
      alert("Đã khôi phục cài đặt mặc định!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể reset cài đặt");
      console.error("Error resetting settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý thông tin công ty và cấu hình website</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} />
          Reset mặc định
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-700">✓ Đã lưu cài đặt thành công!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#39b54a] rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thông tin công ty</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên công ty
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thông tin liên hệ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Địa chỉ văn phòng
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building2 size={16} className="inline mr-2" />
                Địa chỉ nhà máy
              </label>
              <input
                type="text"
                name="factory"
                value={formData.factory}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Facebook size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Mạng xã hội</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zalo URL
              </label>
              <input
                type="url"
                name="zalo"
                value={formData.zalo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
                placeholder="https://zalo.me/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SEO</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cài đặt SEO</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
                placeholder="Tiêu đề trang web (50-60 ký tự)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaTitle.length} ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
                placeholder="Mô tả ngắn gọn về website (150-160 ký tự)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaDescription.length} ký tự
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#39b54a] text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#2d8f3a] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">Lưu ý</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Thay đổi sẽ được áp dụng ngay lập tức trên toàn bộ website</li>
          <li>• Đảm bảo thông tin chính xác trước khi lưu</li>
          <li>• Meta Title nên từ 50-60 ký tự để hiển thị tốt trên Google</li>
          <li>• Meta Description nên từ 150-160 ký tự</li>
        </ul>
      </div>
    </div>
  );
}
