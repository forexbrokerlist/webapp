"use server";

import { z } from "zod";
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

export const findFilterOptionsWithCategory = actionClient
  .inputSchema(z.object({ category: z.string().optional() }))
  .action(async ({ parsedInput: { category } }) => {
    console.log(
      "🔍 findFilterOptionsWithCategory received category:",
      category,
    );
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

    // Determine which filters to show based on category
    const isForexEducation = category === "forex-trading-courses";
    const isBridgeOrPlugin =
      category === "forex-bridge-providers" || category === "plugin-providers";
    const isLiquidityPartner = category === "liquidity-providers";
    const isPspPartner = category === "forex-psp-partners";
    console.log(
      "🔍 isForexEducation:",
      isForexEducation,
      "🔍 isBridgeOrPlugin:",
      isBridgeOrPlugin,
      "🔍 isLiquidityPartner:",
      isLiquidityPartner,
      "🔍 isPspPartner:",
      isPspPartner,
      "for category:",
      category,
    );

    let filterOptions: FilterOptions = [];

    if (isForexEducation) {
      // Forex Education filters only
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
    } else if (isBridgeOrPlugin) {
      // Bridge & Plugin filters
      filterOptions = [
        {
          type: "solutionType",
          options: [
            "All",
            "Liquidity Bridge",
            "Risk Engine",
            "Execution Bridge",
            "Plugin / Add-on",
            "Infrastructure",
          ].map((type) => ({
            slug: type,
            name: type,
            count: 0, // TODO: Update when bridge/plugin data is available
          })),
        },
        {
          type: "compatiblePlatform",
          options: [
            "All",
            "MT4",
            "MT5",
            "cTrader",
            "FIX API",
            "Proprietary",
          ].map((platform) => ({
            slug: platform,
            name: platform,
            count: 0, // TODO: Update when bridge/plugin data is available
          })),
        },
        {
          type: "targetClient",
          options: [
            "All",
            "Retail brokers",
            "Institutional",
            "Prime brokers",
            "White label",
          ].map((client) => ({
            slug: client,
            name: client,
            count: 0, // TODO: Update when bridge/plugin data is available
          })),
        },
        {
          type: "hqRegion",
          options: ["All", "UAE / Dubai", "UK", "Europe", "USA"].map(
            (region) => ({
              slug: region,
              name: region,
              count: 0, // TODO: Update when bridge/plugin data is available
            }),
          ),
        },
      ];
    } else if (isLiquidityPartner) {
      // Liquidity Partner filters
      filterOptions = [
        {
          type: "regulators",
          options: [
            { slug: "fca", name: "FCA", count: 0 },
            { slug: "asic", name: "ASIC", count: 0 },
            { slug: "mas", name: "MAS", count: 0 },
            { slug: "cysec", name: "CySEC", count: 0 },
            { slug: "cftc", name: "CFTC", count: 0 },
            { slug: "fsa", name: "FSA", count: 0 },
          ],
        },
        {
          type: "assetClass",
          options: [
            { slug: "spot_fx", name: "Spot FX ", count: 0 },
            { slug: "crypto", name: "Crypto ", count: 0 },
            { slug: "indices", name: "Indices ", count: 0 },
            { slug: "commodities", name: "Commodities ", count: 0 },
            { slug: "ndfs", name: "NDFs", count: 0 },
            { slug: "equities", name: "Equities", count: 0 },
          ],
        },
        {
          type: "executionType",
          options: [
            { slug: "no_last_look", name: "No Last Look ", count: 0 },
            { slug: "ecn_stp", name: "ECN/STP ", count: 0 },
            { slug: "prime_of_prime", name: "Prime of Prime ", count: 0 },
            { slug: "a_book", name: "A-Book ", count: 0 },
            { slug: "dma", name: "DMA ", count: 0 },
          ],
        },
        {
          type: "providerType",
          options: [
            { slug: "fx_exchange", name: "FX Exchange good", count: 0 },
            { slug: "prime_broker", name: "Prime Broker good", count: 0 },
            { slug: "crypto_lp", name: "Crypto LP good", count: 0 },
            { slug: "white_label", name: "White Label ", count: 0 },
            { slug: "retail_lp", name: "Retail LP optional", count: 0 },
          ],
        },
      ];
    } else if (isPspPartner) {
      // PSP Partner filters
      filterOptions = [
        {
          type: "paymentType",
          options: [
            { slug: "crypto_gateway", name: "Crypto gateway ", count: 0 },
            {
              slug: "card_processing",
              name: "Card processing ",
              count: 0,
            },
            { slug: "bank_transfer", name: "Bank transfer ", count: 0 },
            { slug: "e_wallet", name: "E-wallet ", count: 0 },
            { slug: "local_payments", name: "Local payments ", count: 0 },
            { slug: "open_banking", name: "Open banking", count: 0 },
          ],
        },
        {
          type: "settlementCurrency",
          options: [
            { slug: "usd", name: "USD", count: 0 },
            { slug: "eur", name: "EUR", count: 0 },
            { slug: "usdt", name: "USDT", count: 0 },
            { slug: "gbp", name: "GBP ", count: 0 },
            { slug: "multi_fiat", name: "Multi-fiat", count: 0 },
            { slug: "crypto_only", name: "Crypto only", count: 0 },
          ],
        },
        {
          type: "integrationType",
          options: [
            { slug: "api", name: "API ", count: 0 },
            { slug: "plugin", name: "Plugin ", count: 0 },
            {
              slug: "hosted_checkout",
              name: "Hosted checkout",
              count: 0,
            },
            { slug: "mass_payout", name: "Mass payout", count: 0 },
            { slug: "white_label", name: "White label", count: 0 },
          ],
        },
        {
          type: "pspFeatures",
          options: [
            {
              slug: "auto_fiat_conversion",
              name: "Auto fiat conversion ",
              count: 0,
            },
            {
              slug: "instant_settlement",
              name: "Instant settlement ",
              count: 0,
            },
            {
              slug: "invoice_payments",
              name: "Invoice payments ",
              count: 0,
            },
            {
              slug: "recurring_billing",
              name: "Recurring billing ",
              count: 0,
            },
            {
              slug: "chargeback_protection",
              name: "Chargeback protection",
              count: 0,
            },
          ],
        },
      ];
    } else {
      // Broker-related filters (default behavior)
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
