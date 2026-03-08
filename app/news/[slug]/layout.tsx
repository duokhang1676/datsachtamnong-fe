import { Metadata } from "next";
import * as newsService from "@/services/newsService";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const news = await newsService.getNewsBySlug(resolvedParams.slug);

    const description = news.excerpt || 
      news.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 
      `Đọc bài viết ${news.title} từ Đất Sạch Tam Nông. Tin tức và kiến thức về nông nghiệp hữu cơ, trồng trọt sạch.`;

    const imageUrl = typeof news.featuredImage === 'string' 
      ? news.featuredImage 
      : news.featuredImage?.url || 'https://datsachtamnong.com/banner3.png';

    return {
      title: `${news.title} - Tin Tức | Đất Sạch Tam Nông`,
      description,
      keywords: `${news.title}, tin tức nông nghiệp, kiến thức trồng trọt, đất hữu cơ, nông nghiệp hữu cơ, ${news.category?.name || ''}`,
      openGraph: {
        title: news.title,
        description,
        type: "article",
        url: `https://datsachtamnong.com/news/${news.slug}`,
        publishedTime: news.createdAt,
        modifiedTime: news.updatedAt,
        authors: [news.author || "Đất Sạch Tam Nông"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://datsachtamnong.com/news/${news.slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Tin tức - Đất Sạch Tam Nông",
      description: "Tin tức và kiến thức về nông nghiệp hữu cơ từ Đất Sạch Tam Nông",
    };
  }
}

export default function NewsDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
