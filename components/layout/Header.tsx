"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Phone, Home } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useRouter } from "next/navigation";
import categoryService, { Category } from "@/services/categoryService";
import * as productService from "@/services/productService";

export default function Header() {
  const { settings } = useSettings();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 50;
          if (shouldScroll !== isScrolled) {
            setIsScrolled(shouldScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories({ type: 'product', isActive: true });
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await productService.getProducts({ 
        search: query,
        limit: 5 
      });
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const navigation = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Giới thiệu", href: "/about" },
    { name: "Tin tức", href: "/news" },
    { name: "Hỗ trợ khách hàng", href: "/support" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
    setSearchOpen(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Main header - Logo, Search, Hotline */}
      <div className={`bg-white transition-all duration-300 ease-in-out ${isScrolled ? "max-h-0 py-0 overflow-hidden opacity-0" : "max-h-96 py-2 opacity-100"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt={settings?.siteName || "Đất Sạch Tâm Nông"}
                width={100}
                height={50}
                className="object-contain"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-[#005e35] leading-tight">
                  ĐẤT SẠCH TAM NÔNG
                </h1>
                <p className="text-xs text-[#39b54a] font-medium">
                  Nông nghiệp - Nông dân - Nông thôn
                </p>
              </div>
            </Link>

            {/* Search Box - Desktop */}
            <div className="hidden md:flex flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex w-full border-2 border-[#39b54a] rounded-lg overflow-hidden shadow-sm">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border-r-2 border-[#39b54a] text-xs font-medium text-gray-800 focus:outline-none cursor-pointer hover:bg-gray-50"
                >
                  <option value="">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="Tìm sản phẩm bạn muốn..."
                  className="flex-1 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-600 focus:outline-none"
                />
                <button type="submit" className="px-6 bg-[#39b54a] hover:bg-[#02a319] text-white transition-colors flex items-center justify-center">
                  <Search size={18} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#39b54a] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-sm">Đang tìm kiếm...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product._id)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                        >
                          {product.images?.[0]?.url && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.category?.name && (
                              <p className="text-xs text-gray-500">
                                {product.category.name}
                              </p>
                            )}
                          </div>
                          {product.price && (
                            <span className="text-sm font-semibold text-[#39b54a]">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-sm">Không tìm thấy sản phẩm nào</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hotline */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#39b54a] to-[#02a319] rounded-full flex items-center justify-center shadow-lg">
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Hotline</p>
                <a href={`tel:${settings?.contactPhone}`} className="text-2xl font-bold text-[#d32f2f] hover:text-[#b71c1c] tracking-tight">
                  {settings?.contactPhone}
                </a>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Search size={24} className="text-gray-700" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden mt-4 relative">
              <form onSubmit={handleSearch} className="flex border-2 border-[#39b54a] rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="Tìm sản phẩm bạn muốn..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="px-4 bg-[#39b54a] hover:bg-[#02a319] text-white transition-colors">
                  <Search size={20} />
                </button>
              </form>

              {/* Mobile Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#39b54a] rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-sm">Đang tìm kiếm...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product._id)}
                          className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-left transition-colors"
                        >
                          {product.images?.[0]?.url && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.price && (
                              <span className="text-xs font-semibold text-[#39b54a]">
                                {product.price.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-sm">Không tìm thấy sản phẩm</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu - Desktop với Category Sidebar */}
      <div className={`hidden lg:block bg-white shadow-md transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {/* Logo nhỏ khi scroll */}
            {isScrolled && (
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-3">
                <Image
                  src="/logo.jpg"
                  alt={settings?.siteName || "Đất Sạch Tâm Nông"}
                  width={80}
                  height={40}
                  className="object-contain"
                  priority
                />
                <span className="font-bold text-[#005e35] text-sm whitespace-nowrap">ĐẤT SẠCH TAM NÔNG</span>
              </Link>
            )}
            
            {/* Category Sidebar Menu */}
            <div className="relative group">
              <button 
                className="flex items-center gap-2 px-4 py-2.5 bg-[#39b54a] hover:bg-[#02a319] transition-colors font-bold text-white uppercase text-sm"
                onMouseEnter={() => setCategoryMenuOpen(true)}
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                <Menu size={18} />
                DANH MỤC SẢN PHẨM
              </button>
              {/* Dropdown Categories */}
              {categoryMenuOpen && (
                <div 
                  className="absolute left-0 top-full bg-white text-gray-800 shadow-2xl w-72 z-50 border border-gray-200"
                  onMouseEnter={() => setCategoryMenuOpen(true)}
                  onMouseLeave={() => setCategoryMenuOpen(false)}
                >
                  {categories.map((cat, index) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-5 py-3 hover:bg-[#f0f9f4] hover:text-[#005e35] border-b border-gray-200 last:border-0 transition-colors"
                    >
                      <span className="text-sm font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Navigation Links */}
            <ul className="flex items-center flex-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-4 py-2.5 hover:bg-[#f0f9f4] transition-colors text-[#005e35] font-medium text-sm"
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.name}
                  </Link>
                </li>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <li className="ml-auto">
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 transition-colors font-bold text-white text-sm"
                  >
                    Quản trị
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Main Menu */}
            <div className="space-y-2 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Categories */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2 px-4">Danh mục sản phẩm</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Admin Link for Mobile */}
            {isAuthenticated && user?.role === "admin" && (
              <div className="border-t pt-4 mb-4">
                <Link
                  href="/admin"
                  className="block py-2 px-4 text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quản trị
                </Link>
              </div>
            )}

            {/* Mobile Hotline */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-4 bg-[#39b54a] bg-opacity-10 rounded-lg">
                <div className="w-10 h-10 bg-[#39b54a] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Hotline hỗ trợ</p>
                  <a href={`tel:${settings?.contactPhone}`} className="text-xl font-bold text-[#005e35]">
                    {settings?.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
