"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Package, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as productService from "@/services/productService";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productService.getProducts({});
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách sản phẩm");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      // Refresh products list
      await fetchProducts();
      alert('Đã xóa sản phẩm thành công!');
    } catch (err: any) {
      alert(err.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleView = (slug: string) => {
    window.open(`/products/${slug}`, '_blank');
  };

  // Extract unique categories with both slug and name
  const categoryMap = new Map<string, { slug: string; name: string }>();
  products.forEach(p => {
    if (p.category?.slug && p.category?.name) {
      categoryMap.set(p.category.slug, { slug: p.category.slug, name: p.category.name });
    }
  });
  const categories = Array.from(categoryMap.values());

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format product ID to be short and professional
  const formatProductId = (id: string) => {
    return `TN${id.slice(-4).toUpperCase()}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Tổng {products.length} sản phẩm • {products.filter(p => p.status === 'available').length} còn hàng</p>
        </div>
        <button 
          onClick={() => router.push('/admin/products/new')}
          className="bg-[#39b54a] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#2d8f3a] transition-colors"
        >
          <Plus size={20} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button 
            onClick={fetchProducts}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mô tả</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 w-40">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{formatProductId(product._id)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {product.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {product.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'available' ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Còn hàng
                      </span>
                    ) : product.status === 'unavailable' ? (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                        Hết hàng
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        Ngừng bán
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(product.slug)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(product._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id, product.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Không tìm thấy sản phẩm</p>
            <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
          </div>
        )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Còn hàng</p>
            <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'available').length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Hết hàng</p>
            <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'unavailable').length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Ngừng bán</p>
            <p className="text-2xl font-bold text-gray-600">{products.filter(p => p.status === 'discontinued').length}</p>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
