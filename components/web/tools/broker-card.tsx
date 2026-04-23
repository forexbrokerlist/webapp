"use client";

import React from "react";
import { Crown, Star, ShieldCheck, CalendarRange } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "~/components/common/badge";
import { Card, CardDescription, CardHeader } from "~/components/common/card";
import { H4 } from "~/components/common/heading";
import { Link } from "~/components/common/link";
import { Stack } from "~/components/common/stack";
import { Favicon } from "~/components/web/ui/favicon";
import { VerifiedBadge } from "~/components/web/verified-badge";
import type { Brokers } from "~/.generated/prisma/client";

type BrokerCardProps = ComponentProps<typeof Card> & {
  broker: Brokers;
  categorySlug?: string;
};

// Category-specific routing mapping
const getBrokerRoute = (slug: string, categorySlug?: string): string => {
  const categoryRoutes: Record<string, string> = {
    'algorithmic-trading-and-bot-providers': `/bot-providers/${slug}`,
    'forex-brokers': `/broker/${slug}`,
    'crypto-exchanges': `/crypto-exchanges/${slug}`,
    'stock-brokers': `/stock-brokers/${slug}`,
    'commodity-brokers': `/commodity-brokers/${slug}`,
    'cfd-brokers': `/cfd-brokers/${slug}`,
    'binary-options': `/binary-options/${slug}`,
    'spread-betting': `/spread-betting/${slug}`,
    'social-trading': `/social-trading/${slug}`,
    'copy-trading': `/copy-trading/${slug}`,
    'liquidity-partners': `/liquidity/${slug}`,
    'trusted-trading-platforms':`/broker/${slug}`,
    'crm-and-back-office-software':`/crm/${slug}`,
    'forex-education-and-training':`/forex-education/${slug}`,
    'forex-trading-courses': `/forex-trading-courses/${slug}`,
    'bridge-and-plug-in-partners':`/forex-bridge/${slug}`,
    'psp-partners':`/psp/${slug}`, 
    'trading-platform-partners':`/trading/${slug}`
  };

  return categoryRoutes[categorySlug || ''] || (categorySlug ? `/${categorySlug}/${slug}` : `/brokers/${slug}`);
};

// Get external redirect URL based on category
const getBrokerRedirectUrl = (broker: Brokers, categorySlug?: string): string => {
  const targetUrl = broker.broker_website || broker.url;
  if (!targetUrl) return '#';

  // Ensure URL has proper protocol
  return targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
};

export const BrokerCard = ({
  broker,
  categorySlug,
  className,
  ...props
}: BrokerCardProps) => {
  // Try to use a clean URL for the favicon fetch
  let domain = "forex.com";
  const targetUrl = broker.broker_website || broker.url;
  try {
    if (targetUrl) {
      const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      domain = urlObj.hostname;
    }
  } catch (e) {
    // Ignore, fallback to forex.com
  }

  return (
    <Card
      isRevealed
      className={`items-stretch select-none transition-all duration-300 ${broker.isSponsor
        ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-linear-to-br from-blue-500/10 via-background to-background ring-1 ring-blue-500/20 hover:border-blue-500/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"
        : "hover:border-primary/20"
        } ${className || ""}`}
      {...props}
    >
      <CardHeader wrap={false} className="pr-8 mb-1">
        <Favicon src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} title={broker.broker_name || "Broker"} contained />

        <H4 as="h3" className="truncate">
          <Link href={getBrokerRoute(broker.slug || '', categorySlug)}>
            <span className="absolute inset-0 z-40 rounded-lg" />
            {broker.broker_name || "UNKNOWN BROKER"}
          </Link>
        </H4>

        <VerifiedBadge size="md" className="-ml-1.5 shrink-0" />

        {broker.isSponsor && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 z-60 bg-blue-500/10 text-blue-500 pl-1.5 pr-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/30 backdrop-blur-md shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Crown className="size-[12px]" strokeWidth={2.5} />
            <span>Sponsor</span>
          </div>
        )}
      </CardHeader>

      <div className="relative size-full flex flex-col">
        {/* Default State */}
        <Stack size="lg" direction="column" className="flex-1 duration-200 group-hover:opacity-0 relative z-10">
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {broker.subtitle || broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'} offering competitive spreads.`}
          </CardDescription>

          <Stack size="sm" className="mt-auto pt-4 text-xs font-medium text-muted-foreground items-center">
            <span>Min Deposit:</span>
            <Badge variant="outline" className="gap-1 px-2 py-0.5 text-foreground bg-muted/20">
              {broker.minimum_deposit || "Varies"}
            </Badge>
          </Stack>
        </Stack>

        {/* Hover State */}
        <div className="absolute inset-0 opacity-0 duration-200 group-hover:opacity-100 flex flex-col z-20 pointer-events-none">
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {broker.subtitle || broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'} offering competitive spreads.`}
          </CardDescription>

          <div className="mt-auto pt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col gap-1 items-start">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="size-3.5" /> Score
              </span>
              <span className="font-semibold text-foreground text-sm">{broker.overall_rating?.split("/")[0]?.trim() || "N/A"}</span>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Regs
              </span>
              <span className="font-semibold text-foreground text-sm truncate w-full" title={broker.regulators || ""}>
                {broker.regulators ? broker.regulators.split(',').length : 0}
              </span>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarRange className="size-3.5" /> Est.
              </span>
              <span className="font-semibold text-foreground text-sm">{broker.year_established || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
