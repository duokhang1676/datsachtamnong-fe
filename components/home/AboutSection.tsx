"use client";

import Link from "next/link";
import Button from "../ui/Button";
import { ArrowRight, CheckCircle, Leaf } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/product.jpg"
                  alt="Đất Sạch Tam Nông"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#39b54a] text-white p-6 rounded-2xl shadow-xl max-w-[200px]">
                <Leaf className="w-12 h-12 mb-2" />
                <p className="font-bold text-lg">100% Hữu Cơ</p>
                <p className="text-sm opacity-90">Sản phẩm tự nhiên</p>
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-green-100 text-[#005e35] px-4 py-2 rounded-full text-sm font-semibold">
                  VỀ CHÚNG TÔI
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Đất Sạch Tam Nông
              </h2>
              
              <h3 className="text-xl text-[#39b54a] font-semibold mb-6">
                Sản phẩm đất sạch chất lượng cao từ Vĩnh Long
              </h3>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Chúng tôi chuyên cung cấp đất sạch hữu cơ cao cấp, được sản xuất từ nguyên liệu tự nhiên, 
                đảm bảo an toàn tuyệt đối cho mọi loại cây trồng. Với quy trình sản xuất khép kín và 
                kiểm soát chất lượng nghiêm ngặt, sản phẩm của chúng tôi luôn đáp ứng các tiêu chuẩn cao nhất.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#39b54a] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">100% nguyên liệu hữu cơ tự nhiên, không hóa chất</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#39b54a] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tơi xốp, thoát nước tốt, giàu dinh dưỡng</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#39b54a] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Sử dụng trực tiếp, không cần ủ, tiện lợi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#39b54a] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Phù hợp cho mọi loại cây trồng và điều kiện khí hậu</span>
                </li>
              </ul>

              <Link href="/about">
                <Button size="lg" className="group">
                  Xem thêm về chúng tôi
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
