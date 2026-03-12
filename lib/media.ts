import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getDomain, getErrorMessage, tryCatch } from "@primoui/utils"
import { fileTypeFromBuffer } from "file-type"
import wretch from "wretch"
import { env, isProd } from "~/env"
import { s3Client } from "~/services/s3"

/**
 * Uploads a file to Digital Ocean Spaces (S3-compatible) and returns the file location.
 * @param file - The file to upload.
 * @param key - The Spaces key to upload the file to (without extension)
 * @returns The Spaces URL of the uploaded file.
 */
export const uploadToS3Storage = async (file: Buffer, key: string) => {
  const endpoint = env.S3_PUBLIC_URL ?? `https://${env.S3_BUCKET}.${env.S3_REGION}.digitaloceanspaces.com`
  const fileType = await fileTypeFromBuffer(file)
  const s3Key = `${key}.${fileType?.ext ?? "png"}`

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.S3_BUCKET,
      Key: s3Key,
      Body: file,
      StorageClass: "STANDARD",
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false,
  })

  const { data, error } = await tryCatch(upload.done())

  if (error) {
    throw new Error(`Failed to upload ${key} to Digital Ocean Spaces: ${getErrorMessage(error)}`)
  }

  if (!data.Key) {
    throw new Error(`Failed to upload ${key} to Digital Ocean Spaces`)
  }

  return `${endpoint}/${data.Key}?v=${Date.now()}`
}

/**
 * Removes a list of directories from Digital Ocean Spaces.
 * @param directories - The directories to remove.
 */
export const removeS3Directories = async (directories: string[]) => {
  for (const directory of directories) {
    await removeS3Directory(directory)
  }
}

/**
 * Removes a directory from Digital Ocean Spaces.
 * @param directory - The directory to remove.
 */
export const removeS3Directory = async (directory: string) => {
  // Safety flag to prevent accidental deletion of Spaces files
  if (!isProd) return

  const listCommand = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET,
    Prefix: `${directory}/`,
  })

  let continuationToken: string | undefined

  do {
    const listResponse = await s3Client.send(listCommand)
    for (const object of listResponse.Contents || []) {
      if (object.Key) {
        await removeS3File(object.Key)
      }
    }
    continuationToken = listResponse.NextContinuationToken
    listCommand.input.ContinuationToken = continuationToken
  } while (continuationToken)
}

/**
 * Removes a file from Digital Ocean Spaces.
 * @param key - The Spaces key of the file to remove.
 */
export const removeS3File = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  })

  return await s3Client.send(deleteCommand)
}

/**
 * Generates a presigned URL for a Digital Ocean Spaces file.
 * @param key - The Spaces key (path) of the file.
 * @param expiresIn - Expiration time in seconds (default is 1 hour).
 * @returns The presigned URL.
 */
export const getPresignedUrl = async (key: string, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  })

  // @ts-expect-error - Type mismatch between different versions of AWS SDK packages
  return await getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Extracts the S3 key from a full URL and returns a presigned URL.
 * Defaults to returning the original URL if parsing fails or URL is not from Spaces.
 * @param url - The full URL of the file.
 * @param expiresIn - Expiration time in seconds (default is 1 hour).
 * @returns The presigned URL or the original URL.
 */
export const getPresignedUrlFromFull = async (url: string | null | undefined, expiresIn = 3600) => {
  if (!url) return url

  try {
    const spacesDomain = `${env.S3_BUCKET}.${env.S3_REGION}.digitaloceanspaces.com`
    const parsedUrl = new URL(url)
    
    // Check if the URL is from our DO Spaces
    const customPublicUrl = env.S3_PUBLIC_URL ? new URL(env.S3_PUBLIC_URL) : null
    const isSpacesUrl =
      (customPublicUrl && parsedUrl.hostname === customPublicUrl.hostname) ||
      parsedUrl.hostname === spacesDomain ||
      parsedUrl.hostname.includes('digitaloceanspaces.com')

    if (!isSpacesUrl) {
      return url
    }

    // Extract key from pathname (removing leading slash)
    let key = parsedUrl.pathname.substring(1)
    
    if (key.startsWith(`${env.S3_BUCKET}/`)) {
      key = key.substring(env.S3_BUCKET.length + 1)
    }

    return await getPresignedUrl(decodeURIComponent(key), expiresIn)
  } catch (err) {
    console.error("Failed to generate presigned URL from:", url, err)
    return url
  }
}

/**
 * Gets the URL of the favicon API endpoint.
 * @param url - The URL of the website to fetch the favicon from.
 * @returns The URL of the favicon API endpoint.
 */
export const getFaviconFetchUrl = (url: string) => {
  const options = new URLSearchParams({
    domain_url: getDomain(url),
    sz: "128",
  })

  return `https://www.google.com/s2/favicons?${options.toString()}`
}

/**
 * Gets the URL of the screenshot API endpoint.
 * @param url - The URL of the website to fetch the screenshot from.
 * @returns The URL of the screenshot API endpoint.
 */
export const getScreenshotFetchUrl = (url: string) => {
  const params = new URLSearchParams({
    url,
    access_key: env.SCREENSHOTONE_ACCESS_KEY3,
    cache: "true",

    // Blockers
    delay: "1",
    block_ads: "true",
    block_chats: "true",
    block_trackers: "true",
    block_cookie_banners: "true",

    // Image and viewport options
    format: "webp",
    viewport_width: "1280",
    viewport_height: "720",
    image_quality: "90",
  })

  return `https://api.screenshotone.com/take?${params.toString()}`
}

/**
 * Fetches media (favicon or screenshot) from a URL and uploads it to Digital Ocean Spaces.
 * @param url - The website URL to fetch media from.
 * @param path - The Spaces key path (without extension).
 * @param type - The type of media to fetch ("favicon" or "screenshot").
 * @returns The Spaces URL of the uploaded file, or null on failure.
 */
export const fetchAndUploadMedia = async (
  url: string,
  path: string,
  type: "favicon" | "screenshot",
) => {
  const endpoint = type === "favicon" ? getFaviconFetchUrl(url) : getScreenshotFetchUrl(url)
  console.log("🚀 ~ fetchAndUploadMedia ~ endpoint:", endpoint)
  const { data, error } = await tryCatch(wretch(endpoint).get().arrayBuffer().then(Buffer.from))
  console.log("🚀 ~ fetchAndUploadMedia ~ data:", data)

  if (error) {
    throw new Error(`Failed to fetch ${type} from ${url}: ${getErrorMessage(error)}`)
  }

  return uploadToS3Storage(data, path)
}
