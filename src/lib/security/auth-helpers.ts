/**
 * Authentication Security Helpers
 * Các hàm bảo mật cho authentication
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Check if user has required role
 */
export async function hasRole(
  userId: string,
  requiredRoles: ('admin' | 'editor' | 'user')[]
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      return false;
    }
    
    return requiredRoles.includes(user.role as any);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, ['admin']);
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('is_blocked')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      return false;
    }
    
    return user.is_blocked === true;
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    return false;
  }
}

/**
 * Get current authenticated user with role
 */
export async function getCurrentUserWithRole() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return null;
    }
    
    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }
    
    return {
      ...authUser,
      profile,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication (throw if not authenticated)
 */
export async function requireAuth() {
  const user = await getCurrentUserWithRole();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (user.profile?.is_blocked) {
    throw new Error('Account is blocked');
  }
  
  return user;
}

/**
 * Require admin role (throw if not admin)
 */
export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

/**
 * Validate session age (check if session is too old)
 */
export function isSessionExpired(lastActivity: Date, maxAge: number = 24 * 60 * 60 * 1000): boolean {
  const now = Date.now();
  const lastActivityTime = lastActivity.getTime();
  
  return now - lastActivityTime > maxAge;
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Validate password meets requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Complexity checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Feedback
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  }
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Add special characters');
  }
  
  // Common passwords check
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', '1234567890', 'password123'
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common passwords');
    score = Math.max(0, score - 2);
  }
  
  return {
    isValid: score >= 4 && feedback.length === 0,
    score: Math.min(5, score),
    feedback,
  };
}

/**
 * Check for account lockout after failed attempts
 */
export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export function recordFailedLogin(identifier: string): {
  locked: boolean;
  remainingAttempts: number;
  lockedUntil?: Date;
} {
  const now = Date.now();
  const maxAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes
  
  let attempt = loginAttempts.get(identifier);
  
  if (!attempt) {
    attempt = { count: 0, lastAttempt: now };
  }
  
  // Reset if last attempt was more than 15 minutes ago
  if (now - attempt.lastAttempt > lockoutDuration) {
    attempt = { count: 0, lastAttempt: now };
  }
  
  // Check if currently locked
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    return {
      locked: true,
      remainingAttempts: 0,
      lockedUntil: new Date(attempt.lockedUntil),
    };
  }
  
  // Increment count
  attempt.count++;
  attempt.lastAttempt = now;
  
  // Lock if exceeded max attempts
  if (attempt.count >= maxAttempts) {
    attempt.lockedUntil = now + lockoutDuration;
    loginAttempts.set(identifier, attempt);
    
    return {
      locked: true,
      remainingAttempts: 0,
      lockedUntil: new Date(attempt.lockedUntil),
    };
  }
  
  loginAttempts.set(identifier, attempt);
  
  return {
    locked: false,
    remainingAttempts: maxAttempts - attempt.count,
  };
}

export function clearFailedLogins(identifier: string): void {
  loginAttempts.delete(identifier);
}

export function isAccountLocked(identifier: string): boolean {
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt || !attempt.lockedUntil) {
    return false;
  }
  
  return Date.now() < attempt.lockedUntil;
}

