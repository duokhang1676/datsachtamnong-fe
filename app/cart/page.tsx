"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/data/constants";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
          <Link href="/products">
            <Button size="lg">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-6 border-b last:border-b-0"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-3xl">📦</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="font-semibold hover:text-green-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Tổng kết đơn hàng</h3>

              <div className="space-y-3 mb-4">
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

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                    Mua thêm {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận
                    chuyển
                  </p>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-green-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mb-3">
                  Tiến hành thanh toán
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
