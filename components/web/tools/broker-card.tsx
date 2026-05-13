"use client";

import React from "react";
import { Crown, Star, ArrowUpRight } from "lucide-react";
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
  logoUrl?: string;
};

// --- Helpers ---

const getBrokerRoute = (slug: string, categorySlug?: string, categories?: { slug: string }[]): string => {
  const effectiveCategorySlug = categorySlug || categories?.[0]?.slug;
  if (effectiveCategorySlug === 'trusted-trading-platforms' || effectiveCategorySlug === 'forex-brokers') {
    return `/forex-broker/${slug}`;
  }
  return effectiveCategorySlug ? `/${effectiveCategorySlug}/${slug}` : `/brokers/${slug}`;
};

const formatRating = (rating: string | null) => rating?.split("/")[0]?.trim() || "0.0";

const formatMinDeposit = (deposit: string | null) => deposit?.replace(/\s*\(.*?\)/g, '') || "Varies";

const isPlatformMT4orMT5 = (platform: string) => {
  const p = platform.trim().toLowerCase().replace(/\s+/g, '');
  return ['mt4', 'mt5', 'metatrader4', 'metatrader5'].includes(p);
};

// --- Sub-components ---

const StatGrid = ({ items }: { items: { label: string; value: string | number | null | undefined }[] }) => {
  const filtered = items.filter(item => item.value != null && item.value !== '' && item.value !== '—');
  if (filtered.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      {filtered.map((item, i) => (
        <div key={i} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F4ED] border border-[#E1E0D3] text-[12px] min-w-0">
          <span className="text-muted-foreground font-medium shrink-0">{item.label}</span>
          <span className="font-medium text-black100 truncate">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatusBadge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'primary' | 'secondary' }) => {
  const variants = {
    default: "bg-[#EAF3DE] border-[#C8D1BC] text-[#27500A]",
    primary: "bg-[#E3F2FD] border-[#BBDEFB] text-[#0D47A1]",
    secondary: "bg-[#F3E5F5] border-[#E1BEE7] text-[#4A148C]"
  };
  return (
    <div className={`px-3 py-1.5 rounded-lg border-[0.5px] text-[12px] font-bold ${variants[variant]}`}>
      {children}
    </div>
  );
};

// --- Category Renderers ---

const renderEducationContent = (broker: Brokers) => {
  const skillLevel = broker.skill_level && broker.skill_level.length > 1
    ? `${broker.skill_level[0]}-${broker.skill_level[broker.skill_level.length - 1]}`
    : broker.skill_level?.join(', ');

  const stats = [
    { label: "Level", value: skillLevel },
    { label: "Format", value: broker.learning_format?.join(' + ') },
    { label: "Founded", value: broker.year_established },
    { label: "HQ", value: broker.headquarters },
  ];

  return (
    <>
      <StatGrid items={stats} />
      <div className="flex flex-wrap gap-2 pt-4">
        {broker.free_trial_available && <StatusBadge>Free trial</StatusBadge>}
        {broker.certificate_available && <StatusBadge>Certificate</StatusBadge>}
        {broker.community_access && <StatusBadge>Community</StatusBadge>}
        {broker.mentorship_available && <StatusBadge>1-on-1 mentor</StatusBadge>}
        {broker.trading_platforms && (
          <StatusBadge>{broker.trading_platforms.split(',')[0]}</StatusBadge>
        )}
      </div>
    </>
  );
};

const renderBridgeContent = (broker: Brokers) => {
  const stats = [
    { label: "Type", value: broker.solution_type },
    { label: "Est.", value: broker.year_established },
    { label: "HQ", value: broker.headquarters },
    { label: "Clients", value: broker.target_clients?.join(' / ') },
  ];

  const platforms = broker.trading_platforms?.split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .slice(0, 3) || [];

  const hasRiskAnalytics = broker.solution_type?.toLowerCase().includes('risk');
  const hasBadges = platforms.length > 0 || hasRiskAnalytics || broker.white_label;

  return (
    <>
      <StatGrid items={stats} />
      {hasBadges && (
        <div className="flex flex-wrap gap-2 pt-4">
          {platforms.map((platform, i) => (
            <StatusBadge key={i}>{platform}</StatusBadge>
          ))}
          {hasRiskAnalytics && (
            <StatusBadge>Risk Analytics</StatusBadge>
          )}
          {broker.white_label && <StatusBadge>White label</StatusBadge>}
        </div>
      )}
    </>

  );
};

const renderPSPContent = (broker: Brokers) => {
  const est = broker.year_established ? Math.round(broker.year_established) : null;
  const settlement = broker.settlement_time;

  // Build badges from specific PSP fields
  const badges: { label: string; variant: 'primary' | 'default' }[] = [];
  if (broker.company_type) badges.push({ label: broker.company_type, variant: 'primary' });
  if (broker.api_access) badges.push({ label: 'API', variant: 'primary' });
  if (broker.auto_fiat_conversion) badges.push({ label: 'Auto fiat', variant: 'default' });
  if (broker.supported_cryptos) badges.push({ label: broker.supported_cryptos, variant: 'default' });
  if (broker.integration_type?.length) {
    broker.integration_type.forEach(t => badges.push({ label: t, variant: 'default' }));
  }
  if (broker.white_label) badges.push({ label: 'White label', variant: 'default' });
  if (broker.mass_payout) badges.push({ label: 'Mass payout', variant: 'default' });

  const stats = [
   
    { label: "Est.", value: est },
    { label: "Settlement", value: settlement },
  
  ];

  return (
    <>
      <StatGrid items={stats} />
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {badges.slice(0, 5).map((badge, i) => (
            <StatusBadge key={i}>{badge.label}</StatusBadge>
          ))}
        </div>
      )}
    </>
  );
};
const renderLiquidityProviderContent = (broker: Brokers) => {
  const stats = [
    { label: "Type", value: broker.execution_types },
    { label: "Platforms", value: broker.trading_platforms },
    { label: "Assets", value: broker.asset_classes?.join(', ') },
    { label: "HQ", value: broker.headquarters },
    
   
  ];

  // Build badges from platform-specific fields
  const badges: string[] = [];
  
   if (broker.regulators?.length) {
    badges.push(...broker.regulators.split(',').map(r => r.trim()).filter(r => r.length > 0));
  }
  const hasBadges = badges.length > 0;

  return (
    <>
      <StatGrid items={stats} />
      {hasBadges && (
        <div className="flex flex-wrap gap-2 pt-4">
          {badges.slice(0, 5).map((badge, i) => (
            <StatusBadge key={i}>{badge}</StatusBadge>
          ))}
        </div>
      )}
    </>
  );
};
const renderAlgoProviderContent = (broker: Brokers) => {
  const stats = [
    { label: "Type", value: broker.bot_type?.replace(/\s*\(.*?\)/g, '') },
    { label: "Platforms", value: broker.trading_platforms?.replace(/\s*\(.*?\)/g, '') },
    { label: "Founded", value: broker.year_established },
    { label: "HQ", value: broker.headquarters },
    
   
  ];

  // Build badges from platform-specific fields
  const badges: string[] = [];
  
  //  if (broker.regulators?.length) {
  //   badges.push(...broker.regulators.split(',').map(r => r.trim()).filter(r => r.length > 0));
  // }
  if(broker.nfa_fifo) badges.push("NFA/FIFO");
  if(broker.automation_level) badges.push(broker.automation_level);
  if(broker.verified_performance) badges.push(broker.verified_performance?.replace(/\s*\(.*?\)/g, '')+" Verified");
  if(broker.win_rate) badges.push(broker.win_rate?.replace(/\s*\(.*?\)/g, '')+" Win Rate");

  const hasBadges = badges.length > 0;

  return (
    <>
      <StatGrid items={stats} />
      {hasBadges && (
        <div className="flex flex-wrap gap-2 pt-4">
          {badges.slice(0, 5).map((badge, i) => (
            <StatusBadge key={i}>{badge}</StatusBadge>
          ))}
        </div>
      )}
    </>
  );
};
const renderTradingPlatformContent = (broker: Brokers) => {
  const hasPropFirm = broker.prop_firm_support && broker.prop_firm_support.length > 0;
  const bestForValue = broker.bestFor && broker.bestFor.length > 0 ? broker.bestFor.join(', ') : null;

  const stats = [
    { label: "HQ", value: broker.headquarters },
    { label: "Founded", value: broker.year_established ? Math.round(broker.year_established) : null },
    { label: "Type", value: broker.platform_type?.join(' / ') },
    { label: "Prop Firm", value: hasPropFirm ? "Yes" : broker.white_label_price },
    { label: "Deployment", value: broker.deployment_type?.join(', ') },
    ...(bestForValue
      ? [{ label: "Best For", value: bestForValue }]
      : broker.setup_time ? [{ label: "Setup Time", value: broker.setup_time }] : []
    ),
  ];

  // Build badges from platform-specific fields
  const badges: string[] = [];
  if (broker.features?.length) {
    badges.push(...broker.features.filter(f => f.trim().length > 0));
  }
  if (broker.charting_tools?.length) {
    broker.charting_tools.forEach(t => badges.push(t));
  }
  if (broker.mt5_backend) badges.push('MT5 Backend');
  if (broker.hosting_included) badges.push('Hosting Included');
  if (!broker.yearly_commitment) badges.push('No Yearly Lock-in');
  if (broker.demoAccount) badges.push('Demo Available');

  const hasBadges = badges.length > 0;

  return (
    <>
      <StatGrid items={stats} />
      {hasBadges && (
        <div className="flex flex-wrap gap-2 pt-4">
          {badges.slice(0, 5).map((badge, i) => (
            <StatusBadge key={i}>{badge}</StatusBadge>
          ))}
        </div>
      )}
    </>
  );
};

const renderDefaultContent = (broker: Brokers) => {
  const platforms = broker.trading_platforms?.split(',') || [];
  const platformsPreview = platforms.slice(0, 4).join(', ') + (platforms.length > 4 ? "..." : "");

  const stats = [
    { label: "Spread", value: broker.minimum_raw_spreads || broker.minimum_standard_spreads },
    { label: "Leverage", value: broker.maxLeverage },
    { label: "Regs", value: broker.regulators ? broker.regulators.split(',').length : null },
    { label: "Platform", value: broker.trading_platforms ? platformsPreview : null },
  ];

  return (
    <>
      <StatGrid items={stats} />
      <div className="flex flex-wrap gap-2 pt-4">
        {broker.availableInIndia && <StatusBadge>India</StatusBadge>}
        {broker.islamicAccount && <StatusBadge>Islamic</StatusBadge>}
        {broker.copyTrading && <StatusBadge>Copy Trading</StatusBadge>}
      </div>
    </>
  );
};

// --- Main Component ---

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

  const brokerRoute = getBrokerRoute(broker.slug || '', categorySlug, (broker as any).categories);
  const title = broker.broker_name || "UNKNOWN BROKER";
  const description = broker.subtitle || broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'}`;

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
        <Favicon src={logoUrl} size={24} className="object-contain w-12 h-12" contained />

        <Stack direction="column" size="xs" className="truncate">
          <H4 as="h3" className="truncate flex items-center justify-center gap-3">
            <Link href={brokerRoute}>
              <span className="absolute inset-0 z-40 rounded-lg" />
              {title}
            </Link>
            <VerifiedBadge size="md" className="mb-0.5 shrink-0" />
          </H4>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-[12px] font-medium text-black100 uppercase tracking-wider">
              {formatRating(broker.overall_rating)} Rating
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
        <Stack size="lg" direction="column" className="flex-1 duration-200 relative z-10">
          <CardDescription className="line-clamp-2 text-base">
            {description}
          </CardDescription>

          <div className="flex flex-col gap-2 mt-4">
            {categorySlug === "forex-trading-courses"
              ? renderEducationContent(broker)
              : categorySlug === "forex-bridge-providers"
                ? renderBridgeContent(broker)
                : categorySlug === "forex-psp-partners"
                  ? renderPSPContent(broker)
                  : categorySlug === "forex-trading-platform"
                    ? renderTradingPlatformContent(broker)
                    : categorySlug === "liquidity-providers"
                      ? renderLiquidityProviderContent(broker)
                      : categorySlug === "algo-trading"
                        ? renderAlgoProviderContent(broker)
                        : renderDefaultContent(broker)
            }
          </div>

          <div className="mt-auto self-stretch -mx-5 px-5 pt-4 border-t border-black100/15">
            <div className="flex items-center justify-between text-base uppercase font-medium text-black100">
              {broker.minimum_deposit ? (
                <div className="flex items-center gap-2">
                  <span>Min Deposit:</span>
                  <Badge variant="outline" className="gap-1 border-none px-2 py-0.5 text-base text-foreground bg-[#F2F4F7]">
                    {formatMinDeposit(broker.minimum_deposit)}
                  </Badge>
                </div>
              ) : <div />}

              <Link
                href={brokerRoute}
                className="flex items-center gap-1.5 text-black100 hover:text-primary transition-colors no-underline"
              >
                <span className="text-sm font-semibold normal-case">Read Details</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </Stack>
      </div>
    </Card>
  );
};
