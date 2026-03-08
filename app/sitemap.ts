import { MetadataRoute } from 'next';
import * as productService from '@/services/productService';
import * as newsService from '@/services/newsService';

const BASE_URL = 'https://datsachtamnong.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Fetch dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsResponse = await productService.getProducts({ 
      limit: 1000,
      status: 'available'
    });
    
    productRoutes = (productsResponse.data || []).map((product: any) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch dynamic news routes
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsResponse = await newsService.getNews({ 
      limit: 1000,
      isActive: true 
    });
    
    newsRoutes = (newsResponse.data || []).map((article: any) => ({
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...newsRoutes];
}
