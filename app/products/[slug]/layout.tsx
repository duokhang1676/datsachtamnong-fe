import { Metadata } from "next";
import * as productService from "@/services/productService";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const response = await productService.getProductBySlug(resolvedParams.slug);
    const product = response.data;

    const description = product.shortDescription || 
      product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
      `Mua ${product.name} chất lượng cao từ Đất Sạch Tam Nông. Sản phẩm hữu cơ 100% tự nhiên, giao hàng toàn quốc.`;

    const imageUrl = product.images?.[0]?.url || 'https://datsachtamnong.com/product.jpg';

    return {
      title: `${product.name} - Đất Sạch Tam Nông | ${product.category?.name || 'Đất Hữu Cơ'}`,
      description,
      keywords: `${product.name}, ${product.category?.name || 'đất hữu cơ'}, đất sạch tam nông, mua ${product.name}, ${product.packaging || ''}, đất trồng cây`,
      openGraph: {
        title: product.name,
        description,
        type: "website",
        url: `https://datsachtamnong.com/products/${product.slug}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://datsachtamnong.com/products/${product.slug}`,
      },
    };
  } catch (error) {
    // Fallback metadata if product not found
    return {
      title: "Sản phẩm - Đất Sạch Tam Nông",
      description: "Sản phẩm đất hữu cơ chất lượng cao từ Đất Sạch Tam Nông",
    };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
