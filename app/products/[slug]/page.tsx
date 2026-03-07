"use client";

import { use, useState, useEffect } from "react";
import * as productService from "@/services/productService";
import ProductCard from "@/components/products/ProductCard";
import { Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { settings } = useSettings();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch product details by slug
      const response = await productService.getProductBySlug(resolvedParams.slug);
      const productData = response.data;
      setProduct(productData);

      // Fetch related products (same category)
      if (productData?.category?._id) {
        const response = await productService.getProducts({ 
          category: productData.category._id,
          limit: 5
        });
        const related = (response.data || []).filter((p: any) => p.slug !== resolvedParams.slug).slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);
      if (err.response?.status === 404) {
        notFound();
      }
      setError(err.response?.data?.message || "Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Không tìm thấy sản phẩm"}</p>
          <a href="/products" className="text-[#39b54a] hover:underline">← Quay lại danh sách sản phẩm</a>
        </div>
      </div>
    );
  }

  // Generate structured data (JSON-LD) for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDescription || product.description?.replace(/<[^>]*>/g, '').substring(0, 200),
    "image": product.images?.[0]?.url || `${typeof window !== 'undefined' ? window.location.origin : 'https://datsachtamnong-fe.vercel.app'}/product.jpg`,
    "sku": `TN${product._id.slice(-4).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": settings?.siteName || "Đất Sạch Tam Nông"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": settings?.siteName || "Đất Sạch Tam Nông"
    },
    "offers": {
      "@type": "Offer",
      "url": `${typeof window !== 'undefined' ? window.location.href : `https://datsachtamnong-fe.vercel.app/products/${product.slug}`}`,
      "priceCurrency": "VND",
      "availability": product.status === 'available' 
        ? "https://schema.org/InStock" 
        : product.status === 'unavailable'
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/Discontinued",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "VND"
      }
    },
    "aggregateRating": product.views > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": Math.max(1, Math.floor(product.views / 10))
    } : undefined
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-6">
            Trang chủ / {product.category?.name || 'Sản phẩm'} / {product.name}
          </div>

          {/* Product Detail */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]?.url || "/product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-9xl">
                      📦
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div>
                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Product Code & Views */}
                <div className="flex items-center gap-6 mb-4 pb-4 border-b">
                  <div>
                    <span className="text-sm text-gray-600">Mã sản phẩm: </span>
                    <span className="text-sm font-semibold text-gray-900">{`TN${product._id.slice(-4).toUpperCase()}`}</span>
                  </div>
                  {product.views > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-600">{product.views} lượt xem</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Giá: </span>
                  <span className="text-2xl font-bold text-red-600">Liên hệ</span>
                </div>

                {/* Category Label */}
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-[#005e35] text-white font-semibold rounded-lg">
                    {product.category?.name?.toUpperCase() || 'ĐẤT HỮU CƠ'}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Trạng thái: </span>
                  {product.status === 'available' && <span className="text-sm font-semibold text-green-600">Có hàng</span>}
                  {product.status === 'unavailable' && <span className="text-sm font-semibold text-red-600">Hết hàng</span>}
                  {product.status === 'discontinued' && <span className="text-sm font-semibold text-gray-600">Ngừng bán</span>}
                </div>

                {/* Specifications */}
                {product.packaging && (
                  <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-900 min-w-[100px]">Đóng gói:</span>
                      <span className="text-sm text-gray-700">{product.packaging}</span>
                    </div>
                  </div>
                )}

                {/* Consult Button */}
                <a
                  href={settings?.socialMedia?.zalo || `https://zalo.me/${settings?.contactPhone?.replace(/\D/g, '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-4 bg-[#0068FF] hover:bg-[#0052CC] text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  Tư vấn sản phẩm
                </a>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Lưu ý:</strong> Vui lòng liên hệ với chúng tôi qua Zalo hoặc gọi hotline{" "}
                    <a href={`tel:${settings?.contactPhone}`} className="text-[#39b54a] font-semibold hover:underline">
                      {settings?.contactPhone}
                    </a>{" "}
                    để được tư vấn chi tiết về sản phẩm và báo giá.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b">
              <div className="flex gap-8 px-6">
                {["description", "specifications"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-[#39b54a] text-[#39b54a]"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "description" && "Chi tiết sản phẩm"}
                    {tab === "specifications" && "Thông số kỹ thuật"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Chi tiết sản phẩm</h3>
                  <div className="prose max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    
                    {/* Product features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Ưu điểm nổi bật:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {product.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Thông số kỹ thuật</h3>
                  <table className="w-full">
                    <tbody>
                      {product.packaging && (
                        <tr className="border-b">
                          <td className="py-3 font-medium text-gray-900">Đóng gói</td>
                          <td className="py-3 text-gray-700">{product.packaging}</td>
                        </tr>
                      )}
                      <tr className="border-b">
                        <td className="py-3 font-medium text-gray-900">Loại sản phẩm</td>
                        <td className="py-3 text-gray-700">{product.category?.name}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium text-gray-900">Trạng thái</td>
                        <td className="py-3 text-green-600 font-semibold">
                          {product.status === 'available' ? 'Có hàng' : product.status === 'unavailable' ? 'Hết hàng' : 'Ngừng bán'}
                        </td>
                      </tr>
                      {product.specifications && (
                        <tr className="border-b">
                          <td className="py-3 font-medium text-gray-900">Thông số</td>
                          <td className="py-3 text-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: product.specifications }} />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
