/**
 * Rate Limiting Utilities
 * Bảo vệ khỏi brute force attacks và spam
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (production nên dùng Redis)
const store = new Map<string, RateLimitStore>();

interface RateLimitOptions {
  interval: number; // milliseconds
  maxRequests: number;
}

/**
 * Simple rate limiter
 */
export function rateLimit(options: RateLimitOptions) {
  const { interval, maxRequests } = options;

  return {
    check: (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
      const now = Date.now();
      const key = identifier;
      
      let record = store.get(key);

      // Tạo record mới hoặc reset nếu hết thời gian
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + interval,
        };
        store.set(key, record);
      }

      // Kiểm tra limit
      if (record.count >= maxRequests) {
        return {
          success: false,
          remaining: 0,
          resetTime: record.resetTime,
        };
      }

      // Tăng counter
      record.count++;
      store.set(key, record);

      return {
        success: true,
        remaining: maxRequests - record.count,
        resetTime: record.resetTime,
      };
    },
  };
}

/**
 * Rate limiters cho các endpoints khác nhau
 */
export const authRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 phút
  maxRequests: 5, // 5 lần thử đăng nhập
});

export const apiRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 phút
  maxRequests: 60, // 60 requests
});

export const strictRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 phút
  maxRequests: 10, // 10 requests
});

/**
 * Cleanup old entries (chạy định kỳ)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}

// Cleanup mỗi 5 phút
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

