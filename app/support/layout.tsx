import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách & Hỗ Trợ - Đất Sạch Tam Nông | Bảo Hành, Đổi Trả, Vận Chuyển",
  description: "Chính sách bảo hành, đổi trả, vận chuyển và thanh toán của Đất Sạch Tam Nông. Bảo hành 6-24 tháng, đổi trả miễn phí trong 7 ngày, giao hàng toàn quốc, thanh toán linh hoạt.",
  keywords: "chính sách bảo hành đất sạch, đổi trả đất hữu cơ, vận chuyển đất sạch, thanh toán đất trồng, chính sách khách hàng",
  openGraph: {
    title: "Chính Sách & Hỗ Trợ - Đất Sạch Tam Nông",
    description: "Bảo hành 6-24 tháng, đổi trả 7 ngày, giao hàng toàn quốc, thanh toán COD/chuyển khoản.",
    type: "website",
    url: "https://datsachtamnong.com/support",
  },
  alternates: {
    canonical: "https://datsachtamnong.com/support",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
