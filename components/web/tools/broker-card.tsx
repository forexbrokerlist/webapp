"use client";

import React from "react";
import { Crown, Star, ShieldCheck, CalendarRange, ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "~/components/common/badge";
import { Card, CardDescription, CardHeader } from "~/components/common/card";
import { H4 } from "~/components/common/heading";
import { Link } from "~/components/common/link";
import { Stack } from "~/components/common/stack";
import { Favicon } from "~/components/web/ui/favicon";
import { VerifiedBadge } from "~/components/web/verified-badge";
import type { Brokers } from "~/.generated/prisma/client";
import Image from "next/image";

type BrokerCardProps = ComponentProps<typeof Card> & {
  broker: Brokers;
  categorySlug?: string;
  logoUrl?: string;
};

// Category-specific routing mapping
const getBrokerRoute = (slug: string, categorySlug?: string, categories?: { slug: string }[]): string => {
  const effectiveCategorySlug = categorySlug || categories?.[0]?.slug;
  if (effectiveCategorySlug === 'trusted-trading-platforms' || effectiveCategorySlug === 'forex-brokers') {
    return `/forex-broker/${slug}`;
  }
  return effectiveCategorySlug ? `/${effectiveCategorySlug}/${slug}` : `/brokers/${slug}`;
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
  logoUrl,
  className,
  ...props
}: BrokerCardProps) => {
  // Try to use a clean URL for favicon fetch
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
      className={`items-stretch select-none transition-all !border-[#A8DD15] rounded-xl relative card-green-shadow duration-300 ${broker.isSponsor
        ? "bg-white border border-solid border-[#A8DD15]"
        : "hover:border-primary/20"
        } ${className || ""}`}
      {...props}
    >
      <CardHeader wrap={false} className="pr-8 mb-1">
        <Favicon src={logoUrl} size={24} className=" object-contain   w-12 h-12" contained />


        <Stack direction="column" size="xs" className="truncate">
          <H4 as="h3" className="truncate flex items-center justify-center gap-3">
            <Link href={getBrokerRoute(broker.slug || '', categorySlug, (broker as any).categories)}>
              <span className="absolute inset-0 z-40 rounded-lg" />
              {broker.broker_name || "UNKNOWN BROKER"}
            </Link>
            <VerifiedBadge size="md" className=" mb-0.5 shrink-0" />
          </H4>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-[12px] font-medium text-black100 uppercase tracking-wider">
              {broker.overall_rating?.split("/")[0]?.trim() || "0.0"} Rating
            </span>
          </div>
        </Stack>



        {broker.isSponsor && (
          <div className="absolute right-3 top-3.5 flex items-center gap-1.5 z-60 bg-white/50 text-muted-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#A8DD15] backdrop-blur-sm">
            <Crown className="size-3" strokeWidth={2} />
            <span>Sponsor</span>
          </div>
        )}
      </CardHeader>

      <div className="relative size-full flex flex-col">
        {/* Default State */}
        <Stack size="lg" direction="column" className="flex-1 duration-200  relative z-10">
          <CardDescription className="line-clamp-2  text-base">
            {broker.subtitle || broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'}`}
          </CardDescription>

          <div className="flex flex-col gap-2 mt-4">
            {categorySlug === "forex-trading-courses" ? (
              <>
                {/* Education Badges Row 1 */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { 
                      label: "Level", 
                      value: broker.skill_level && broker.skill_level.length > 1 
                        ? `${broker.skill_level[0]}-${broker.skill_level[broker.skill_level.length - 1]}` 
                        : broker.skill_level?.join(', ') 
                    },
                    { label: "Format", value: broker.learning_format?.join(' + ') },
                    { label: "Founded", value: broker.year_established },
                    { label: "HQ", value: broker.headquarters },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F4ED] border border-[#E1E0D3] text-[12px]">
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                      <span className="font-medium text-black100">{item.value || "-"}</span>
                    </div>
                  ))}
                </div>

                {/* Education Status Badges Row 2 */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {broker.free_trial_available && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      Free trial
                    </div>
                  )}
                  {broker.certificate_available && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      Certificate
                    </div>
                  )}
                  {broker.community_access && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      Community
                    </div>
                  )}
                  {broker.mentorship_available && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      1-on-1 mentor
                    </div>
                  )}
                  {broker.trading_platforms && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      {broker.trading_platforms.split(',')[0]}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Spread", value: broker.minimum_raw_spreads || broker.minimum_standard_spreads },
                    { label: "Leverage", value: broker.maxLeverage },
                    { label: "Regs", value: broker.regulators ? broker.regulators.split(',').length : null },
                    {
                      label: "Platform", value: broker.trading_platforms ? (() => {
                        const platforms = broker.trading_platforms.split(',');
                        return platforms.slice(0, 4).join(', ') + (platforms.length > 4 ? "..." : "");
                      })() : null
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F4ED] border border-[#E1E0D3] text-[12px]">
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                      <span className="font-medium text-black100">{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                  {broker.availableInIndia && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      India
                    </div>
                  )}
                  {broker.islamicAccount && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      Islamic
                    </div>
                  )}
                  {broker.copyTrading && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#EAF3DE] border-[0.5px] border-[#C8D1BC] text-[12px] font-bold text-[#27500A]">
                      Copy Trading
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-auto self-stretch -mx-5 px-5 pt-4 border-t border-black100/15">
            <div className="flex items-center justify-between text-base uppercase font-medium text-black100">
              <div className="flex items-center gap-2">
                <span>Min Deposit:</span>
                <Badge variant="outline" className="gap-1 border-none px-2 py-0.5 text-base text-foreground bg-[#F2F4F7]">
                  {broker.minimum_deposit?.replace(/\s*\(.*?\)/g, '') || "Varies"}
                </Badge>
              </div>
              
              <Link 
                href={getBrokerRoute(broker.slug || '', categorySlug, (broker as any).categories)}
                className="flex items-center gap-1.5 text-black100 hover:text-primary transition-colors no-underline"
              >
                <span className="text-sm font-semibold normal-case">Read Details</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </Stack>

        {/* Hover State */}
        {/* <div className="absolute inset-0 opacity-0 duration-200 group-hover:opacity-100 flex flex-col z-20 pointer-events-none">
          <CardDescription className="line-clamp-2 text-base">
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
        </div> */}
      </div>
    </Card>
  );
};
