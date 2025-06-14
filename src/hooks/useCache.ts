
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  persist?: boolean; // Whether to persist in localStorage
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const { ttl = 5 * 60 * 1000, persist = false } = options; // Default 5 minutes
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback((cacheKey: string): T | null => {
    // Check memory cache first
    const memoryEntry = cache.get(cacheKey);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < memoryEntry.ttl) {
      return memoryEntry.data;
    }

    // Check localStorage if persist is enabled
    if (persist) {
      try {
        const stored = localStorage.getItem(`cache_${cacheKey}`);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (Date.now() - entry.timestamp < entry.ttl) {
            // Update memory cache
            cache.set(cacheKey, entry);
            return entry.data;
          } else {
            localStorage.removeItem(`cache_${cacheKey}`);
          }
        }
      } catch (e) {
        console.warn('Failed to read from localStorage cache:', e);
      }
    }

    return null;
  }, [persist]);

  const setCachedData = useCallback((cacheKey: string, newData: T) => {
    const entry: CacheEntry<T> = {
      data: newData,
      timestamp: Date.now(),
      ttl
    };

    // Set in memory cache
    cache.set(cacheKey, entry);

    // Set in localStorage if persist is enabled
    if (persist) {
      try {
        localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(entry));
      } catch (e) {
        console.warn('Failed to write to localStorage cache:', e);
      }
    }
  }, [ttl, persist]);

  const fetchData = useCallback(async (force = false) => {
    if (!force) {
      const cachedData = getCachedData(key);
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setCachedData(key, result);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, getCachedData, setCachedData]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    if (persist) {
      localStorage.removeItem(`cache_${key}`);
    }
  }, [key, persist]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidate
  };
};

export const clearCache = (pattern?: string) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
    // Clear localStorage items matching pattern
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_') && key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    }
  } else {
    cache.clear();
    // Clear all cache items from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    }
  }
};
