"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as customerService from "@/services/customerService";
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit,
  FileText
} from "lucide-react";

interface Customer {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  source: "footer" | "checkout" | "manual" | "contact";
  status: "active" | "unsubscribed";
  createdAt: string;
}

interface CustomerStats {
  total: number;
  active: number;
  unsubscribed: number;
  thisWeek: number;
  lastWeek: number;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [customersRes, statsRes] = await Promise.all([
        customerService.getCustomers({}),
        customerService.getCustomerStats()
      ]);
      setCustomers(customersRes.data || []);
      setStats(statsRes.data || null);
      
      // Debug: Log stats to console
      console.log("Customer Stats:", statsRes.data);
      console.log("This Week:", statsRes.data?.thisWeek);
      console.log("Last Week:", statsRes.data?.lastWeek);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Delete customer
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      return;
    }

    try {
      await customerService.deleteCustomer(id);
      await fetchData();
      alert("Đã xóa khách hàng thành công!");
    } catch (err: any) {
      alert(err.message || "Không thể xóa khách hàng");
    }
  };

  // Change status with confirmation
  const handleChangeStatus = async (id: string) => {
    const customer = customers.find(c => c._id === id);
    if (!customer) return;

    const newStatus = customer.status === "active" ? "unsubscribed" : "active";
    const statusText = newStatus === "active" ? "kích hoạt" : "hủy";
    
    if (!confirm(`Bạn có chắc chắn muốn ${statusText} khách hàng này?`)) {
      return;
    }

    try {
      if (newStatus === "unsubscribed") {
        await customerService.unsubscribeCustomer(id);
      } else {
        await customerService.updateCustomer(id, { status: "active" });
      }
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật trạng thái");
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["Tên", "Email", "Số điện thoại", "Ngày đăng ký", "Nguồn", "Trạng thái"];
    const rows = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      customer.phone || "Trống",
      new Date(customer.createdAt).toLocaleDateString("vi-VN"),
      customer.source === "footer" ? "Footer" : 
        customer.source === "checkout" ? "Checkout" : 
        customer.source === "contact" ? "Liên hệ" : "Thủ công",
      customer.status === "active" ? "Đang hoạt động" : "Đã hủy"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `khach-hang-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get source badge
  const getSourceBadge = (source: Customer["source"]) => {
    switch (source) {
      case "footer":
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Footer</span>;
      case "checkout":
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Checkout</span>;
      case "manual":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Thủ công</span>;
      case "contact":
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Liên hệ</span>;
    }
  };

  const weeklyChange = (stats?.thisWeek || 0) - (stats?.lastWeek || 0);
  const weeklyChangePercent = (stats?.lastWeek || 0) > 0 ? ((weeklyChange / (stats?.lastWeek || 1)) * 100).toFixed(1) : "0";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách hàng</h1>
          <p className="text-gray-600">
            Quản lý thông tin khách hàng đăng ký nhận tin và liên hệ
          </p>
          <p className="text-sm text-blue-600 mt-1">
            💡 Khách hàng từ trang "Liên hệ & Góp ý" sẽ tự động được thêm vào đây với nguồn "Liên hệ"
          </p>
        </div>
        <Link
          href="/admin/customers/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8f3a] transition-colors"
        >
          <Plus size={20} />
          Thêm khách hàng
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={fetchData}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.active || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">So với tuần trước</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">{weeklyChange > 0 ? '+' : ''}{weeklyChange}</p>
                    {weeklyChange !== 0 && (
                      <span className={`flex items-center gap-1 text-sm font-medium ${weeklyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weeklyChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs(Number(weeklyChangePercent))}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Tuần này: {stats?.thisWeek || 0} | Tuần trước: {stats?.lastWeek || 0}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${weeklyChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {weeklyChange >= 0 ? 
                    <TrendingUp className="text-green-600" size={24} /> : 
                    <TrendingDown className="text-red-600" size={24} />
                  }
                </div>
              </div>
            </div>
          </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="unsubscribed">Đã hủy</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8f3a] transition-colors"
          >
            <Download size={18} />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Số điện thoại</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày đăng ký</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nguồn</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer._id} 
                  onClick={() => router.push(`/admin/customers/${customer._id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {customer.phone ? (
                        <>
                          <Phone size={14} />
                          {customer.phone}
                        </>
                      ) : (
                        <span className="text-gray-400">Trống</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span suppressHydrationWarning>
                        {formatDate(customer.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getSourceBadge(customer.source)}
                  </td>
                  <td className="px-6 py-4">
                    {customer.status === "active" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        <XCircle size={12} />
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/customers/${customer._id}`);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChangeStatus(customer._id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chuyển trạng thái"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer._id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy khách hàng nào
          </div>
        )}

        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
            Hiển thị {filteredCustomers.length} khách hàng
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
