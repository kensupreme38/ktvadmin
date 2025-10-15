/**
 * Input Validation & Sanitization Utilities
 * Bảo vệ khỏi XSS, SQL Injection và các attacks khác
 */

/**
 * Sanitize HTML để ngăn XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize URL để ngăn open redirect
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[]): string | null {
  try {
    const urlObj = new URL(url, 'http://dummy.com');
    
    // Chỉ cho phép relative URLs hoặc URLs trong allowedDomains
    if (url.startsWith('/')) {
      return url;
    }
    
    if (allowedDomains.includes(urlObj.hostname)) {
      return url;
    }
    
    return null;
  } catch {
    // Nếu không parse được, chỉ cho phép relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    return null;
  }
}

/**
 * Validate slug format (cho URLs)
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitize filename để ngăn path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .slice(0, 255);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
}

/**
 * Remove SQL injection patterns (cơ bản)
 */
export function sanitizeSqlInput(input: string): string {
  return input
    .replace(/['";]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Validate UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Trim và normalize whitespace
 */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate string length
 */
export function validateLength(
  input: string,
  min: number,
  max: number
): { isValid: boolean; error?: string } {
  if (input.length < min) {
    return { isValid: false, error: `Must be at least ${min} characters` };
  }
  if (input.length > max) {
    return { isValid: false, error: `Must be at most ${max} characters` };
  }
  return { isValid: true };
}

/**
 * Check for common XSS patterns
 */
export function detectXss(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate integer
 */
export function isValidInteger(value: any, min?: number, max?: number): boolean {
  const num = parseInt(value, 10);
  
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
}

/**
 * Sanitize object keys (ngăn prototype pollution)
 */
export function sanitizeObjectKeys<T extends Record<string, any>>(obj: T): T {
  const dangerous = ['__proto__', 'constructor', 'prototype'];
  
  const sanitized: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !dangerous.includes(key)) {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized as T;
}

