"use client";

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
};

export const BrokerCard = ({
  broker,
  className,
  ...props
}: BrokerCardProps) => {
  // Try to use a clean URL for the favicon fetch
  let domain = "forex.com";
  try {
    if (broker.url) {
      const urlObj = new URL(broker.url.startsWith('http') ? broker.url : `https://${broker.url}`);
      domain = urlObj.hostname;
    }
  } catch (e) {
    // Ignore, fallback to forex.com
  }

  return (
    <Card isRevealed className={`items-stretch select-none ${className || ""}`} {...props}>
      <CardHeader wrap={false} className="pr-8 mb-1">
        <Favicon src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} title={broker.broker_name || "Broker"} contained />

        <H4 as="h3" className="truncate">
          <Link href={`/brokers/${broker.id}`}>
            <span className="absolute inset-0 z-[50] rounded-lg" />
            {broker.broker_name || "UNKNOWN BROKER"}
          </Link>
        </H4>

        <VerifiedBadge size="md" className="-ml-1.5 shrink-0" />
        <Crown className="absolute right-4 top-4 size-[18px] text-[#f97316] opacity-80" strokeWidth={2.5} />
      </CardHeader>

      <div className="relative size-full flex flex-col">
        {/* Default State */}
        <Stack size="lg" direction="column" className="flex-1 duration-200 group-hover:opacity-0 relative z-10">
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'} offering competitive spreads.`}
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
            {broker.description || `Top rated forex broker based in ${broker.headquarters || 'global markets'} offering competitive spreads.`}
          </CardDescription>
          
          <div className="mt-auto pt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col gap-1 items-start">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="size-3.5" /> Score
              </span>
              <span className="font-semibold text-foreground text-sm">{broker.overall_rating || "N/A"}</span>
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
