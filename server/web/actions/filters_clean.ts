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
  const allRegulators = brokers
    .flatMap((b) => b.regulators?.split(",") || [])
    .map((r) => r.trim())
    .filter(Boolean);

  const uniqueRegulators = Array.from(new Set(allRegulators))
    .filter((regulator) =>
      ["FCA", "ASIC", "CySEC", "BaFin", "Unregulated"].includes(regulator),
    )
    .sort();

  // Extract unique platforms
  const allPlatforms = brokers
    .flatMap((b) => b.trading_platforms?.split(",") || [])
    .map((p) => p.trim())
    .filter(Boolean);

  const uniquePlatforms = Array.from(new Set(allPlatforms))
    .filter((platform) =>
      ["MT4", "MT5", "cTrader", "TradingView", "Proprietary"].includes(
        platform,
      ),
    )
    .sort();

  // Check if we're in forex education category
  const isForexEducation = categories.some(cat => cat.slug === "forex-education");

  let filterOptions: FilterOptions = [];

  if (isForexEducation) {
    // Return only forex education filters
    filterOptions = [
      {
        type: "skillLevel",
        options: ["Beginner", "Intermediate", "Advanced"].map((level) => ({
          slug: level,
          name: level,
          count: 0, // TODO: Update when education data is available
        })),
      },
      {
        type: "learningFormat",
        options: [
          "Video",
          "Live sessions", 
          "Self-paced",
          "Mentorship",
          "Webinar",
        ].map((format) => ({
          slug: format,
          name: format,
          count: 0, // TODO: Update when education data is available
        })),
      },
      {
        type: "pricing",
        options: ["Free", "Free trial", "Subscription", "One-time"].map(
          (price) => ({
            slug: price,
            name: price,
            count: 0, // TODO: Update when education data is available
          }),
        ),
      },
      {
        type: "educationFeatures",
        options: [
          "Certificate",
          "Community",
          "1-on-1 Mentor",
          "MT4/MT5 training",
        ].map((feature) => ({
          slug: feature,
          name: feature,
          count: 0, // TODO: Update when education data is available
        })),
      },
      {
        type: "locationLanguage",
        options: ["UK", "UAE", "USA", "English", "Hindi"].map((location) => ({
          slug: location,
          name: location,
          count: 0, // TODO: Update when education data is available
        })),
      },
    ];
  } else {
    // Return regular broker filters
    filterOptions = [
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
  }

  return filterOptions.filter(({ options }) => options.length);
});
