"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { Product } from "@/types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]?.url || "/product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {product.stock === 0 && (
            <Badge variant="default" className="absolute top-2 right-2">
              Hết hàng
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          <div className="mb-4">
            <span className="text-xl font-bold text-red-600">
              Liên hệ
            </span>
          </div>

          <Button
            className="w-full"
            size="sm"
            disabled={product.stock === 0}
          >
            <Truck size={16} className="mr-2" />
            {product.stock === 0 ? "Hết hàng" : "Giao hàng tận nơi"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
