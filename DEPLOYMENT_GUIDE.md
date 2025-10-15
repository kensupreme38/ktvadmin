# 🚀 Hướng Dẫn Deploy KTV Admin

## ⚠️ QUAN TRỌNG: Environment Variables

Dự án **BẮT BUỘC** phải có 2 environment variables để hoạt động:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Nếu thiếu → App sẽ crash ngay khi chạy!**

---

## 📋 Chuẩn Bị Trước Khi Deploy

### 1. Lấy Supabase Credentials

Truy cập Supabase Dashboard:
1. Vào: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy 2 giá trị:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🌐 Deploy lên Vercel (Khuyên dùng cho Next.js)

### Bước 1: Chuẩn bị

```bash
# Code đã được push lên GitHub ✅
# Repository: https://github.com/kensupreme38/ktvadmin
```

### Bước 2: Deploy trên Vercel

1. **Truy cập:** https://vercel.com
2. **Đăng nhập** với GitHub account
3. Click **"Add New..."** → **"Project"**
4. **Import** repository: `kensupreme38/ktvadmin`
5. **Configure Project:**
   - Framework Preset: **Next.js** (tự động detect)
   - Root Directory: **./** (để mặc định)
   - Build Command: **npm run build**
   - Output Directory: **.next**

### Bước 3: Thêm Environment Variables (QUAN TRỌNG!)

Trong phần **Environment Variables**, thêm:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Chọn:** All (Production, Preview, and Development)

### Bước 4: Deploy

Click **"Deploy"** → Đợi 2-3 phút

✅ **Xong!** URL sẽ có dạng: `https://ktvadmin.vercel.app`

---

## 🔧 Deploy lên Netlify

### Bước 1-2: Tương tự Vercel

1. Truy cập: https://app.netlify.com
2. **Add new site** → **Import from Git**
3. Chọn repository: `kensupreme38/ktvadmin`

### Bước 3: Build settings

- **Build command:** `npm run build`
- **Publish directory:** `.next`

### Bước 4: Environment Variables

Vào **Site settings** → **Environment variables** → **Add variable**

Thêm 2 biến:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Bước 5: Deploy

Click **"Deploy site"**

---

## 🐳 Deploy lên VPS/Server (Advanced)

### Requirements:
- Node.js 18+
- PM2 (process manager)

### Steps:

```bash
# 1. Clone repository
git clone https://github.com/kensupreme38/ktvadmin.git
cd ktvadmin

# 2. Install dependencies
npm install

# 3. Tạo file .env.local
nano .env.local
```

Paste vào:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

```bash
# 4. Build
npm run build

# 5. Start with PM2
npm install -g pm2
pm2 start npm --name "ktv-admin" -- start
pm2 save
pm2 startup
```

### Nginx Config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ Kiểm Tra Sau Deploy

### 1. Test Basic Functionality
- ✅ Trang login load được
- ✅ Có thể đăng nhập
- ✅ Dashboard hiển thị data

### 2. Check Performance
- Open DevTools → Lighthouse
- Check Core Web Vitals:
  - LCP < 2.5s ✅
  - FID < 100ms ✅
  - CLS < 0.1 ✅

### 3. Test Service Worker
- DevTools → Application → Service Workers
- Check cache working

---

## 🐛 Troubleshooting

### Lỗi: "Cannot read properties of undefined"
**Nguyên nhân:** Environment variables chưa được set

**Fix:**
1. Check lại env vars trên platform
2. Redeploy sau khi thêm env vars

### Lỗi: Build Failed
**Nguyên nhân:** TypeScript/ESLint errors

**Fix:**
```bash
# Tạm thời skip
# Đã config trong next.config.ts:
typescript: { ignoreBuildErrors: true }
eslint: { ignoreDuringBuilds: true }
```

### Lỗi: 404 on refresh
**Fix:** Vercel/Netlify tự động handle, không cần config

---

## 📊 Monitoring (Optional)

### Vercel Analytics
1. Project → Analytics tab
2. Enable **Web Analytics**
3. Monitor real-time traffic

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔐 Security Checklist

- ✅ `.env` files trong `.gitignore`
- ✅ Environment variables set trên platform
- ✅ HTTPS enabled (tự động trên Vercel/Netlify)
- ✅ GitHub token revoked sau khi lộ
- ✅ Supabase RLS (Row Level Security) enabled

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs

---

**Lưu ý:** Environment variables là **REQUIRED** để app hoạt động. Không có sẽ crash!

