/**
 * Security Module - Central Export
 * Import tất cả security utilities từ đây
 */

// Rate Limiting
export {
  rateLimit,
  authRateLimiter,
  apiRateLimiter,
  strictRateLimiter,
  cleanupRateLimitStore,
} from './rate-limit';

// Validation & Sanitization
export {
  sanitizeHtml,
  isValidEmail,
  validatePassword,
  sanitizeRedirectUrl,
  isValidSlug,
  sanitizeFilename,
  isValidPhone,
  sanitizeSqlInput,
  isValidUuid,
  normalizeWhitespace,
  validateLength,
  detectXss,
  isValidInteger,
  sanitizeObjectKeys,
} from './validation';

// Encryption & Hashing
export {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashData,
  generateApiKey,
  maskEmail,
  maskPhone,
  maskCardNumber,
} from './encryption';

// CSRF Protection
export {
  generateCsrfToken,
  setCsrfToken,
  getCsrfToken,
  verifyCsrfToken,
  validateCsrfToken,
} from './csrf';

// Security Headers
export {
  addSecurityHeaders,
  createRateLimitHeaders,
  createCorsHeaders,
  createCSP,
  addCacheHeaders,
} from './headers';

// Middleware Helpers
export {
  getClientIdentifier,
  isAllowedOrigin,
  applyRateLimit,
  isProtectedPath,
  isAuthPath,
  isPublicApi,
  logSecurityEvent,
  createSecurityViolationResponse,
  isValidMethod,
  hasSuspiciousPatterns,
  hasMaliciousQuery,
} from './middleware-helpers';

// Authentication Helpers
export {
  hasRole,
  isAdmin,
  isUserBlocked,
  getCurrentUserWithRole,
  requireAuth,
  requireAdmin,
  isSessionExpired,
  generateSessionId,
  validatePasswordStrength,
  recordFailedLogin,
  clearFailedLogins,
  isAccountLocked,
} from './auth-helpers';

// Types
export type { LoginAttempt } from './auth-helpers';

