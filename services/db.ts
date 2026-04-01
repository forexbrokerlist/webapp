import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants"
import { PrismaClient } from "~/.generated/prisma/client"
import { env } from "~/env"
import { uniqueSlugsExtension } from "~/prisma/extensions/unique-slugs"

const getConnectionString = () => {
  const usePublicConnection = env.DATABASE_PUBLIC_URL && env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
  return usePublicConnection ? env.DATABASE_PUBLIC_URL : env.DATABASE_URL
}

const prismaClientSingleton = () => {
  const connectionString = getConnectionString()
  // Use a shared pool with a hard cap to prevent connection exhaustion
  const pool = new Pool({
    connectionString,
    max: 5,           // maximum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any)
  const client = new PrismaClient({ adapter })

  return client.$extends(uniqueSlugsExtension)
}

declare const globalThis: {
  dbGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

// Always reuse the singleton — in both dev and production
const db = globalThis.dbGlobal ?? prismaClientSingleton()
globalThis.dbGlobal = db

export { db }
