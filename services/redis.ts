import Redis from "ioredis"
import { env } from "~/env"

const createRedisClient = () => {
  if (!env.REDIS_URL) {
    return null
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy: () => null,
  })

  client.on("error", () => {})

  return client
}

declare const globalThis: {
  redisGlobal: ReturnType<typeof createRedisClient>
} & typeof global

const redis = globalThis.redisGlobal ?? createRedisClient()

export { redis }

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis
