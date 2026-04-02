import axios, { InternalAxiosRequestConfig } from "axios"
import { SignJWT } from "jose"

// Use environment variable or fallback for the 14-character alphanumeric secret
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || "gKlOOMqk8N9Lbw"

/**
 * Generates a signed JWT token using HS256 algorithm
 */
export const getSignedToken = async () => {
  const secret = new TextEncoder().encode(API_SECRET)
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret)
}

/**
 * Adds an authorization interceptor to an axios instance
 */
const addAuthInterceptor = (instance: typeof apiClient | any) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await getSignedToken()
        config.headers.apiKey = `${token}`
      } catch (error) {
        console.error("Error signing API token:", error)
      }
      return config
    },
    (error: any) => Promise.reject(error)
  )
}

/**
 * Common Axios instance with JWT Bearer token authorization
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

addAuthInterceptor(apiClient)

/**
 * Factory for creating an axios instance if a dynamic baseURL is required
 */
export const createApiClient = (baseURL: string | undefined) => {
  const instance = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })

  addAuthInterceptor(instance)
  return instance
}
