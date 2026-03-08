"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, Eye, Volume2, VolumeX, Pause } from "lucide-react";
import * as newsService from "@/services/newsService";
import Button from "@/components/ui/Button";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [news, setNews] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    fetchNews();
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, [slug]);

  // Cleanup speech on unmount or news change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [news]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch news by slug
      const newsData = await newsService.getNewsBySlug(slug);
      setNews(newsData);

      // Fetch related news (same category)
      if (newsData?.category) {
        const response = await newsService.getNews({ 
          category: newsData.category,
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

  const handlePlayPause = () => {
    if (!speechSupported) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản');
      return;
    }

    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else if (isSpeaking) {
      synth.pause();
      setIsPaused(true);
    } else {
      // Start new speech
      const text = getTextContent();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set Vietnamese voice if available
      const voices = synth.getVoices();
      const viVoice = voices.find(voice => voice.lang.startsWith('vi'));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      synth.speak(utterance);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy tin tức"}</h1>
          <Link href="/news">
            <Button>Quay lại danh sách tin tức</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate Article structured data (JSON-LD) for Google
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": news.title,
    "description": news.excerpt || news.content?.replace(/<[^>]*>/g, '').substring(0, 200),
    "image": typeof news.featuredImage === 'string' 
      ? news.featuredImage 
      : news.featuredImage?.url || `${typeof window !== 'undefined' ? window.location.origin : 'https://datsachtamnong.com'}/banner3.png`,
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
    "datePublished": news.publishedAt || news.createdAt,
    "dateModified": news.updatedAt || news.createdAt,
    "articleSection": news.category?.name || "Tin tức",
    "url": `${typeof window !== 'undefined' ? window.location.href : `https://datsachtamnong.com/news/${news.slug}`}`
  };

  return (
    <>
      {/* Article Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/news">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              {/* Featured Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={news.featuredImage?.url || news.image || "/placeholder-news.jpg"}
                  alt={news.title}
                  className="w-full h-full object-cover"
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
              {speechSupported && (
                <div className="p-8 border-b bg-gradient-to-r from-[#005e35]/5 to-[#39b54a]/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 size={24} className="text-[#39b54a]" />
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Nghe bản tin</h2>
                        <p className="text-sm text-gray-600">Phát âm thanh nội dung bài viết</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePlayPause}
                        variant={isSpeaking ? "outline" : "primary"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {isPaused ? (
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
              )}

              {/* Content */}
              <div 
                ref={contentRef}
                className="article-content p-8 prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:scroll-mt-24 prose-headings:font-bold
                  prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6 prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-5 prose-h2:leading-snug
                  prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-4 prose-h3:leading-normal
                  prose-h4:text-xl prose-h4:mt-5 prose-h4:mb-3
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
                  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:text-gray-800
                  prose-hr:my-8 prose-hr:border-gray-300"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin tức liên quan</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedNews.map((relatedArticle) => (
                    <Link key={relatedArticle._id} href={`/news/${relatedArticle.slug}`}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={relatedArticle.featuredImage?.url || relatedArticle.image || "/placeholder-news.jpg"}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#39b54a] transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-gray-500" suppressHydrationWarning>
                            {formatDate(relatedArticle.publishedAt || relatedArticle.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
      </div>
    </>
  );
}
