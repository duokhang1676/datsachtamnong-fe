"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import * as productService from "@/services/productService";
import categoryService, { Category } from "@/services/categoryService";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Read category and search term from URL query parameters
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load products and categories in parallel
      const [productsResponse, categoriesData] = await Promise.all([
        productService.getProducts({}),
        categoryService.getCategories({ type: 'product', isActive: true })
      ]);
      
      setProducts(productsResponse.data || []);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Sản phẩm</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#39b54a] focus:outline-none text-gray-900"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#39b54a] focus:outline-none cursor-pointer text-gray-900 font-medium"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category._id} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
