"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Package } from "lucide-react";
import { Order } from "@/types";

// Mock orders
const mockOrders: Order[] = [
  {
    _id: "order1",
    userId: "user1",
    items: [],
    totalAmount: 340000,
    status: "delivered",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      province: "TP.HCM",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
  },
];

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const getStatusBadge = (status: Order["status"]) => {
    const statusMap = {
      pending: { variant: "warning" as const, label: "Chờ thanh toán" },
      paid: { variant: "info" as const, label: "Đã thanh toán" },
      processing: { variant: "info" as const, label: "Đang xử lý" },
      shipped: { variant: "info" as const, label: "Đang giao" },
      delivered: { variant: "success" as const, label: "Đã giao" },
      cancelled: { variant: "danger" as const, label: "Đã hủy" },
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-2">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "Tất cả" : getStatusBadge(status as any).label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {mockOrders.length > 0 ? (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Mã đơn hàng: <span className="font-semibold">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày đặt: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(order.status).variant}>
                    {getStatusBadge(order.status).label}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        Tổng tiền: {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Thanh toán: {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order._id}`}
                      className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Chưa có đơn hàng nào</p>
            <Link
              href="/products"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
