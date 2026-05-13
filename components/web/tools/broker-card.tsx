"use client";

import React from "react";
import { Crown, Star, ArrowUpRight, Check, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "~/components/common/badge";
import { Card, CardDescription, CardHeader } from "~/components/common/card";
import { H4 } from "~/components/common/heading";
import { Link } from "~/components/common/link";
import { Stack } from "~/components/common/stack";
import { Favicon } from "~/components/web/ui/favicon";
import { VerifiedBadge } from "~/components/web/verified-badge";
import type { Brokers } from "~/.generated/prisma/client";
const RegulationImage = "/assets/images/Regulations.svg"
const PlatformImage = "/assets/images/Platform.svg"
const LanguageImage = "/assets/images/Language.svg"
const LiquidityImage = "/assets/images/liquidity_sources.svg"
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

const StarIcon = ({ fillPercentage }: { fillPercentage: number }) => (
  <div className="relative inline-block w-3.5 h-3.5 shrink-0">
    {/* Empty Star (Gray) */}
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#E2E8F0"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0"
    >
      <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
    </svg>
    {/* Filled Star (Yellow) clipped by width */}
    <div
      className="absolute top-0 left-0 overflow-hidden h-full"
      style={{ width: `${fillPercentage}%` }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="#FBA100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
      </svg>
    </div>
  </div>
);

const StatGrid = ({ items, largeSuffix = false }: { items: { label: string; value: string | number | null | undefined }[], largeSuffix?: boolean }) => {
  const filtered = items.filter(item => item.value != null && item.value !== '' && item.value !== '—');
  if (filtered.length === 0) return null;
  return (
    <div className="flex gap-2">
      {filtered.map((item, i) => {
        const val = String(item.value || "");
        const spaceIndex = val.indexOf(" ");
        const mainValue = spaceIndex > -1 ? val.substring(0, spaceIndex) : val;
        let suffix = spaceIndex > -1 ? val.substring(spaceIndex + 1) : "";

        if (suffix.toLowerCase() === "pips") {
          suffix = "Pips Raw";
        }

        suffix = suffix.replace(/\s*\(.*$/, "").trim();

        return (
          <div key={i} className="flex flex-col gap-0.5 pr-6 pl-2.5 py-2 rounded-lg bg-[#F5F4ED] border border-[#E1E0D3] text-[12px] min-w-0 max-w-[110px]">
            <span className="text-muted-foreground font-medium shrink-0 uppercase text-[10px]  ">{item.label}</span>
            <span className="font-medium text-black100 text-[14px] leading-none">{mainValue}</span>
            {suffix && <span className={`text-black100 font-medium ${largeSuffix ? 'text-[14px]' : 'text-[10px]'} leading-tight mt-1`}>{suffix}</span>}
          </div>
        );
      })}
    </div>
  );
};

const StatusBadge = ({
  children,
  isActive,
  variant = 'default'
}: {
  children: React.ReactNode;
  isActive?: boolean;
  variant?: 'default' | 'primary' | 'secondary'
}) => {
  if (isActive !== undefined) {
    const activeClass = "bg-[#EAF3DE] border-[#22C55E]/30 text-[#166534]";
    const inactiveClass = "bg-[#FEF2F2] border-[#EF4444]/30 text-[#991B1B]";

    return (
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[12px] font-medium ${isActive ? activeClass : inactiveClass}`}>
        {isActive ? <Check className="size-3" /> : <X className="size-3" />}
        {children}
      </div>
    );
  }

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
      <StatGrid items={stats} largeSuffix />
       
         {broker.languages_supported && broker.languages_supported.length > 0 && (
          <div className="flex items-center mt-4 gap-2 text-[13px] leading-tight">
            <img src={LanguageImage} alt="Platform" className="w-4 h-4 shrink-0" />
       
       
            <span className="text-muted-foreground whitespace-nowrap">Languages:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const langs = broker.languages_supported;
                if (langs.length > 4) {
                  return `${langs.slice(0, 4).join(", ")} +${langs.length - 4} others`;
                }
                return langs.join(", ");
              })()}
            </span>
          </div>
        )}
      <div className="flex flex-col gap-2.5 mt-4">
        {broker.trading_platforms && (
          <div className="flex items-center gap-2 text-[13px] leading-tight">
            <img src={PlatformImage} alt="Platform" className="w-4 h-4 shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">Platforms:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const regs = broker.trading_platforms.split(",").map((r: string = "") => r.trim()).filter((r: string = "") => r.length > 0);
                if (regs.length > 4) {
                  return `${regs.slice(0, 4).join(", ")} +${regs.length - 4} others`;
                }
                return regs.join(", ");
              })()}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        <StatusBadge isActive={!!broker.free_trial_available}>Free trial</StatusBadge>
        <StatusBadge isActive={!!broker.certificate_available}>Certificate</StatusBadge>
        <StatusBadge isActive={!!broker.community_access}>Community</StatusBadge>
        <StatusBadge isActive={!!broker.mentorship_available}>1-on-1 mentor</StatusBadge>
      </div>
    </>
  );
};

const renderBridgeContent = (broker: Brokers) => {
  const stats = [
    { label: "Type", value: broker.solution_type },
    { label: "Est.", value: broker.year_established },
    { label: "HQ", value: broker.headquarters },
    { label: "Clients", value: broker.target_clients?.[0] },
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
      <div className="flex flex-col gap-2.5 mt-4">
        {broker.trading_platforms && (
          <div className="flex items-center gap-2 text-[13px] leading-tight">
            <img src={PlatformImage} alt="Platform" className="w-4 h-4 shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">Platforms:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const regs = broker.trading_platforms.split(",").map((r: string) => r.trim()).filter((r: string) => r.length > 0);
                if (regs.length > 4) {
                  return `${regs.slice(0, 4).join(", ")} +${regs.length - 4} others`;
                }
                return regs.join(", ");
              })()}</span>
          </div>
        )}
        {broker.liquiditySources && broker.liquiditySources.length > 0 && (
          <div className="flex items-center gap-2 text-[13px] leading-tight">
            <img src={LiquidityImage} alt="Platform" className="w-4 h-4 shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">Liquidity Sources:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const regs = broker.liquiditySources.map((r: string) => r.trim()).filter((r: string) => r.length > 0);
                if (regs.length > 4) {
                  return `${regs.slice(0, 4).join(", ")} +${regs.length - 4} others`;
                }
                return regs.join(", ");
              })()}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        <StatusBadge isActive={!!hasRiskAnalytics}>Risk Analytics</StatusBadge>
        <StatusBadge isActive={!!broker.white_label}>White Label</StatusBadge>
      </div>
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
  if (broker.nfa_fifo) badges.push("NFA/FIFO");
  if (broker.automation_level) badges.push(broker.automation_level);
  if (broker.verified_performance) badges.push(broker.verified_performance?.replace(/\s*\(.*?\)/g, '') + " Verified");
  if (broker.win_rate) badges.push(broker.win_rate?.replace(/\s*\(.*?\)/g, '') + " Win Rate");

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
  const stats = [
    { label: "Spread From", value: broker.minimum_raw_spreads || broker.minimum_standard_spreads },
    { label: "Min Deposit", value: broker.minimum_deposit },
    { label: "Commission", value: broker.minimum_commission_for_forex },
    { label: "Leverage", value: broker.maxLeverage },
  ];

  return (
    <>
      <StatGrid items={stats} />

      <div className="flex flex-col gap-2.5 mt-4">
        {broker.regulators && (
          <div className="flex items-center gap-2 text-[13px] leading-tight">
            <img src={RegulationImage} alt="Regulators" className="w-4 h-4 shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">Regulators:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const regs = broker.regulators.split(",").map((r: string) => r.trim()).filter((r: string) => r.length > 0);
                if (regs.length > 4) {
                  return `${regs.slice(0, 4).join(", ")} +${regs.length - 4} others`;
                }
                return regs.join(", ");
              })()}
            </span>
          </div>
        )}
        {broker.trading_platforms && (
          <div className="flex items-center gap-2 text-[13px] leading-tight">
            <img src={PlatformImage} alt="Platform" className="w-4 h-4 shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">Platforms:</span>
            <span className="text-black100 font-medium truncate">
              {(() => {
                const regs = broker.trading_platforms.split(",").map((r: string) => r.trim()).filter((r: string) => r.length > 0);
                if (regs.length > 4) {
                  return `${regs.slice(0, 4).join(", ")} +${regs.length - 4} others`;
                }
                return regs.join(", ");
              })()}</span>
          </div>
        )}
    
      </div>

      <div className="flex flex-wrap gap-2 pt-4">
        <StatusBadge isActive={!!broker.demoAccount}>Demo account</StatusBadge>
        <StatusBadge isActive={!!broker.islamicAccount}>Islamic</StatusBadge>
        <StatusBadge isActive={!!broker.copyTrading}>Copy trading</StatusBadge>
        <StatusBadge isActive={!!broker.availableInIndia}>India</StatusBadge>
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
      <CardHeader wrap={false} className=" mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Favicon src={logoUrl} size={24} className="object-contain w-12 h-12" contained />

          <Stack direction="column" size="xs" className="truncate">
            <H4 as="h3" className="truncate flex items-center gap-3">
              <Link href={brokerRoute}>
                <span className="absolute inset-0 z-40 rounded-lg" />
                {title}
              </Link>
              <VerifiedBadge size="md" className="mb-0.5 shrink-0" />
            </H4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const rating = parseFloat(formatRating(broker.overall_rating));
                  const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
                  return (
                    <StarIcon
                      key={i}
                      fillPercentage={fillPercentage}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-black100">
                <span>{formatRating(broker.overall_rating)}</span>
                {broker.total_reviews && (
                  <>
                    <span className="text-gray-300 font-light">|</span>
                    <span className="text-muted-foreground font-medium uppercase tracking-wider">
                      {broker.total_reviews} {parseInt(broker.total_reviews) === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Stack>
        </div>

        <div className="flex flex-col items-end gap-1">
          {broker.isSponsor && (
            <div className="absolute right-3 top-4 flex items-center gap-1.5 z-60 bg-white/50 text-muted-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#A8DD15] backdrop-blur-sm">
              <Crown className="size-3" strokeWidth={2} />
              <span>Sponsor</span>
            </div>
          )}
          {broker.year_established && (
            <p className="text-[11px] font-medium mt-7 ml-5 text-muted-foreground whitespace-nowrap">
              Est. {Math.round(broker.year_established)}
              {broker.headquarters && ` - ${broker.headquarters}`}
            </p>
          )}
        </div>
      </CardHeader>

      <div className="relative size-full flex flex-col">
        <Stack size="lg" direction="column" className="flex-1 duration-200 relative z-10">
          <CardDescription className="line-clamp-2 text-base">
            {description}
          </CardDescription>
          <div className=" self-stretch -mx-5 px-5 pt-4 border-t border-black100/15"></div>

          <div className="flex flex-col gap-2">
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
