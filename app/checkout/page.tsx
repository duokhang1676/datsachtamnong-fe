"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/data/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  const subtotal = getCartTotal();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock order creation
    const newOrderId = "DH" + Date.now();
    setOrderId(newOrderId);
    setShowQR(true);
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-4">Đặt hàng thành công!</h2>
              <p className="text-gray-600 mb-2">Mã đơn hàng: <span className="font-semibold">{orderId}</span></p>
              <p className="text-gray-600 mb-8">
                Vui lòng quét mã QR để thanh toán
              </p>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 w-64 h-64 mx-auto mb-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm text-gray-600">Mã QR thanh toán</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
                <p className="text-sm text-gray-700">Ngân hàng: <span className="font-medium">Vietcombank</span></p>
                <p className="text-sm text-gray-700">Số TK: <span className="font-medium">1234567890</span></p>
                <p className="text-sm text-gray-700">Chủ TK: <span className="font-medium">NGUYEN VAN A</span></p>
                <p className="text-sm text-gray-700">Số tiền: <span className="font-bold text-green-600">{formatPrice(total)}</span></p>
                <p className="text-sm text-gray-700">Nội dung: <span className="font-medium">{orderId}</span></p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán
              </p>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    clearCart();
                    router.push("/orders");
                  }}
                >
                  Xem đơn hàng
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    clearCart();
                    router.push("/");
                  }}
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Thông tin nhận hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Số điện thoại *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="md:col-span-2"
                  />
                  <Input
                    label="Tỉnh/Thành phố *"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    required
                  />
                  <Input
                    label="Quận/Huyện *"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                  <Input
                    label="Phường/Xã *"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    label="Địa chỉ cụ thể *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ghi chú về đơn hàng (không bắt buộc)"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Phương thức thanh toán</h3>
                <label className="flex items-center gap-3 p-4 border-2 border-green-600 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    defaultChecked
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium">Chuyển khoản ngân hàng (QR Code)</p>
                    <p className="text-sm text-gray-600">Quét mã QR để thanh toán</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Đơn hàng ({cart.length} sản phẩm)</h3>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full mt-6">
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
