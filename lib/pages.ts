import type { Metadata } from "next";
import type { Thing } from "schema-dts";
import { metadataConfig } from "~/config/metadata";
import { getOpenGraphImageUrl, type OpenGraphParams } from "~/lib/opengraph";
import {
  createGraph,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data";

type DataOptions = {
  metadata?: Metadata;
  breadcrumbs?: { url: string; title: string }[];
  structuredData?: Thing[];
};

/**
 * Creates page metadata, breadcrumbs, and structured data for a page
 * @param url - The URL of the page
 * @param title - The title of the page
 * @param description - The description of the page
 * @param options - Optional metadata, breadcrumbs, and structured data
 */
export const getPageData = (
  url: string,
  title: string,
  description: string,
  options?: DataOptions,
) => {
  const metadata = { ...options?.metadata, title, description };
  const breadcrumbs = options?.breadcrumbs ?? [];

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateWebPage(url, title, description),
    generateBreadcrumbs(options?.breadcrumbs ?? []),
    ...(options?.structuredData ?? []),
  ]);

  return { url, metadata, breadcrumbs, structuredData };
};

type GetPageMetadataProps = {
  url: string;
  ogImage?: OpenGraphParams;
  metadata?: Metadata;
};

// Page-specific OG image mappings
const pageOgImages: Record<string, string> = {
  "/about": "/assets/About Us.webp",
  "/blog": "/assets/Blog.webp",
  "/brokers": "/assets/Compare the Best Forex Brokers.webp",
  "/contact": "/assets/Contact Us.webp",
  "/contact-us": "/assets/Contact Us.webp",
  "/privacy": "/assets/Privacy Policy.webp",
  "/terms": "/assets/Terms of Service.webp",
  "/cookies": "/assets/cookies.webp",
  "/disclaimer": "/assets/disclaimer.webp",
};

/**
 * Get the metadata for a page
 * @param url - The URL of the page
 * @param title - The title of the page
 * @param description - The description of the page
 * @param metadata - The metadata for the page
 */
export const getPageMetadata = ({
  url,
  ogImage,
  metadata,
}: GetPageMetadataProps) => {
  const defaultMetadata = Object.assign({}, metadataConfig, metadata);
  const { title, description, alternates, openGraph, ...rest } =
    defaultMetadata;

  // Use static OG image if mapped, otherwise use dynamic generator
  const staticOgImage = pageOgImages[url];
  const ogImageUrl =
    staticOgImage ||
    getOpenGraphImageUrl(ogImage ?? { title: String(title), description });

  return {
    title,
    description,
    alternates: { ...alternates, canonical: url },
    openGraph: {
      ...openGraph,
      url,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    ...rest,
  };
};
