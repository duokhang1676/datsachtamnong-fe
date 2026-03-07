"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Newspaper, MessageSquare, Settings, LogOut, FolderTree, ChevronDown, Users, Image, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  // Initialize state before any conditional returns (Rules of Hooks)
  const [categoriesOpen, setCategoriesOpen] = useState(
    pathname?.startsWith("/admin/product-categories") || 
    pathname?.startsWith("/admin/news-categories")
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoginPage && !loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, user, router, pathname, isLoginPage, loading]);

  // Render login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const menu = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
    { icon: Image, label: "Banner", href: "/admin/banners" },
    { icon: Package, label: "Sản phẩm", href: "/admin/products" },
    { 
      icon: FolderTree, 
      label: "Danh mục", 
      isDropdown: true,
      submenu: [
        { label: "Danh mục sản phẩm", href: "/admin/product-categories" },
        { label: "Danh mục tin tức", href: "/admin/news-categories" },
      ]
    },
    { icon: Newspaper, label: "Tin tức", href: "/admin/news" },
    { icon: Users, label: "Quản lý khách hàng", href: "/admin/customers" },
    { icon: MessageSquare, label: "Liên hệ & Góp ý", href: "/admin/contacts" },
    { icon: Settings, label: "Thông tin công ty", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#005e35] text-white z-50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <p className="text-xs text-gray-300">Đất Sạch Tam Nông</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-[#005e35] text-white min-h-screen fixed z-50
          lg:translate-x-0 lg:static lg:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:mt-0 mt-16
        `}>
          <div className="p-6 hidden lg:block">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-sm text-gray-300 mt-1">Đất Sạch Tam Nông</p>
          </div>
          <nav className="px-4 pb-20">
            {menu.map((item) => {
              if (item.isDropdown && item.submenu) {
                const isAnySubmenuActive = item.submenu.some(sub => 
                  pathname === sub.href || pathname?.startsWith(sub.href)
                );
                
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors mb-1 ${
                        isAnySubmenuActive
                          ? 'bg-[#39b54a] text-white font-semibold'
                          : 'text-gray-200 hover:bg-[#39b54a]/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown 
                        size={18} 
                        className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {categoriesOpen && (
                      <div className="ml-4 space-y-1 mb-1">
                        {item.submenu.map((subItem) => {
                          const isActive = pathname === subItem.href || pathname?.startsWith(subItem.href);
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                                isActive
                                  ? 'bg-[#39b54a]/50 text-white font-semibold'
                                  : 'text-gray-300 hover:bg-[#39b54a]/20 hover:text-white'
                              }`}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              if (!item.href) return null;
              
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                    isActive
                      ? 'bg-[#39b54a] text-white font-semibold'
                      : 'text-gray-200 hover:bg-[#39b54a]/20 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-red-600 hover:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
