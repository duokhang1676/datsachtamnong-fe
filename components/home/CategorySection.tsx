"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import categoryService, { Category } from "@/services/categoryService";
import { Package } from "lucide-react";

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories({ type: 'product', isActive: true });
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Danh mục sản phẩm</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform bg-white shadow-lg">
                  {(() => {
                    const imageUrl = !category.image 
                      ? '' 
                      : typeof category.image === 'string' 
                        ? category.image 
                        : (category.image as {url: string; publicId: string}).url;
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={80} className="text-green-600" />
                    );
                  })()}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">{category.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
