# 🔒 Hướng Dẫn Bảo Mật - KTV Admin

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Các Cải Tiến Đã Thực Hiện](#các-cải-tiến-đã-thực-hiện)
3. [Cấu Hình Bảo Mật](#cấu-hình-bảo-mật)
4. [Sử Dụng Security Utilities](#sử-dụng-security-utilities)
5. [Best Practices](#best-practices)
6. [Checklist Bảo Mật](#checklist-bảo-mật)
7. [Xử Lý Sự Cố](#xử-lý-sự-cố)

---

## Tổng Quan

Dự án đã được cải thiện với các tính năng bảo mật toàn diện để bảo vệ khỏi các mối đe dọa phổ biến như:

- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ SQL Injection
- ✅ Brute Force Attacks
- ✅ Rate Limiting / DDoS
- ✅ Clickjacking
- ✅ Open Redirects
- ✅ Path Traversal
- ✅ Session Hijacking
- ✅ Data Leaks

---

## Các Cải Tiến Đã Thực Hiện

### 1. 🛡️ Security Headers (next.config.ts)

**Trước:**
```typescript
typescript: {
  ignoreBuildErrors: true, // ❌ NGUY HIỂM!
},
```

**Sau:**
```typescript
typescript: {
  ignoreBuildErrors: false, // ✅ An toàn
},
```

**Headers đã thêm:**
- `X-Frame-Options: SAMEORIGIN` - Ngăn clickjacking
- `X-Content-Type-Options: nosniff` - Ngăn MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Bật XSS filter
- `Strict-Transport-Security` - Force HTTPS
- `Content-Security-Policy` - Kiểm soát tài nguyên
- `Referrer-Policy` - Kiểm soát referrer
- `Permissions-Policy` - Giới hạn API browser

### 2. 🚦 Rate Limiting

Tạo `src/lib/security/rate-limit.ts`:
- **Auth endpoints**: 5 attempts / 15 phút
- **API endpoints**: 60 requests / phút
- **Strict endpoints**: 10 requests / phút

### 3. ✔️ Input Validation & Sanitization

Tạo `src/lib/security/validation.ts`:
- Sanitize HTML (ngăn XSS)
- Validate email, password, phone
- Check XSS patterns
- Sanitize filenames, URLs
- Validate UUID, slugs

### 4. 🔐 Encryption & Hashing

Tạo `src/lib/security/encryption.ts`:
- AES-256-GCM encryption
- Password hashing với PBKDF2
- Secure token generation
- Data masking (email, phone, card)

### 5. 🛡️ CSRF Protection

Tạo `src/lib/security/csrf.ts`:
- Generate CSRF tokens
- Validate tokens với timing-safe comparison
- HttpOnly cookies

### 6. 🔑 Authentication Security

Tạo `src/lib/security/auth-helpers.ts`:
- Role-based access control
- Account lockout (5 failed attempts)
- Password strength validation
- Session management

### 7. 🌐 Security Headers Utilities

Tạo `src/lib/security/headers.ts`:
- Dynamic security headers
- CORS configuration
- CSP (Content Security Policy)
- Cache control headers

### 8. 🛠️ Middleware Helpers

Tạo `src/lib/security/middleware-helpers.ts`:
- Client identification (IP)
- Suspicious pattern detection
- Request validation
- Security event logging

---

## Cấu Hình Bảo Mật

### 1. Environment Variables

Copy file `env.example` thành `.env.local`:

```bash
cp env.example .env.local
```

**Các biến quan trọng:**

```env
# Supabase (BẮT BUỘC)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key # ⚠️ KEEP SECRET

# Security (KHUYẾN NGHỊ)
ENCRYPTION_SECRET=your-32-char-secret
SESSION_SECRET=your-session-secret
```

**Generate secrets:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Supabase Row Level Security (RLS)

**QUAN TRỌNG:** Bật RLS cho tất cả các tables:

```sql
-- Enable RLS
ALTER TABLE ktvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy cho users table
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy cho ktvs table
CREATE POLICY "Public can view active KTVs"
  ON ktvs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage own KTVs"
  ON ktvs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all KTVs"
  ON ktvs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Vercel Deployment Security

Khi deploy lên Vercel:

1. **Environment Variables:**
   - Thêm tất cả vars từ `env.example`
   - Đảm bảo `SUPABASE_SERVICE_ROLE_KEY` chỉ có ở Production/Preview

2. **Domains:**
   - Thêm domain vào `NEXT_PUBLIC_BASE_URL`
   - Cập nhật CORS allowed origins

3. **Headers:**
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "SAMEORIGIN"
           }
         ]
       }
     ]
   }
   ```

---

## Sử Dụng Security Utilities

### 1. Rate Limiting trong API Routes

```typescript
// app/api/login/route.ts
import { authRateLimiter } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limit
  const { success, remaining } = authRateLimiter.check(ip);
  
  if (!success) {
    return Response.json(
      { error: 'Too many login attempts' },
      { status: 429 }
    );
  }
  
  // Continue with login logic...
}
```

### 2. Input Validation

```typescript
import { 
  sanitizeHtml, 
  isValidEmail, 
  validatePassword 
} from '@/lib/security/validation';

// Sanitize user input
const safeName = sanitizeHtml(userInput);

// Validate email
if (!isValidEmail(email)) {
  return { error: 'Invalid email format' };
}

// Check password strength
const { isValid, errors } = validatePassword(password);
if (!isValid) {
  return { error: errors.join(', ') };
}
```

### 3. CSRF Protection

```typescript
// Server Component
import { setCsrfToken, getCsrfToken } from '@/lib/security/csrf';

export default async function FormPage() {
  const token = await setCsrfToken();
  
  return (
    <form>
      <input type="hidden" name="csrf_token" value={token} />
      {/* other fields */}
    </form>
  );
}

// API Route
import { verifyCsrfToken } from '@/lib/security/csrf';

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get('csrf_token') as string;
  
  if (!await verifyCsrfToken(token)) {
    return Response.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  
  // Continue...
}
```

### 4. Authentication Guards

```typescript
import { requireAuth, requireAdmin } from '@/lib/security/auth-helpers';

// Require any authenticated user
export async function GET() {
  try {
    const user = await requireAuth();
    // User is authenticated
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Require admin
export async function DELETE() {
  try {
    const admin = await requireAdmin();
    // User is admin
  } catch (error) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
}
```

### 5. Encryption

```typescript
import { encrypt, decrypt, maskEmail } from '@/lib/security/encryption';

// Encrypt sensitive data
const encrypted = encrypt('sensitive data', process.env.ENCRYPTION_SECRET!);

// Decrypt
const decrypted = decrypt(encrypted, process.env.ENCRYPTION_SECRET!);

// Mask email for display
const masked = maskEmail('user@example.com'); // "use***@example.com"
```

### 6. Failed Login Tracking

```typescript
import { 
  recordFailedLogin, 
  clearFailedLogins,
  isAccountLocked 
} from '@/lib/security/auth-helpers';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Check if locked
  if (isAccountLocked(email)) {
    return Response.json(
      { error: 'Account locked. Try again later.' },
      { status: 429 }
    );
  }
  
  // Try to authenticate...
  const success = await authenticate(email, password);
  
  if (!success) {
    const { locked, remainingAttempts, lockedUntil } = recordFailedLogin(email);
    
    if (locked) {
      return Response.json({
        error: `Account locked until ${lockedUntil?.toISOString()}`,
      }, { status: 429 });
    }
    
    return Response.json({
      error: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
    }, { status: 401 });
  }
  
  // Clear on success
  clearFailedLogins(email);
  
  return Response.json({ success: true });
}
```

---

## Best Practices

### 1. 🔑 Quản Lý Secrets

**✅ NÊN:**
- Sử dụng environment variables
- Rotate secrets định kỳ
- Khác biệt secrets giữa các môi trường
- Sử dụng secret management tools (AWS Secrets Manager, Vercel, etc.)

**❌ KHÔNG NÊN:**
- Hard-code secrets trong code
- Commit `.env` files
- Share secrets qua email/chat
- Dùng chung secrets giữa dev và prod

### 2. 🔐 Password Security

**✅ NÊN:**
- Yêu cầu password >= 8 ký tự
- Kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt
- Sử dụng bcrypt hoặc PBKDF2 để hash
- Implement account lockout
- Cho phép password reset

**❌ KHÔNG NÊN:**
- Lưu password plain text
- Gửi password qua email
- Log passwords
- Dùng MD5 hoặc SHA1 để hash

### 3. 🛡️ Input Validation

**✅ NÊN:**
- Validate trên cả client VÀ server
- Whitelist input (cho phép những gì an toàn)
- Sanitize HTML output
- Validate file uploads (type, size)
- Limit input length

**❌ KHÔNG NÊN:**
- Trust client-side validation
- Blacklist patterns only
- Allow arbitrary HTML
- Skip validation cho "admin" users

### 4. 🔒 Session Management

**✅ NÊN:**
- Use HttpOnly cookies
- Set SameSite=Strict/Lax
- Implement session timeout
- Regenerate session ID after login
- Use secure flag in production

**❌ KHÔNG NÊN:**
- Store session data in localStorage
- Use predictable session IDs
- Long-lived sessions
- Share sessions across domains

### 5. 🌐 API Security

**✅ NÊN:**
- Implement rate limiting
- Validate all inputs
- Use HTTPS only
- Return proper error codes
- Log security events

**❌ KHÔNG NÊN:**
- Expose internal errors
- Allow unlimited requests
- Use GET for mutations
- Reveal system information

### 6. 📊 Logging & Monitoring

**✅ NÊN:**
- Log authentication events
- Log authorization failures
- Monitor suspicious patterns
- Set up alerts
- Regular security audits

**❌ KHÔNG NÊN:**
- Log sensitive data (passwords, tokens)
- Ignore error logs
- Store logs indefinitely
- Share logs publicly

---

## Checklist Bảo Mật

### Development

- [ ] `.env.local` không được commit
- [ ] Tất cả secrets được set trong environment
- [ ] TypeScript errors = 0
- [ ] ESLint warnings đã được xử lý
- [ ] Input validation cho tất cả forms
- [ ] CSRF protection cho mutations
- [ ] Rate limiting cho sensitive endpoints
- [ ] XSS protection (sanitize output)
- [ ] SQL injection protection (use parameterized queries)

### Pre-Production

- [ ] Security headers đã được config
- [ ] HTTPS được enforce
- [ ] RLS policies đã được test
- [ ] Rate limits đã được test
- [ ] Error messages không leak info
- [ ] Logging được setup
- [ ] Monitoring được setup
- [ ] Backup strategy được plan

### Production

- [ ] Secrets rotation schedule
- [ ] Regular security audits
- [ ] Dependency updates (npm audit)
- [ ] Penetration testing
- [ ] Incident response plan
- [ ] User data encryption
- [ ] GDPR/Privacy compliance
- [ ] DDoS protection (Cloudflare, AWS Shield)

---

## Xử Lý Sự Cố

### 1. Phát Hiện Brute Force Attack

**Dấu hiệu:**
- Nhiều failed login attempts từ cùng IP
- Rate limit errors tăng đột biến

**Hành động:**
```typescript
// Check logs
console.log(loginAttempts);

// Block IP tạm thời (implement IP blacklist)
const blockedIPs = new Set<string>();

// Tăng lockout duration
authRateLimiter.interval = 60 * 60 * 1000; // 1 hour
```

### 2. Phát Hiện XSS Attempt

**Dấu hiệu:**
- Input chứa `<script>`, `javascript:`, `onerror=`
- Suspicious query parameters

**Hành động:**
```typescript
import { detectXss } from '@/lib/security/validation';

if (detectXss(userInput)) {
  logSecurityEvent('xss_attempt', { input: userInput });
  return Response.json({ error: 'Invalid input' }, { status: 400 });
}
```

### 3. Phát Hiện CSRF Attack

**Dấu hiệu:**
- Missing CSRF token
- Invalid CSRF token
- Requests từ unknown origins

**Hành động:**
```typescript
if (!await verifyCsrfToken(token)) {
  logSecurityEvent('csrf_violation', { 
    token, 
    origin: request.headers.get('origin') 
  });
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 4. Data Breach Response

**Ngay lập tức:**
1. Xác định phạm vi breach
2. Isolate affected systems
3. Reset tất cả secrets
4. Force logout all users
5. Notify affected users
6. Report theo luật (GDPR: 72h)

**Sau đó:**
1. Root cause analysis
2. Fix vulnerabilities
3. Update security measures
4. Train team
5. Document incident

---

## Công Cụ Bảo Mật

### 1. Scanning Tools

```bash
# Dependency vulnerabilities
npm audit
npm audit fix

# Security scan
npm install -g snyk
snyk test

# OWASP ZAP (penetration testing)
# https://www.zaproxy.org/
```

### 2. Monitoring Services

- **Sentry**: Error tracking & monitoring
- **LogRocket**: Session replay & debugging
- **Datadog**: Infrastructure monitoring
- **CloudFlare**: DDoS protection & WAF

### 3. Testing

```typescript
// Example security test
describe('Security Tests', () => {
  it('should block XSS attempts', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ content: xssPayload }),
    });
    expect(response.status).toBe(400);
  });
  
  it('should enforce rate limiting', async () => {
    // Make 10 rapid requests
    const requests = Array(10).fill(null).map(() => 
      fetch('/api/login', { method: 'POST' })
    );
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });
});
```

---

## Tài Liệu Tham Khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)

---

## Liên Hệ

Nếu phát hiện security vulnerability:
- **KHÔNG** tạo public issue
- Email: security@yourdomain.com
- Sử dụng responsible disclosure

---

**Lưu ý:** Bảo mật là một quá trình liên tục, không phải là một trạng thái. Luôn cập nhật và cải thiện!

