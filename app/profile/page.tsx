"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { User, Package, Lock, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cập nhật thông tin thành công!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "info"
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User size={20} />
                  <span>Thông tin cá nhân</span>
                </button>
                <Link
                  href="/orders"
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Package size={20} />
                  <span>Đơn hàng của tôi</span>
                </Link>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "password"
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Lock size={20} />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === "info" && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Họ và tên"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                    <Input
                      label="Số điện thoại"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <Button type="submit">Cập nhật thông tin</Button>
                  </form>
                </>
              )}

              {activeTab === "password" && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
                  <form className="space-y-4">
                    <Input label="Mật khẩu hiện tại" type="password" />
                    <Input label="Mật khẩu mới" type="password" />
                    <Input label="Xác nhận mật khẩu mới" type="password" />
                    <Button type="submit">Đổi mật khẩu</Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
