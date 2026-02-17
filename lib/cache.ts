import { redis } from "~/services/redis"

/**
 * Get a cached value from Redis
 * @param key - The cache key
 * @returns The cached value or null if not found or Redis is unavailable
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  if (!redis) {
    return null
  }

  try {
    const data = await redis.get(key)

    if (!data) {
      return null
    }

    return JSON.parse(data) as T
  } catch {
    return null
  }
}

/**
 * Set a value in the cache with optional TTL
 * @param key - The cache key
 * @param value - The value to cache
 * @param ttl - Time to live in seconds (defaults to 24 hours)
 */
export const setCache = async (key: string, value: unknown, ttl = 60 * 60 * 24): Promise<void> => {
  if (!redis) {
    return
  }

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl)
  } catch {
    // Silently fail - caching is not critical
  }
}

/**
 * Delete a cached value from Redis
 * @param key - The cache key
 */
export const deleteCache = async (key: string): Promise<void> => {
  if (!redis) {
    return
  }

  try {
    await redis.del(key)
  } catch {
    // Silently fail
  }
}
