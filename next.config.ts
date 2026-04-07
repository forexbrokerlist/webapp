import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// import { withPlausibleProxy } from "next-plausible"

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");
// const withPlausible = withPlausibleProxy({ customDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_URL })

const nextConfig: NextConfig = {
  typedRoutes: true,
  allowedDevOrigins: [
    "https://prone-inceptively-jonah.ngrok-free.dev"
  ],
  cacheLife: {
    infinite: {
      stale: Number.POSITIVE_INFINITY,
      revalidate: Number.POSITIVE_INFINITY,
      expire: Number.POSITIVE_INFINITY,
    },
  },

  experimental: {
    useCache: true,
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  images: {
    unoptimized: true,
    remotePatterns: (function () {
      const { S3_PUBLIC_URL, S3_BUCKET, S3_REGION } = process.env;
      // Handle empty string or undefined values
      const publicUrl =
        S3_PUBLIC_URL && S3_PUBLIC_URL.trim() !== ""
          ? S3_PUBLIC_URL
          : S3_BUCKET && S3_REGION
            ? `https://${S3_BUCKET}.${S3_REGION}.digitaloceanspaces.com`
            : undefined;

      if (!publicUrl) {
        return [];
      }

      const url = new URL(publicUrl);

      return [
        {
          protocol: "https" as const,
          hostname: url.hostname,
          port: "",
          pathname: "/**",
        },
      ];
    })(),
  },

  // ✅ ADD THIS (fix CORS by unifying domain)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.forexbrokerlist.io",
          },
        ],
        destination: "https://forexbrokerlist.io/:path*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/sitemap/:id.xml",
        destination: "/sitemap/:id",
      },
    ];
  },
};

export default withContentCollections(withNextIntl(nextConfig));
// export default withContentCollections(withNextIntl(withPlausible(nextConfig)))
