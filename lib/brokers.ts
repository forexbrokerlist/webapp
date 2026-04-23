import { getPresignedUrlFromFull } from "~/lib/media"

/**
 * Resolves a broker's logo URL with multiple fallbacks.
 * 
 * @param broker - The broker object containing logoUrl, broker_website, url, and screenshotUrl.
 * @returns A promise that resolves to the logo URL string.
 */
export const getBrokerLogo = async (broker: {
  logoUrl?: string | null
  broker_website?: string | null
  url?: string | null
  screenshotUrl?: string | null
}) => {
  // 1. Prioritize the high-quality logo stored in our database
  if (broker.logoUrl) {
    return (await getPresignedUrlFromFull(broker.logoUrl)) as string
  }

  let domain = "forex.com"
  const targetUrl = broker.broker_website || broker.url
  try {
    if (targetUrl) {
      const urlObj = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`)
      domain = urlObj.hostname
    }
  } catch (e) { }

  // 2. Fallback to Google Favicon API
  if (domain && domain !== "forex.com") {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }

  // 3. Last resort: screenshot or default placeholder
  if (broker.screenshotUrl) {
    return (await getPresignedUrlFromFull(broker.screenshotUrl)) as string
  }

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}
