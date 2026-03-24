"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, Eye, Volume2, VolumeX, Pause, Loader } from "lucide-react";
import * as newsService from "@/services/newsService";
import Button from "@/components/ui/Button";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [news, setNews] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    fetchNews();
  }, [slug]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");
      setIsSpeaking(false);
      setAudioUrl("");
      
      // Fetch news by slug
      const newsData = await newsService.getNewsBySlug(slug);
      setNews(newsData);

      // Fetch related news (same category)
      const categoryId = typeof newsData?.category === "string"
        ? newsData.category
        : newsData?.category?._id;

      if (categoryId) {
        const response = await newsService.getNews({ 
          category: categoryId,
          isActive: true,
          limit: 4
        });
        const related = (response.data || []).filter((n: any) => n.slug !== slug).slice(0, 3);
        setRelatedNews(related);
      }
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || "Không thể tải tin tức");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTextContent = () => {
    if (!news) return '';
    
    // Extract text from HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = news.content;
    
    // Remove script and style tags
    const scripts = tempDiv.getElementsByTagName('script');
    const styles = tempDiv.getElementsByTagName('style');
    Array.from(scripts).forEach(script => script.remove());
    Array.from(styles).forEach(style => style.remove());
    
    // Get text content
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Combine title, excerpt and content
    return `${news.title}. ${news.excerpt}. ${textContent}`;
  };

  const generateAndPlayAudio = async () => {
    try {
      const text = getTextContent();
      
      if (!text || text.trim().length === 0) {
        alert('Nội dung bài viết trống');
        return;
      }

      setIsLoadingAudio(true);

      // Call backend TTS API
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBaseUrl}/api/tts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          lang: 'vi',
          slow: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      const url = data.data.url;
      setAudioUrl(url);

      // Auto-play audio
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          alert('Không thể phát audio');
        });
        setIsSpeaking(true);
      }
    } catch (err: any) {
      console.error('Error generating audio:', err);
      alert(`Lỗi: ${err.message || 'Không thể tạo audio'}`);
      setIsSpeaking(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isSpeaking) {
      audioRef.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      // Generate and play
      generateAndPlayAudio();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/news">
            <Button>Quay lại danh sách tin tức</Button>
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": news.excerpt,
    "image": news.featuredImage?.url || news.image || "/placeholder-news.jpg",
    "datePublished": news.publishedAt || news.createdAt,
    "author": {
      "@type": "Person",
      "name": news.author || "Đất Sạch Tam Nông"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Đất Sạch Tam Nông",
      "logo": {
        "@type": "ImageObject",
        "url": `${typeof window !== 'undefined' ? window.location.origin : 'https://datsachtamnong.com'}/logo.png`
      }
    },
    "dateModified": news.updatedAt || news.createdAt,
    "articleSection": news.category?.name || "Tin tức",
    "url": `${typeof window !== 'undefined' ? window.location.href : `https://datsachtamnong.com/news/${news.slug}`}`
  };

  return (
    <>
      {/* Article Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        onEnded={() => {
          setIsSpeaking(false);
          setIsPaused(false);
        }}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsSpeaking(false);
          setIsPaused(false);
          alert('Lỗi phát audio');
        }}
      />

      <div className="bg-gray-50">
        <article>
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <div className="pt-8 px-4 md:px-8">
              <Link href="/news">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={18} />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 md:h-[500px] mt-4 mx-4 md:mx-8 rounded-xl overflow-hidden">
              <img
                src={news.featuredImage?.url || news.image || "/placeholder-news.jpg"}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-news.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#39b54a] px-3 py-1 rounded-full text-sm font-semibold">
                    {news.category?.name || 'Chưa phân loại'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {news.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm opacity-90" suppressHydrationWarning>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{news.views || 0} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Reading Controls */}
            <div className="p-8 border-b bg-gradient-to-r from-[#005e35]/5 to-[#39b54a]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={24} className="text-[#39b54a]" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Nghe bản tin</h2>
                    <p className="text-sm text-gray-600">Nghe nội dung bài viết được đọc bằng giọng đọc tự nhiên</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePlayPause}
                    disabled={isLoadingAudio}
                    variant={isSpeaking && !isPaused ? "outline" : "primary"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isLoadingAudio ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Đang chuẩn bị
                      </>
                    ) : isPaused ? (
                      <>
                        <Volume2 size={18} />
                        Tiếp tục
                      </>
                    ) : isSpeaking ? (
                      <>
                        <Pause size={18} />
                        Tạm dừng
                      </>
                    ) : (
                      <>
                        <Volume2 size={18} />
                        Phát
                      </>
                    )}
                  </Button>
                  {isSpeaking && (
                    <Button
                      onClick={handleStop}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <VolumeX size={18} />
                      Dừng
                    </Button>
                  )}
                </div>
              </div>
              {isSpeaking && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex gap-1">
                      <span className="w-1 h-4 bg-[#39b54a] animate-pulse" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-4 bg-[#39b54a] animate-pulse" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-4 bg-[#39b54a] animate-pulse" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span>{isPaused ? 'Đã tạm dừng' : 'Đang phát...'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              className="article-content p-8 prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:scroll-mt-24 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-5 prose-h1:leading-tight
                prose-h2:text-2xl prose-h2:mt-7 prose-h2:mb-4 prose-h2:leading-snug
                prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-3 prose-h3:leading-normal
                prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                prose-h5:text-lg prose-h5:mt-4 prose-h5:mb-2
                prose-h6:text-base prose-h6:mt-3 prose-h6:mb-2
                prose-p:text-base prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:text-base
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-base
                prose-li:text-gray-800 prose-li:mb-2 prose-li:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-800 prose-em:italic
                prose-blockquote:border-l-4 prose-blockquote:border-[#39b54a] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-a:text-[#005e35] prose-a:underline hover:prose-a:text-[#39b54a]
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                prose-table:w-full prose-table:border-collapse prose-table:my-6
                prose-tr:border-b prose-tr:border-gray-300
                prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-th:text-left
                prose-td:px-4 prose-td:py-2
                [&>*]:scroll-mt-24
              "
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="border-t bg-white">
                <div className="max-w-5xl mx-auto p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin tức liên quan</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedNews.map((relatedArticle) => (
                      <Link key={relatedArticle._id} href={`/news/${relatedArticle.slug}`}>
                        <div className="group cursor-pointer h-full">
                          <div className="relative h-40 overflow-hidden rounded-lg mb-4">
                            <img
                              src={relatedArticle.featuredImage?.url || relatedArticle.image || "/placeholder-news.jpg"}
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-news.jpg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-[#39b54a] transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </p>
                            <p className="text-sm text-gray-500" suppressHydrationWarning>
                              {formatDate(relatedArticle.publishedAt || relatedArticle.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
