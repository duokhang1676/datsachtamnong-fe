import { CheckCircle, Truck, Shield, Leaf } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Hữu cơ",
    description: "Đất sạch từ nguồn nguyên liệu tự nhiên, không hóa chất",
  },
  {
    icon: CheckCircle,
    title: "Chất lượng đảm bảo",
    description: "Kiểm tra chất lượng nghiêm ngặt trước khi xuất xưởng",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Thanh toán sau khi nhận hàng, giao tận nơi trong thời gian ngắn",
  },
  {
    icon: Shield,
    title: "Hỗ trợ tận tâm",
    description: "Tư vấn và hỗ trợ khách hàng 24/7",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Tại sao chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <feature.icon size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
