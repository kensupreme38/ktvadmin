/**
 * Middleware Helper Functions
 * Các hàm tiện ích cho middleware bảo mật
 */

import { NextRequest, NextResponse } from 'next/server';
import { authRateLimiter, apiRateLimiter } from './rate-limit';
import { addSecurityHeaders, createRateLimitHeaders } from './headers';

/**
 * Get client identifier (IP address)
 */
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || '',
    'http://localhost:9002',
    'http://localhost:3000',
  ].filter(Boolean);
  
  if (!origin) {
    // Same-origin requests don't have origin header
    return true;
  }
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

/**
 * Apply rate limiting to request
 */
export function applyRateLimit(
  request: NextRequest,
  type: 'auth' | 'api' = 'api'
): { allowed: boolean; response?: NextResponse } {
  const identifier = getClientIdentifier(request);
  const limiter = type === 'auth' ? authRateLimiter : apiRateLimiter;
  
  const result = limiter.check(identifier);
  
  if (!result.success) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please try again later',
        resetTime: new Date(result.resetTime).toISOString(),
      },
      { status: 429 }
    );
    
    const headers = createRateLimitHeaders(result.remaining, result.resetTime);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return { allowed: false, response };
  }
  
  return { allowed: true };
}

/**
 * Check if path is protected (requires auth)
 */
export function isProtectedPath(pathname: string): boolean {
  const protectedPaths = [
    '/admin',
    '/api/admin',
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * Check if path is auth-related
 */
export function isAuthPath(pathname: string): boolean {
  const authPaths = [
    '/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/api/auth',
  ];
  
  return authPaths.some(path => pathname.startsWith(path));
}

/**
 * Check if path is public API
 */
export function isPublicApi(pathname: string): boolean {
  const publicApis = [
    '/api/test-supabase',
    '/api/health',
  ];
  
  return publicApis.some(path => pathname.startsWith(path));
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
) {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    ip: getClientIdentifier(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    ...details,
  };
  
  // Log to console (trong production nên log vào file hoặc service)
  console.warn('[SECURITY]', JSON.stringify(log));
  
  // TODO: Gửi đến logging service (Sentry, LogRocket, etc.)
}

/**
 * Create security violation response
 */
export function createSecurityViolationResponse(
  reason: string,
  statusCode: number = 403
): NextResponse {
  const response = NextResponse.json(
    {
      error: 'Security violation',
      message: reason,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
  
  return addSecurityHeaders(response);
}

/**
 * Validate request method
 */
export function isValidMethod(
  request: NextRequest,
  allowedMethods: string[]
): boolean {
  return allowedMethods.includes(request.method.toUpperCase());
}

/**
 * Check for suspicious patterns in URL
 */
export function hasSuspiciousPatterns(pathname: string): boolean {
  const suspiciousPatterns = [
    /\.\./,           // Path traversal
    /\/\//,           // Double slash
    /%2e%2e/i,        // Encoded path traversal
    /%00/i,           // Null byte
    /\.(env|git|sql|log|bak|backup)$/i, // Sensitive files
    /wp-admin/i,      // WordPress attack attempts
    /phpmyadmin/i,    // phpMyAdmin attack attempts
    /\.php$/i,        // PHP file attempts
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(pathname));
}

/**
 * Sanitize query parameters
 */
export function hasMaliciousQuery(url: URL): boolean {
  const maliciousPatterns = [
    /javascript:/i,
    /<script/i,
    /on\w+=/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i,
  ];
  
  const queryString = url.search;
  
  return maliciousPatterns.some(pattern => pattern.test(queryString));
}

