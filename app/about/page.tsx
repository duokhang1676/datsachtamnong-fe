"use client";

import { CheckCircle, Leaf, Award, Users, Heart, Target, TrendingUp, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#39b54a]" />,
      title: "Chất lượng đảm bảo",
      description: "Cam kết 100% sản phẩm đạt tiêu chuẩn chất lượng cao nhất"
    },
    {
      icon: <Leaf className="w-10 h-10 text-[#39b54a]" />,
      title: "Thân thiện môi trường",
      description: "Sản xuất từ nguyên liệu tự nhiên, không gây hại môi trường"
    },
    {
      icon: <Heart className="w-10 h-10 text-[#39b54a]" />,
      title: "Tận tâm phục vụ",
      description: "Đặt lợi ích khách hàng lên hàng đầu, hỗ trợ 24/7"
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-[#39b54a]" />,
      title: "Đổi mới không ngừng",
      description: "Nghiên cứu và cải tiến sản phẩm liên tục"
    }
  ];

  const stats = [
    { number: "10+", label: "Năm kinh nghiệm" },
    { number: "50,000+", label: "Khách hàng tin dùng" },
    { number: "100%", label: "Sản phẩm hữu cơ" },
    { number: "24/7", label: "Hỗ trợ khách hàng" }
  ];

  const milestones = [
    {
      year: "2014",
      title: "Khởi đầu",
      description: "Thành lập công ty với tầm nhìn cung cấp đất sạch chất lượng cao"
    },
    {
      year: "2017",
      title: "Mở rộng sản xuất",
      description: "Đầu tư nhà máy sản xuất hiện đại tại xã Mỏ Cày tỉnh Vĩnh Long"
    },
    {
      year: "2020",
      title: "Chứng nhận hữu cơ",
      description: "Đạt chứng nhận sản phẩm hữu cơ quốc tế"
    },
    {
      year: "2024",
      title: "Phát triển bền vững",
      description: "Mở rộng thị trường toàn quốc và xuất khẩu"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#005e35] to-[#39b54a] text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Đất Sạch Tam Nông
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-light">
              Sản phẩm đất sạch hữu cơ chất lượng cao từ Vĩnh Long
            </p>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Chúng tôi tự hào là đơn vị tiên phong trong việc sản xuất và cung cấp đất sạch hữu cơ, 
              mang đến giải pháp trồng trọt an toàn, hiệu quả cho mọi gia đình Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <strong className="text-[#005e35]">Đất Sạch Tam Nông</strong> được thành lập với sứ mệnh mang đến 
                    những sản phẩm đất sạch, hữu cơ chất lượng cao nhất cho người tiêu dùng Việt Nam. Xuất phát từ 
                    niềm đam mê nông nghiệp và mong muốn góp phần xây dựng một nền nông nghiệp xanh, bền vững.
                  </p>
                  <p>
                    Chúng tôi hiểu rằng, đất trồng chất lượng là nền tảng quan trọng nhất để tạo ra cây trồng khỏe mạnh, 
                    an toàn. Vì vậy, mỗi sản phẩm của chúng tôi đều được sản xuất từ nguyên liệu hữu cơ tự nhiên, 
                    trải qua quy trình kiểm soát chất lượng nghiêm ngặt.
                  </p>
                  <p>
                    Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ sản xuất hiện đại, chúng tôi không ngừng 
                    nghiên cứu và phát triển để mang đến những sản phẩm tốt nhất, đáp ứng nhu cầu đa dạng của 
                    khách hàng từ trồng rau gia đình đến sản xuất nông nghiệp quy mô lớn.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/product.jpg"
                  alt="Đất Sạch Tam Nông"
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#005e35] to-[#39b54a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Những giá trị mà chúng tôi luôn hướng tới trong mọi hoạt động
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hành trình phát triển
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Những cột mốc quan trọng đánh dấu sự phát triển của chúng tôi
              </p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#39b54a] opacity-20"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-[#005e35] mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#39b54a] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ưu điểm sản phẩm
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Tại sao khách hàng tin tưởng lựa chọn Đất Sạch Tam Nông
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "100% nguyên liệu hữu cơ tự nhiên, không chứa hóa chất độc hại",
                "Quy trình sản xuất khép kín, kiểm soát chất lượng nghiêm ngặt",
                "Tơi xốp, thoát nước tốt, giúp rễ cây phát triển khỏe mạnh",
                "Giàu dinh dưỡng, cung cấp đầy đủ khoáng chất cần thiết",
                "Sử dụng trực tiếp, không cần ủ, tiện lợi cho người dùng",
                "Phù hợp với mọi loại cây trồng: rau, hoa, cây cảnh, cây ăn quả",
                "Độ pH cân bằng, phù hợp với đa số loại cây trồng",
                "An toàn tuyệt đối cho người sử dụng và môi trường",
                "Giá cả hợp lý, đảm bảo chất lượng tốt nhất",
                "Giao hàng nhanh chóng, đóng gói cẩn thận"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="w-6 h-6 text-[#39b54a] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#005e35] to-[#39b54a] text-white p-8 rounded-2xl shadow-xl">
              <Target className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Sứ mệnh</h3>
              <p className="text-lg leading-relaxed opacity-95">
                Cung cấp sản phẩm đất sạch hữu cơ chất lượng cao, góp phần phát triển nền nông nghiệp 
                xanh, bền vững và nâng cao chất lượng cuộc sống cho cộng đồng.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#39b54a] to-[#02a319] text-white p-8 rounded-2xl shadow-xl">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
              <p className="text-lg leading-relaxed opacity-95">
                Trở thành thương hiệu đất sạch hữu cơ hàng đầu Việt Nam, được tin dùng bởi hàng triệu 
                gia đình và đóng góp tích cực vào việc bảo vệ môi trường.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#005e35] to-[#39b54a] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hãy để chúng tôi đồng hành cùng bạn
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Liên hệ ngay với chúng tôi để được tư vấn và trải nghiệm sản phẩm chất lượng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-[#005e35] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Xem sản phẩm
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#005e35] transition-colors"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
