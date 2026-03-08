import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin Tức & Kiến Thức - Đất Sạch Tam Nông | Hướng Dẫn Trồng Trọt",
  description: "Tin tức mới nhất về nông nghiệp hữu cơ, hướng dẫn sử dụng đất sạch, kiến thức trồng trọt, chăm sóc cây. Cập nhật thường xuyên từ chuyên gia Đất Sạch Tam Nông.",
  keywords: "tin tức đất sạch, kiến thức trồng trọt, hướng dẫn sử dụng đất hữu cơ, cách dùng phân bón, chăm sóc cây trồng, nông nghiệp hữu cơ",
  openGraph: {
    title: "Tin Tức & Kiến Thức - Đất Sạch Tam Nông",
    description: "Hướng dẫn trồng trọt, kiến thức chăm sóc cây, tin tức nông nghiệp hữu cơ từ chuyên gia.",
    type: "website",
    url: "https://datsachtamnong.com/news",
  },
  alternates: {
    canonical: "https://datsachtamnong.com/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
