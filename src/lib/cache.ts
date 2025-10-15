/**
 * Enhanced cache for client-side data with LRU eviction and optional persistence
 * Helps reduce unnecessary API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

interface CacheConfig {
  maxSize?: number;
  enablePersistence?: boolean;
  persistenceKey?: string;
}

class EnhancedCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private enablePersistence: boolean;
  private persistenceKey: string;
  private isClient: boolean;

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100;
    this.enablePersistence = config.enablePersistence ?? false;
    this.persistenceKey = config.persistenceKey || 'app-cache';
    this.isClient = typeof window !== 'undefined';
    
    // Load from localStorage on initialization (client-side only)
    if (this.isClient && this.enablePersistence) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.persistenceKey);
      if (stored) {
        const entries = JSON.parse(stored);
        const now = Date.now();
        
        // Only load non-expired entries
        for (const [key, entry] of Object.entries(entries)) {
          const cacheEntry = entry as CacheEntry<any>;
          const age = now - cacheEntry.timestamp;
          
          if (age <= cacheEntry.ttl) {
            this.cache.set(key, cacheEntry);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (!this.isClient || !this.enablePersistence) return;
    
    try {
      const entries = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.persistenceKey, JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private evictLRU(): void {
    if (this.cache.size < this.maxSize) return;

    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    // Find least recently used entry
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    // Evict LRU entry if cache is full
    this.evictLRU();

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: ttlSeconds * 1000,
      accessCount: 0,
      lastAccess: now,
    });

    // Persist to storage
    this.saveToStorage();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccess = now;
    this.cache.set(key, entry);

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    if (this.isClient && this.enablePersistence) {
      try {
        localStorage.removeItem(this.persistenceKey);
      } catch (error) {
        console.warn('Failed to clear cache from storage:', error);
      }
    }
  }

  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.clear();
      return;
    }

    // Remove keys matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }

    this.saveToStorage();
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        timeSinceLastAccess: now - entry.lastAccess,
      })),
    };
  }

  // Prune expired entries
  prune(): number {
    const now = Date.now();
    let prunedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
        prunedCount++;
      }
    }

    if (prunedCount > 0) {
      this.saveToStorage();
    }

    return prunedCount;
  }
}

// Export singleton instance with optimized settings
export const cache = new EnhancedCache({
  maxSize: 150,
  enablePersistence: true,
  persistenceKey: 'ktv-app-cache',
});

// Auto-prune expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.prune();
  }, 5 * 60 * 1000);
}


