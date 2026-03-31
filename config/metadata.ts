import type { Metadata } from "next";
import { linksConfig } from "~/config/links";
import { siteConfig } from "~/config/site";
import { getOpenGraphImageUrl } from "~/lib/opengraph";

export const metadataConfig: Metadata = {
  title: siteConfig.name,
  description:
    "Compare the best forex brokers with our comprehensive directory. Find regulated brokers, read reviews, and make informed trading decisions.",
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Forex Brokers Listing" }],
  openGraph: {
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    title: siteConfig.name,
    description:
      "Compare the best forex brokers with our comprehensive directory. Find regulated brokers, read reviews, and make informed trading decisions.",
    images: { url: getOpenGraphImageUrl({}), width: 1200, height: 630 },
  },
  twitter: {
    site: "@forexbrokerslisting",
    creator: "@piotrkulpinski",
    card: "summary_large_image",
    title: siteConfig.name,
    description:
      "Compare the best forex brokers with our comprehensive directory. Find regulated brokers, read reviews, and make informed trading decisions.",
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": linksConfig.feed },
  },
};
