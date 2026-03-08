import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Đất Sạch Tam Nông | Câu Chuyện & Giá Trị",
  description: "Tìm hiểu về Đất Sạch Tam Nông - đơn vị tiên phong sản xuất đất hữu cơ tại Vĩnh Long. 10+ năm kinh nghiệm, 50,000+ khách hàng tin dùng, cam kết 100% sản phẩm hữu cơ.",
  keywords: "về đất sạch tam nông, công ty đất hữu cơ, nhà máy đất sạch vĩnh long, đất hữu cơ uy tín, lịch sử công ty",
  openGraph: {
    title: "Về Chúng Tôi - Đất Sạch Tam Nông",
    description: "10+ năm kinh nghiệm sản xuất đất hữu cơ chất lượng cao. 50,000+ khách hàng tin dùng. Chứng nhận hữu cơ quốc tế.",
    type: "website",
    url: "https://datsachtamnong.com/about",
  },
  alternates: {
    canonical: "https://datsachtamnong.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
