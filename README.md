# Đất Sạch Tam Nông - Frontend

Website thương mại điện tử bán đất hữu cơ Đất Sạch Tam Nông.

## Công nghệ sử dụng

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - UI library
- **TipTap** - Rich text editor (for admin)
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Recharts** - Chart library (for admin dashboard)
- **Swiper** - Touch slider

## Tính năng

### Khách hàng
- ✅ Trang chủ với hero section, sản phẩm nổi bật, tin tức
- ✅ Danh sách sản phẩm với filter, search, pagination
- ✅ Chi tiết sản phẩm với gallery, specifications, reviews
- ✅ Giỏ hàng với local storage
- ✅ Checkout và đặt hàng
- ✅ Theo dõi đơn hàng
- ✅ Trang tin tức với categories
- ✅ Chi tiết tin tức với Text-to-Speech
- ✅ Trang liên hệ với Google Maps
- ✅ Đăng ký nhận tin newsletter

### Admin
- ✅ Dashboard với thống kê (doanh thu, đơn hàng, khách hàng)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý đơn hàng (cập nhật trạng thái, in đơn)
- ✅ Quản lý khách hàng (newsletter subscribers)
- ✅ Quản lý tin tức (CRUD với rich text editor)
- ✅ Quản lý danh mục tin tức
- ✅ Quản lý liên hệ & góp ý (với email template)
- ✅ Cài đặt website (logo, contact info, social links)

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cập nhật giá trị trong `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production
# NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

### 5. Build production

```bash
npm run build
npm start
```

## Cấu trúc thư mục

```
frontend/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Products pages
│   │   ├── news/          # News pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout page
│   │   ├── contact/       # Contact page
│   │   └── ...
│   ├── admin/             # Admin dashboard
│   │   ├── page.tsx       # Dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   ├── customers/     # Customer management
│   │   ├── news/          # News management
│   │   ├── contacts/      # Contact management
│   │   └── settings/      # Settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Header, Footer
│   ├── home/             # Home page sections
│   ├── products/         # Product components
│   ├── admin/            # Admin components
│   └── ui/               # UI components (Button, Input, etc.)
├── context/              # React Context
│   ├── AuthContext.tsx   # Authentication
│   ├── CartContext.tsx   # Shopping cart
│   └── SettingsContext.tsx # Site settings
├── services/             # API services
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── ...
├── lib/                  # Utilities
│   ├── api.ts           # Axios instance
│   └── utils.ts         # Helper functions
├── types/               # TypeScript types
└── public/              # Static assets
```

## Tài khoản Admin

Để truy cập trang admin, đăng nhập tại `/admin/login`:

- Email: `admin@datsachtamnong.com`
- Password: (được tạo khi seed backend)

## API Integration

Frontend gọi API thông qua services trong folder `services/`:

```typescript
// Example: productService.ts
import api from '@/lib/api';

export const getProducts = async (filters) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};
```

API base URL được config trong `.env.local`.

## Deployment

### Deploy lên Vercel

1. Push code lên GitHub

2. Truy cập [Vercel](https://vercel.com)

3. Import GitHub repository

4. Thêm Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```

5. Deploy!

Vercel sẽ tự động:
- Detect Next.js project
- Run `npm run build`
- Deploy và cung cấp URL

### Cấu hình Domain

1. Thêm custom domain trong Vercel settings
2. Cập nhật DNS records theo hướng dẫn của Vercel
3. Cập nhật `FRONTEND_URL` trong backend environment variables

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.datsachtamnong.com/api` |

**Lưu ý:** Chỉ variables bắt đầu với `NEXT_PUBLIC_` mới được expose ra client-side.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Highlights

### Dynamic Settings
- Logo, contact info, social links được load từ API
- Admin có thể update trong Settings page

### Shopping Cart
- Lưu trong localStorage
- Persist across sessions
- Update realtime

### Text-to-Speech
- Đọc bài viết tin tức bằng giọng tiếng Việt
- Web Speech API
- Play/Pause/Stop controls

### Search & Filter
- Product search với suggestions
- Category filter
- Price range filter
- Sort options

### Order Tracking
- Check order status với mã đơn hàng
- View order details
- Print order

### Rich Text Editor (Admin)
- TipTap editor cho tin tức
- Image upload
- Formatting options
- Preview mode

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Next.js App Router với Server Components
- Image optimization với next/image
- Code splitting automatic
- CSS optimization với Tailwind

## License

ISC

## Support

For support, email support@datsachtamnong.com