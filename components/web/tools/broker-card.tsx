"use client";

import type { ComponentProps } from "react";
import { Badge } from "~/components/common/badge";
import { Card } from "~/components/common/card";
import { H4 } from "~/components/common/heading";
import { Link } from "~/components/common/link";
import type { Brokers } from "~/.generated/prisma/client";

type BrokerCardProps = ComponentProps<typeof Card> & {
  broker: Brokers;
};

export const BrokerCard = ({
  broker,
  className,
  ...props
}: BrokerCardProps) => {
  return (
    <Card
      className={`relative flex flex-col p-5 gap-4 w-full bg-card shadow-sm ${className || ""}`}
      isRevealed
      {...props}
    >
      {/* Top Header Row */}
      <div className="flex flex-col gap-1.5 min-w-0 relative z-10 w-full shrink pr-24">
        <Badge
          variant="success"
          className="w-fit text-[10px] px-1.5 py-0 h-4 min-h-4 border-none mb-0.5 mt-1"
        >
          Regulated
        </Badge>
        <H4
          as="h3"
          className="m-0 truncate font-semibold line-clamp-2 whitespace-normal"
        >
          <Link href={`/brokers/${broker.id}`} className="hover:underline">
            <span className="absolute inset-0 z-10" />
            {broker.broker_name?.toUpperCase() || "UNKNOWN BROKER"}
          </Link>
        </H4>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
          {broker.headquarters && (
            <span className="flex items-center gap-1">
              📍 {broker.headquarters}
            </span>
          )}
          {broker.year_established && (
            <span>
              {new Date().getFullYear() - Number(broker.year_established)} years
            </span>
          )}
        </div>
      </div>

      {/* Details list */}
      <div className="flex flex-col gap-1.5 mt-1 relative z-10 text-sm">
        {broker.regulators && (
          <div className="text-muted-foreground whitespace-normal">
            <span className="text-foreground font-medium">Regulators: </span>
            {broker.regulators}
          </div>
        )}
        {broker.description && (
          <div className="text-muted-foreground line-clamp-3">
            {broker.description}
          </div>
        )}
      </div>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Bottom Row */}
      <div className="flex flex-col justify-end relative z-10 mt-auto h-full min-h-[36px]">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {broker.minimum_deposit && (
            <div className="border border-border/70 rounded px-2 py-1 text-xs text-muted-foreground bg-muted/20">
              Min Dep: {broker.minimum_deposit}
            </div>
          )}
          {broker.execution_types && (
            <div className="border border-border/70 rounded px-2 py-1 text-xs text-muted-foreground bg-muted/20 truncate max-w-full">
              {broker.execution_types}
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="absolute top-[18px] right-5 flex flex-col items-center shrink-0 z-20">
        <div className="text-2xl font-black tabular-nums border-b-[3px] border-yellow-400 leading-none pb-1 tracking-tight">
          {broker.overall_rating || "N/A"}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
          Score
        </span>
      </div>
    </Card>
  );
};
