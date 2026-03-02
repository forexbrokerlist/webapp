import axios from "axios"

// Use environment variable or fallback for the 14-character alphanumeric secret
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || "gKlOOMqk8N9Lbw"

// Algorithm: Base64 encoding
// Encoding: UTF-8
const getEncodedSecret = () => {
  if (typeof window !== "undefined") {
    // Browser environment
    return btoa(unescape(encodeURIComponent(API_SECRET)))
  }
  // Node environment
  return Buffer.from(API_SECRET, "utf-8").toString("base64")
}

const encodedSecret = getEncodedSecret()

/**
 * Common Axios instance with Base64 Bearer token authorization
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${encodedSecret}`,

  },
})

/**
 * Factory for creating an axios instance if a dynamic baseURL is required
 */
export const createApiClient = (baseURL: string | undefined) => {
  return axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${encodedSecret}`,
    },
  })
}
