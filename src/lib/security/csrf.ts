/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Bảo vệ khỏi CSRF attacks
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_SECRET_LENGTH = 32;

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_SECRET_LENGTH).toString('hex');
}

/**
 * Set CSRF token in cookie (server-side)
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return token;
}

/**
 * Get CSRF token from cookie (server-side)
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_TOKEN_NAME);
  return token?.value || null;
}

/**
 * Verify CSRF token
 */
export async function verifyCsrfToken(token: string): Promise<boolean> {
  const storedToken = await getCsrfToken();
  
  if (!storedToken || !token) {
    return false;
  }
  
  // Constant-time comparison để ngăn timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(storedToken),
    Buffer.from(token)
  );
}

/**
 * CSRF middleware cho API routes
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  // Chỉ check cho POST, PUT, DELETE, PATCH
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true;
  }
  
  // Lấy token từ header
  const token = request.headers.get('X-CSRF-Token') || 
                request.headers.get('x-csrf-token');
  
  if (!token) {
    return false;
  }
  
  return await verifyCsrfToken(token);
}

