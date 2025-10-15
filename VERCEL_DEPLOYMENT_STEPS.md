# 🚀 Hướng Dẫn Deploy Lên Vercel - Chi Tiết Từng Bước

## ✅ CHUẨN BỊ

Code đã được push lên GitHub:
- Repository: `https://github.com/kensupreme38/ktvadmin`
- Branch: `main`
- Status: ✅ Ready to deploy

---

## 📋 BƯỚC 1: LẤY SUPABASE CREDENTIALS

### Truy cập Supabase Dashboard:

1. **Mở trình duyệt** → https://supabase.com/dashboard
2. **Đăng nhập** vào tài khoản Supabase của bạn
3. **Chọn project** KTV Admin (hoặc project bạn đang dùng)
4. Vào **Settings** (biểu tượng ⚙️ ở sidebar)
5. Click **API** trong menu Settings

### Copy 2 giá trị quan trọng:

```
┌─────────────────────────────────────────────────────────┐
│ Project URL                                             │
│ https://xxxxxxxxxx.supabase.co                         │
│ [Copy]                                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ API Keys                                                │
│                                                          │
│ anon public                                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...       │
│ [Copy]                                                  │
└─────────────────────────────────────────────────────────┘
```

📝 **GHI CHÚ:**
- Project URL → Dùng cho `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → Dùng cho `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**LƯU Ý:** Đây là anon key (public), không phải service_role key (secret)!

---

## 🚀 BƯỚC 2: DEPLOY LÊN VERCEL

### 2.1. Truy cập Vercel

1. Mở: **https://vercel.com**
2. Click **Sign Up** (nếu chưa có tài khoản)
3. Chọn **Continue with GitHub**
4. Cho phép Vercel truy cập GitHub

### 2.2. Import Project

1. Sau khi đăng nhập → Click nút **"Add New..."** (góc phải trên)
2. Chọn **"Project"**
3. Tab **"Import Git Repository"** sẽ hiện ra

### 2.3. Chọn Repository

```
┌─────────────────────────────────────────────────────────┐
│ Import Git Repository                                   │
│                                                          │
│ Search repositories...                                  │
│ [kensupreme38/ktvadmin]                    [Import]    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

1. Tìm repository: `kensupreme38/ktvadmin`
2. Click **"Import"**

### 2.4. Configure Project

Vercel sẽ tự động detect Next.js, bạn sẽ thấy:

```
┌─────────────────────────────────────────────────────────┐
│ Configure Project                                       │
│                                                          │
│ Project Name:                                           │
│ ┌─────────────────────────────────────────────┐        │
│ │ ktvadmin                                    │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Framework Preset: Next.js ✓                            │
│ Root Directory: ./                                      │
│ Build Command: npm run build                           │
│ Output Directory: .next                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

✅ **Để nguyên tất cả, không cần thay đổi!**

---

## 🔑 BƯỚC 3: CÁI QUAN TRỌNG NHẤT - ENVIRONMENT VARIABLES

### 3.1. Mở rộng phần Environment Variables

Scroll xuống, tìm phần **"Environment Variables"**

Click để mở rộng:

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables (Optional)                        │
│ ▼                                                        │
└─────────────────────────────────────────────────────────┘
```

### 3.2. Thêm Variable thứ 1

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
│                                                          │
│ Key:                                                    │
│ ┌─────────────────────────────────────────────┐        │
│ │ NEXT_PUBLIC_SUPABASE_URL                    │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Value:                                                  │
│ ┌─────────────────────────────────────────────┐        │
│ │ https://xxxxxxxxxx.supabase.co              │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Environment: [x] Production                             │
│              [x] Preview                                │
│              [x] Development                            │
│                                                          │
│ [Add]                                                   │
└─────────────────────────────────────────────────────────┘
```

**Điền:**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Paste **Project URL** từ Supabase (Bước 1)
- **Environment:** Chọn **TẤT CẢ 3** checkboxes
  - ☑ Production
  - ☑ Preview
  - ☑ Development

Click **"Add"**

### 3.3. Thêm Variable thứ 2

Làm tương tự, click vào ô mới:

```
┌─────────────────────────────────────────────────────────┐
│ Key:                                                    │
│ ┌─────────────────────────────────────────────┐        │
│ │ NEXT_PUBLIC_SUPABASE_ANON_KEY               │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Value:                                                  │
│ ┌─────────────────────────────────────────────┐        │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Environment: [x] Production                             │
│              [x] Preview                                │
│              [x] Development                            │
│                                                          │
│ [Add]                                                   │
└─────────────────────────────────────────────────────────┘
```

**Điền:**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Paste **anon public key** từ Supabase (Bước 1)
- **Environment:** Chọn **TẤT CẢ 3** checkboxes

Click **"Add"**

### 3.4. Kiểm tra lại

Bây giờ bạn sẽ thấy 2 variables:

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables (2)                               │
│                                                          │
│ • NEXT_PUBLIC_SUPABASE_URL                             │
│   Production, Preview, Development                      │
│                                                          │
│ • NEXT_PUBLIC_SUPABASE_ANON_KEY                        │
│   Production, Preview, Development                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

✅ **Perfect!**

---

## 🎯 BƯỚC 4: DEPLOY

1. Scroll xuống cuối trang
2. Click nút lớn **"Deploy"**
3. Vercel sẽ bắt đầu build (mất 2-3 phút)

Bạn sẽ thấy:

```
┌─────────────────────────────────────────────────────────┐
│ Building...                                             │
│                                                          │
│ ▶ Running build command: npm run build                 │
│   ✓ Compiled successfully                              │
│   ✓ Collecting page data                               │
│   ✓ Generating static pages (20/20)                    │
│   ✓ Finalizing page optimization                       │
│                                                          │
│ Deployment Status: Ready                                │
│                                                          │
│ https://ktvadmin-xxxx.vercel.app                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 BƯỚC 5: HOÀN THÀNH!

### Khi deploy thành công:

1. **URL Production:** `https://ktvadmin-xxxx.vercel.app`
2. Click vào URL để test
3. Trang login sẽ hiển thị
4. Thử đăng nhập với tài khoản Supabase

### ✅ Checklist Test:

- [ ] Trang login load được
- [ ] Có thể đăng nhập
- [ ] Dashboard hiển thị
- [ ] Data từ Supabase load được
- [ ] Images hiển thị
- [ ] PWA hoạt động (Service Worker)

---

## 🔧 BONUS: CUSTOM DOMAIN (Optional)

### Nếu bạn có domain riêng:

1. Vào project Vercel → **Settings** → **Domains**
2. **Add Domain**
3. Nhập domain của bạn: `ktv-admin.com`
4. Vercel sẽ hướng dẫn config DNS
5. Thêm DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
6. Đợi DNS propagate (5-10 phút)

---

## 📊 MONITORING

### Vercel Analytics (Free):

1. Vào project → Tab **Analytics**
2. Enable **Web Analytics**
3. Xem real-time visitors, performance

### Performance:

1. Tab **Speed Insights**
2. Xem Core Web Vitals:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Application error: a client-side exception has occurred"

**Nguyên nhân:** Environment variables chưa được set

**Fix:**
1. Vào project → **Settings** → **Environment Variables**
2. Check lại 2 variables đã thêm chưa
3. Nếu chưa → Thêm lại theo Bước 3
4. **Redeploy:** Deployments → Latest → **⋯ Menu** → **Redeploy**

### Lỗi 2: Build failed

**Nguyên nhân:** Code có lỗi

**Fix:**
1. Check build logs
2. Code đã config skip TypeScript/ESLint errors
3. Nếu vẫn lỗi → Copy error message và debug

### Lỗi 3: 404 Not Found

**Nguyên nhân:** Routing issue

**Fix:**
- Vercel tự động handle Next.js routing
- Không cần config gì thêm
- Check lại URL có đúng không

---

## 🔐 BẢO MẬT

### ⚠️ Bảo mật GitHub Token:

**Nếu bạn vô tình lộ token trong chat/code:**
1. https://github.com/settings/tokens
2. Tìm token → **Delete/Revoke**
3. Tạo token mới ngay lập tức

### ✅ Checklist Bảo mật:

- [ ] Revoke exposed token
- [ ] .env files không push lên Git
- [ ] Environment variables chỉ có trên Vercel
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] HTTPS enabled (auto trên Vercel)

---

## 📞 HỖ TRỢ

**Vercel Documentation:**
- Deploy Next.js: https://vercel.com/docs/frameworks/nextjs
- Environment Variables: https://vercel.com/docs/environment-variables

**Nếu cần help:**
- Vercel Support: https://vercel.com/support
- Discord: https://discord.gg/vercel

---

**🎊 Chúc mừng! App của bạn đã live!**

URL: https://ktvadmin-xxxx.vercel.app

