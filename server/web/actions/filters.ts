"use server";

import type { ReactNode } from "react";
import { actionClient } from "~/lib/safe-actions";
import { findCategories } from "~/server/web/categories/queries";
import type { ToolFilterParams } from "~/server/web/tools/schema";
import { db } from "~/services/db";

type FilterOption = {
  slug: string;
  name: ReactNode;
  count: number;
};

type FilterOptions = Array<{
  type: Exclude<keyof ToolFilterParams, "q" | "sort" | "page" | "perPage">;
  options: FilterOption[];
}>;

export const findFilterOptions = actionClient.action(async () => {
  const [categories, brokers] = await Promise.all([
    findCategories({ all: true }),
    db.brokers.findMany({
      where: { status: "Published" },
      select: {
        broker_name: true,
        regulators: true,
        trading_platforms: true,
        overall_rating: true,
        islamicAccount: true,
        copyTrading: true,
        demoAccount: true,
        availableInIndia: true,
      },
    }),
  ]);

  // Extract unique regulators
  console.log(
    "🔍 DEBUG: All brokers regulators data:",
    brokers.map((b) => ({
      name: b.broker_name || "Unknown",
      regulators: b.regulators,
    })),
  );

  const allRegulators = brokers
    .flatMap((b) => b.regulators?.split(",") || [])
    .map((r) => r.trim())
    .filter(Boolean);

  console.log("🔍 DEBUG: All extracted regulators:", allRegulators);

  const uniqueRegulators = Array.from(new Set(allRegulators))
    .filter((regulator) =>
      ["FCA", "ASIC", "CySEC", "BaFin", "Unregulated"].includes(regulator),
    )
    .sort();

  console.log("🔍 DEBUG: Filtered unique regulators:", uniqueRegulators);

  // Extract unique platforms
  const allPlatforms = brokers
    .flatMap((b) => b.trading_platforms?.split(",") || [])
    .map((p) => p.trim())
    .filter(Boolean);

  console.log("🔍 DEBUG: All extracted platforms:", allPlatforms);

  const uniquePlatforms = Array.from(new Set(allPlatforms))
    .filter((platform) =>
      ["MT4", "MT5", "cTrader", "TradingView", "Proprietary"].includes(
        platform,
      ),
    )
    .sort();

  console.log("🔍 DEBUG: Filtered unique platforms:", uniquePlatforms);

  const filterOptions: FilterOptions = [
    // {
    //   type: "category",
    //   options: categories.map(({ slug, name, _count }) => ({
    //     slug,
    //     name,
    //     count: _count.tools,
    //   })),
    // },
    {
      type: "regulators",
      options: uniqueRegulators.map((reg) => ({
        slug: reg,
        name: reg,
        count: brokers.filter((b) => {
          const regulatorList =
            b.regulators?.split(",").map((r) => r.trim()) || [];
          return regulatorList.some(
            (r) => r.toLowerCase() === reg.toLowerCase(),
          );
        }).length,
      })),
    },
    {
      type: "platforms",
      options: uniquePlatforms.map((plat) => ({
        slug: plat,
        name: plat,
        count: brokers.filter((b) => b.trading_platforms?.includes(plat))
          .length,
      })),
    },
    {
      type: "rating",
      options: ["4.5", "4.0", "3.5"].map((r) => ({
        slug: r,
        name: `${r}+`,
        count: brokers.filter(
          (b) => parseFloat(b.overall_rating || "0") >= parseFloat(r),
        ).length,
      })),
    },
    {
      type: "features",
      options: [
        "Islamic Account",
        "Copy Trading",
        "Demo Account",
        "India Available",
      ].map((feature) => ({
        slug: feature,
        name: feature,
        count: brokers.filter((b) => {
          switch (feature) {
            case "Islamic Account":
              return b.islamicAccount === true;
            case "Copy Trading":
              return b.copyTrading === true;
            case "Demo Account":
              return b.demoAccount === true;
            case "India Available":
              return b.availableInIndia === true;
            default:
              return false;
          }
        }).length,
      })),
    },
  ];

  return filterOptions.filter(({ options }) => options.length);
});
