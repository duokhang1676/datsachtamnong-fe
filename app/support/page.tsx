"use client";

import { Shield, RefreshCw, Truck, CreditCard, Lock, Phone, Mail, MapPin } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function SupportPage() {
  const { settings } = useSettings();
  const policies = [
    {
      id: "warranty",
      title: "Chính sách bảo hành",
      icon: Shield,
      content: [
        {
          subtitle: "Điều kiện bảo hành",
          items: [
            "Sản phẩm còn nguyên tem, nhãn mác của nhà sản xuất",
            "Sản phẩm bị lỗi do nhà sản xuất (bao bì rách, sản phẩm bị vón cục, hư hỏng,...)",
            "Sản phẩm phải được bảo quản đúng hướng dẫn trên bao bì",
            "Có hóa đơn mua hàng hợp lệ"
          ]
        },
        {
          subtitle: "Thời gian bảo hành",
          items: [
            "Đất và phân bón hữu cơ: 6 tháng kể từ ngày sản xuất",
            "Phân bón hóa học: 12 tháng kể từ ngày sản xuất",
            "Dung dịch dinh dưỡng: 24 tháng kể từ ngày sản xuất"
          ]
        },
        {
          subtitle: "Quy trình bảo hành",
          items: [
            "Liên hệ hotline: " + (settings?.contactPhone || ""),
            "Gửi hình ảnh sản phẩm và hóa đơn mua hàng",
            "Bộ phận kỹ thuật sẽ xác nhận và hỗ trợ trong vòng 24h",
            "Đổi sản phẩm mới hoặc hoàn tiền 100% nếu sản phẩm lỗi do nhà sản xuất"
          ]
        }
      ]
    },
    {
      id: "return",
      title: "Chính sách đổi trả",
      icon: RefreshCw,
      content: [
        {
          subtitle: "Điều kiện đổi trả",
          items: [
            "Sản phẩm còn nguyên vẹn, chưa qua sử dụng",
            "Sản phẩm giao không đúng mẫu mã, số lượng đã đặt",
            "Sản phẩm bị hư hỏng trong quá trình vận chuyển",
            "Thời gian đổi trả trong vòng 7 ngày kể từ ngày nhận hàng"
          ]
        },
        {
          subtitle: "Quy trình đổi trả",
          items: [
            "Liên hệ bộ phận CSKH qua hotline hoặc Zalo",
            "Cung cấp thông tin đơn hàng và lý do đổi trả",
            "Đóng gói sản phẩm cẩn thận và gửi trả",
            "Nhận sản phẩm đổi mới hoặc hoàn tiền trong 3-5 ngày làm việc"
          ]
        },
        {
          subtitle: "Chi phí đổi trả",
          items: [
            "Miễn phí đổi trả nếu lỗi từ phía người bán",
            "Khách hàng chịu phí vận chuyển nếu đổi trả do thay đổi ý",
            "Hoàn 100% tiền hàng nếu sản phẩm lỗi không thể đổi"
          ]
        }
      ]
    },
    {
      id: "shipping",
      title: "Chính sách vận chuyển",
      icon: Truck,
      content: [
        {
          subtitle: "Phạm vi giao hàng",
          items: [
            "Giao hàng toàn quốc qua đơn vị vận chuyển uy tín",
            "Hỗ trợ ship COD (thanh toán khi nhận hàng)"
          ]
        },
        {
          subtitle: "Thời gian giao hàng",
          items: [
            "Các tỉnh thành lân cận: 2-3 ngày làm việc",
            "Các tỉnh xa: 3-5 ngày làm việc",
            "Miền núi, hải đảo: 5-7 ngày làm việc"
          ]
        },
        {
          subtitle: "Lưu ý khi nhận hàng",
          items: [
            "Kiểm tra kỹ tình trạng bao bì trước khi nhận",
            "Đối chiếu sản phẩm với đơn hàng đã đặt",
            "Yêu cầu đổi ngay nếu phát hiện sản phẩm bị hư hỏng",
            "Giữ lại chứng từ giao hàng để được hỗ trợ tốt nhất"
          ]
        }
      ]
    },
    {
      id: "payment",
      title: "Chính sách thanh toán",
      icon: CreditCard,
      content: [
        {
          subtitle: "Hình thức thanh toán",
          items: [
            "Thanh toán khi nhận hàng (COD) - Phổ biến nhất",
            "Chuyển khoản ngân hàng trực tiếp",
            "Thanh toán tại cửa hàng",
            "Thanh toán online qua ví điện tử"
          ]
        },
        {
          subtitle: "Thông tin chuyển khoản",
          items: [
            "Ngân hàng: Vietcombank Chi nhánh TP.HCM",
            "Số tài khoản: 0123456789",
            "Chủ tài khoản: CÔNG TY TNHH ĐẤT SẠCH TAM NÔNG",
            "Nội dung: Họ tên + Số điện thoại + Mã đơn hàng"
          ]
        },
        {
          subtitle: "Ưu đãi thanh toán",
          items: [
            "Giảm 2% cho đơn hàng thanh toán trước",
            "Tích điểm thành viên cho mỗi đơn hàng",
            "Ưu đãi đặc biệt cho khách hàng thân thiết",
            "Chương trình khuyến mãi theo tháng"
          ]
        }
      ]
    },
    {
      id: "privacy",
      title: "Chính sách bảo mật",
      icon: Lock,
      content: [
        {
          subtitle: "Thu thập thông tin",
          items: [
            "Họ tên, số điện thoại, địa chỉ giao hàng",
            "Email để gửi thông tin đơn hàng",
            "Thông tin thanh toán (nếu có)",
            "Lịch sử mua hàng để phục vụ tốt hơn"
          ]
        },
        {
          subtitle: "Sử dụng thông tin",
          items: [
            "Xử lý đơn hàng và giao hàng",
            "Gửi thông tin khuyến mãi, sản phẩm mới (nếu đồng ý)",
            "Cải thiện chất lượng dịch vụ",
            "Liên hệ hỗ trợ khi cần thiết"
          ]
        },
        {
          subtitle: "Bảo mật thông tin",
          items: [
            "Không chia sẻ thông tin khách hàng cho bên thứ ba",
            "Mã hóa thông tin thanh toán bằng SSL",
            "Lưu trữ dữ liệu an toàn trên hệ thống bảo mật",
            "Tuân thủ nghiêm ngặt luật bảo vệ dữ liệu cá nhân"
          ]
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-[#005e35] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hỗ Trợ Khách Hàng
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              Chính sách và điều khoản mua hàng tại Đất Sạch Tam Nông
            </p>
          </div>
        </div>
      </section>

      {/* Contact Quick Info */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#39b54a] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Hotline hỗ trợ</p>
                  <a href={`tel:${settings?.contactPhone}`} className="text-lg font-bold text-[#005e35] hover:text-[#39b54a]">
                    {settings?.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#39b54a] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <a href={`mailto:${settings?.contactEmail}`} className="text-lg font-bold text-[#005e35] hover:text-[#39b54a]">
                    {settings?.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#39b54a] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Thời gian hỗ trợ</p>
                  <p className="text-lg font-bold text-[#005e35]">
                    8:00 - 20:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {policies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div
                  key={policy.id}
                  id={policy.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Policy Header */}
                  <div className="bg-gradient-to-r from-[#005e35] to-[#39b54a] text-white p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon size={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{policy.title}</h2>
                        <p className="text-sm text-gray-100 mt-1">
                          Cập nhật: Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Policy Content */}
                  <div className="p-6 space-y-6">
                    {policy.content.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-[#39b54a] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {sectionIndex + 1}
                          </span>
                          {section.subtitle}
                        </h3>
                        <ul className="space-y-2 ml-10">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-gray-900">
                              <span className="text-[#39b54a] mt-1">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Chuyển đến chính sách
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {policies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <a
                    key={policy.id}
                    href={`#${policy.id}`}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:bg-[#005e35] hover:text-white transition-colors group"
                  >
                    <Icon size={32} className="text-[#39b54a] group-hover:text-white" />
                    <span className="text-sm font-medium text-center text-gray-900 group-hover:text-white">{policy.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#005e35] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Cần hỗ trợ thêm?
            </h2>
            <p className="text-lg mb-6 text-gray-100">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {settings?.socialMedia?.zalo && (
                <a
                  href={settings.socialMedia.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#0068FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold transition-colors"
                >
                  Chat qua Zalo
                </a>
              )}
              <a
                href="/contact"
                className="px-8 py-3 bg-white hover:bg-gray-100 text-[#005e35] rounded-lg font-semibold transition-colors"
              >
                Gửi góp ý
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
