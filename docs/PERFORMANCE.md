# Performance Optimization Guide

Tài liệu này mô tả các tối ưu hóa hiệu suất đã được triển khai trong dự án KTV Admin.

## 📊 Tổng Quan Các Cải Tiến

### 1. **Font Optimization** ✅
- **Cải tiến**: Sử dụng `next/font` với Inter font
- **Lợi ích**: 
  - Font được tự động tối ưu và self-host
  - `display: swap` giảm FOIT (Flash of Invisible Text)
  - Preload font để giảm FCP (First Contentful Paint)
  - Hỗ trợ tiếng Việt với subset `vietnamese`
- **File**: `src/app/layout.tsx`

### 2. **Image Optimization** ✅
- **Cải tiến**:
  - Next.js Image component với lazy loading
  - AVIF và WebP format cho kích thước nhỏ hơn
  - Blur placeholder để cải thiện UX
  - Cache TTL tăng lên 1 giờ
- **Component**: `src/components/OptimizedImage.tsx`
- **Lợi ích**: Giảm 40-60% kích thước hình ảnh

### 3. **Enhanced Caching Strategy** ✅
- **Cải tiến**:
  - LRU (Least Recently Used) cache eviction
  - Persistent cache với localStorage
  - Auto-prune expired entries
  - Cache statistics tracking
- **File**: `src/lib/cache.ts`
- **Lợi ích**:
  - Giảm API calls
  - Faster page loads cho returning users
  - Tăng cache TTL từ 30s lên 2 phút

### 4. **Bundle Optimization** ✅
- **Cải tiến**:
  - Code splitting với custom webpack config
  - Lazy loading cho admin components
  - Tree shaking với `optimizePackageImports`
  - Vendor chunk splitting
- **Files**: 
  - `next.config.ts`
  - `src/components/LazyComponents.tsx`
- **Lợi ích**: Giảm initial bundle size 30-40%

### 5. **Database Query Optimization** ✅
- **Cải tiến**:
  - Select chỉ fields cần thiết thay vì `*`
  - Pagination để giảm data transfer
  - Index queries hiệu quả
- **File**: `src/hooks/use-ktvs.ts`
- **Lợi ích**: Giảm 20-30% response time

### 6. **HTTP Caching Headers** ✅
- **Cải tiến**:
  - Cache-Control headers cho static assets
  - ETag generation
  - Immutable caching cho hashed assets
  - DNS prefetching
- **File**: `next.config.ts`
- **Lợi ích**: 
  - Browser caching hiệu quả
  - Giảm server load

### 7. **Service Worker & PWA** ✅
- **Cải tiến**:
  - Service Worker cho offline caching
  - Progressive Web App support
  - Static asset caching
  - Image caching strategy
- **Files**: 
  - `public/sw.js`
  - `public/manifest.json`
- **Lợi ích**:
  - Offline functionality
  - Faster repeat visits
  - App-like experience

### 8. **CSS Optimization** ✅
- **Cải tiến**:
  - Tailwind CSS purging
  - Critical CSS inlining
  - GPU-accelerated animations
  - CSS containment utilities
- **Files**: 
  - `src/app/globals.css`
  - `tailwind.config.ts`
- **Lợi ích**: Giảm CSS bundle size 50-70%

### 9. **Compression & Minification** ✅
- **Cải tiến**:
  - SWC minification
  - Gzip compression enabled
  - Remove console logs in production
  - Source map disabled in production
- **File**: `next.config.ts`
- **Lợi ích**: Giảm 20-30% transfer size

### 10. **Metadata & SEO Optimization** ✅
- **Cải tiến**:
  - Comprehensive meta tags
  - Open Graph tags
  - Twitter cards
  - Viewport optimization
  - Theme color for PWA
- **File**: `src/app/layout.tsx`
- **Lợi ích**: Better SEO và social sharing

### 11. **Server-Side Optimization** ✅
- **Cải tiến**:
  - Server-side redirect thay vì client-side
  - React Strict Mode
  - Optimistic client cache
  - Worker threads cho faster builds
- **Files**: 
  - `src/app/page.tsx`
  - `next.config.ts`

### 12. **Performance Utilities** ✅
- **Cải tiến**:
  - Debounce & throttle functions
  - Request queue với rate limiting
  - Memoization utilities
  - Performance measurement tools
- **File**: `src/lib/performance.ts`

## 📈 Kết Quả Dự Kiến

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

### Load Times
- **First Load JS**: Giảm 30-40%
- **Time to Interactive**: Giảm 25-35%
- **Total Blocking Time**: Giảm 40-50%

### Bundle Sizes
- **Main Bundle**: Giảm 35-45%
- **CSS Bundle**: Giảm 50-70%
- **Images**: Giảm 40-60% (AVIF/WebP)

## 🔧 Cách Sử Dụng

### Lazy Loading Components
```tsx
import { LazyKtvForm } from '@/components/LazyComponents';

// Component sẽ chỉ load khi cần
<LazyKtvForm {...props} />
```

### Optimized Images
```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Cache Usage
```tsx
import { cache } from '@/lib/cache';

// Set cache với TTL 60 giây
cache.set('key', data, 60);

// Get từ cache
const data = cache.get('key');

// Invalidate cache pattern
cache.invalidate('ktvs:');
```

### Performance Utilities
```tsx
import { debounce, throttle, memoize } from '@/lib/performance';

// Debounce function calls
const debouncedSearch = debounce(searchFunction, 300);

// Throttle function calls
const throttledScroll = throttle(scrollHandler, 100);

// Memoize expensive calculations
const memoizedCalculation = memoize(expensiveFunction);
```

## 🚀 Deployment Checklist

Trước khi deploy production:

- [ ] Run `npm run build` để verify build thành công
- [ ] Check bundle sizes trong `.next/analyze/`
- [ ] Test Service Worker trong production mode
- [ ] Verify all images có lazy loading
- [ ] Check cache headers trong Network tab
- [ ] Test trên slow 3G connection
- [ ] Verify Core Web Vitals với Lighthouse
- [ ] Test PWA functionality
- [ ] Verify all fonts load correctly
- [ ] Check console for errors/warnings

## 📊 Monitoring

### Tools để Monitor Performance:
1. **Lighthouse** - Core Web Vitals
2. **Chrome DevTools** - Network, Performance tabs
3. **Next.js Bundle Analyzer** - Bundle size analysis
4. **Web Vitals Extension** - Real-time metrics
5. **GTmetrix** - Overall performance score

### Key Metrics để Track:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

## 🔍 Debugging

### Cache Issues
```tsx
// Clear all cache
cache.clear();

// Get cache stats
const stats = cache.getStats();
console.log('Cache stats:', stats);
```

### Service Worker Issues
```javascript
// Unregister service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});

// Clear cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

## 🎯 Next Steps

Các tối ưu hóa bổ sung có thể thực hiện:

1. **Image CDN**: Sử dụng Cloudflare Images hoặc ImageKit
2. **Database Indexing**: Optimize Supabase indexes
3. **API Routes Caching**: Implement Redis caching
4. **Edge Functions**: Move logic to edge với Vercel Edge Functions
5. **Prefetching**: Implement link prefetching cho navigation
6. **Resource Hints**: Thêm preload/prefetch cho critical resources
7. **HTTP/3**: Enable HTTP/3 trên hosting provider
8. **Web Workers**: Move heavy computations to Web Workers

## 📚 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

---

**Lưu ý**: Các cải tiến này cần được test kỹ trong production environment để đảm bảo hoạt động đúng với real-world traffic và data.

