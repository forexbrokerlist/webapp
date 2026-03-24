import crypto from "crypto"
import axios from "axios"
import { env } from "~/env"

export type CregisPayload = {
  timestamp: number
  nonce: string
  order_id: string
  order_amount: number
  order_currency: string
  callback_url: string
  remark: string
  payer_id: string
  payer_name: string
  payer_email: string
  valid_time: number
  pid: string
  cancel_url?: string
  success_url: string
  tokens: string // JSON string array
  sign?: string
}

export function generateSignature(params: Record<string, any>, apiKey: string) {
  const filteredParams: Record<string, string | number> = {}
  for (const key in params) {
    const value = params[key]
    if (key !== "sign" && value !== null && value !== undefined && value !== "") {
      filteredParams[key] = value
    }
  }
  const sortedKeys = Object.keys(filteredParams).sort()
  const concatenated = sortedKeys.map((key) => `${key}${filteredParams[key]}`).join("")
  const stringToSign = apiKey + concatenated
  const sign = crypto.createHash("md5").update(stringToSign).digest("hex").toLowerCase()
  return { ...params, sign }
}

export type CregisResponse = {
  code: string
  msg: string
  data: {
    cregis_id: string
    checkout_url: string
  }
}

export const cregis = {
  createCheckout: async (payload: Omit<CregisPayload, "sign" | "pid" | "tokens">) => {
    const fullPayload: CregisPayload = {
      ...payload,
      pid: env.CREJIS_PROJECT_ID,
      tokens: env.CREJIS_TOKENS,
    }

    const signedPayload = generateSignature(fullPayload, env.CREJIS_API_SECRET)

    const response = await axios.post<CregisResponse>(
      `${env.CREJIS_PAYMENT_URL}api/v2/checkout`,
      signedPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  },
}
