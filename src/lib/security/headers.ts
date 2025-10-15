/**
 * Security Headers Utilities
 * Quản lý các security headers
 */

import { NextResponse } from 'next/server';

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // X-Frame-Options: Ngăn clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options: Ngăn MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection: Enable XSS filter
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy: Disable unnecessary features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Remove powered by header
  response.headers.delete('X-Powered-By');
  
  return response;
}

/**
 * Create rate limit headers
 */
export function createRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
  };
}

/**
 * Create CORS headers
 */
export function createCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || '',
    'http://localhost:9002',
    'http://localhost:3000',
  ].filter(Boolean);
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
  
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  return headers;
}

/**
 * Create Content Security Policy
 */
export function createCSP(): string {
  const policies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
  ];
  
  return policies.join('; ');
}

/**
 * Add cache control headers
 */
export function addCacheHeaders(
  response: NextResponse,
  type: 'public' | 'private' | 'no-cache',
  maxAge?: number
): NextResponse {
  if (type === 'no-cache') {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, max-age=0'
    );
  } else if (type === 'private') {
    response.headers.set(
      'Cache-Control',
      `private, max-age=${maxAge || 0}`
    );
  } else {
    response.headers.set(
      'Cache-Control',
      `public, max-age=${maxAge || 3600}, immutable`
    );
  }
  
  return response;
}

