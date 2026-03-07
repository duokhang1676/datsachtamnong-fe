"use client";

import { useState, useEffect } from "react";
import * as productService from "@/services/productService";
import ProductCard from "../products/ProductCard";

interface ProductSectionProps {
  title: string;
  filter?: (product: any) => boolean;
  limit?: number;
  featured?: boolean;
}

export default function ProductSection({ title, filter, limit = 6, featured }: ProductSectionProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ 
        limit: limit * 2, // Fetch more in case we need to filter
        featured
      });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  let displayProducts = products;

  if (filter) {
    displayProducts = displayProducts.filter(filter);
  }

  displayProducts = displayProducts.slice(0, limit);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có sản phẩm</p>
        )}
      </div>
    </section>
  );
}
