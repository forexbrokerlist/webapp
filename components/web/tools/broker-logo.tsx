import Image from "next/image";
import type { ComponentProps } from "react";
import { getPresignedUrlFromFull } from "~/lib/media";
import type { Brokers } from "~/.generated/prisma/client";

type BrokerLogoProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  broker: Brokers;
  size?: number;
  fallbackDomain?: string;
};

export const BrokerLogo = async ({
  broker,
  size = 64,
  fallbackDomain,
  className,
  ...props
}: BrokerLogoProps) => {
  // Process logo URL on server side
  const processedLogoUrl = broker.logoUrl ? await getPresignedUrlFromFull(broker.logoUrl) : null;

  // Fallback to Google favicon if no logo URL
  let domain = fallbackDomain || "forex.com";
  const targetUrl = broker.broker_website || broker.url;
  try {
    if (targetUrl) {
      const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      domain = urlObj.hostname;
    }
  } catch (e) {
    // Ignore, fallback to default domain
  }

  const finalSrc = processedLogoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

  return (
    <Image
      src={finalSrc}
      alt={`${broker.broker_name || "Broker"} logo`}
      width={size}
      height={size}
      className={`rounded-[0.375em] mix-blend-multiply dark:mix-blend-normal ${className || ""}`}
      {...props}
    />
  );
};
