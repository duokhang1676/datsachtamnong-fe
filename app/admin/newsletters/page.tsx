"use client";

import { useState } from "react";
import { Mail, Trash2, Download, CheckCircle, XCircle, Search } from "lucide-react";
import { newsletters } from "@/data/mockData";

export default function NewslettersPage() {
  const [subscribersList, setSubscribersList] = useState(newsletters);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const filteredSubscribers = subscribersList.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribersList.filter((s) => s.status === "active").length;
  const unsubscribedCount = subscribersList.filter((s) => s.status === "unsubscribed").length;

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa email này?")) {
      setSubscribersList(subscribersList.filter((sub) => sub._id !== id));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Email", "Ngày đăng ký", "Trạng thái", "Nguồn"].join(","),
      ...filteredSubscribers.map((sub) =>
        [
          sub.email,
          new Date(sub.subscribedAt).toLocaleDateString("vi-VN"),
          sub.status === "active" ? "Đang hoạt động" : "Đã hủy",
          sub.source || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đăng ký nhận tin</h1>
        <p className="text-gray-600 mt-2">
          Quản lý danh sách email đăng ký nhận bản tin và khuyến mãi
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng số đăng ký</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{subscribersList.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đang hoạt động</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đã hủy</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{unsubscribedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="unsubscribed">Đã hủy</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8f3a] transition-colors"
          >
            <Download size={20} />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Nguồn
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy email nào
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {subscriber.source === "footer-form"
                          ? "Form footer"
                          : subscriber.source === "checkout"
                          ? "Checkout"
                          : "Khác"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={14} />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={14} />
                          Đã hủy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{filteredSubscribers.length}</span> trong tổng số{" "}
            <span className="font-semibold">{subscribersList.length}</span> email
          </p>
        </div>
      </div>
    </div>
  );
}
