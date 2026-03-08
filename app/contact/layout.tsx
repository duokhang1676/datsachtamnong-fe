import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ - Đất Sạch Tam Nông | Hỗ Trợ Tư Vấn 24/7",
  description: "Liên hệ với Đất Sạch Tam Nông để được tư vấn miễn phí về sản phẩm đất hữu cơ, phân bón. Hỗ trợ 24/7, giao hàng toàn quốc. Địa chỉ: Xã Mỏ Cày, Vĩnh Long.",
  keywords: "liên hệ đất sạch tam nông, tư vấn đất hữu cơ, hotline đất sạch, địa chỉ mua đất sạch vĩnh long, liên hệ mua đất trồng",
  openGraph: {
    title: "Liên Hệ - Đất Sạch Tam Nông",
    description: "Hỗ trợ tư vấn 24/7. Giao hàng toàn quốc. Liên hệ ngay để được báo giá tốt nhất.",
    type: "website",
    url: "https://datsachtamnong.com/contact",
  },
  alternates: {
    canonical: "https://datsachtamnong.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
