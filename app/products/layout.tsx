import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản Phẩm - Đất Sạch Tam Nông | Đất Hữu Cơ, Phân Bón Sạch",
  description: "Khám phá bộ sưu tập đất hữu cơ, phân bón sạch từ Đất Sạch Tam Nông. Đất trồng rau, đất trồng hoa, phân hữu cơ, dung dịch dinh dưỡng. Giá tốt, giao hàng nhanh toàn quốc.",
  keywords: "sản phẩm đất sạch, đất hữu cơ giá rẻ, phân bón hữu cơ, đất trồng rau, đất trồng hoa, mua đất sạch, phân bón sạch",
  openGraph: {
    title: "Sản Phẩm Đất Hữu Cơ - Đất Sạch Tam Nông",
    description: "Đất hữu cơ 100% tự nhiên. Giá từ 15,000đ. Giao hàng toàn quốc. Đổi trả miễn phí.",
    type: "website",
    url: "https://datsachtamnong.com/products",
  },
  alternates: {
    canonical: "https://datsachtamnong.com/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
