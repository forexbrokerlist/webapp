import { getRandomElement } from "@primoui/utils";
import { cacheLife, cacheTag } from "next/cache";
import { type Prisma, ToolStatus } from "~/.generated/prisma/client";
import { toolManyPayload, toolOnePayload } from "~/server/web/tools/payloads";
import type { ToolFilterParams } from "~/server/web/tools/schema";
import { db } from "~/services/db";

export const searchTools = async (
  search: ToolFilterParams,
  where?: Prisma.ToolWhereInput,
) => {
  "use cache";

  cacheTag("tools");
  cacheLife("infinite");

  const { q, category, sort, page, perPage } = search;
  const skip = (page - 1) * perPage;
  const take = perPage;
  const [sortBy, sortOrder] = sort.split(".");

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(category && { categories: { some: { slug: category } } }),
  };

  if (q) {
    whereQuery.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { tagline: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Query Premium tools first, then others by createdAt (Standard and Free equal)
  const [tools, total] = await Promise.all([
    db.tool.findMany({
      orderBy: sortBy
        ? { [sortBy]: sortOrder }
        : [{ tierPriority: "asc" }, { publishedAt: "desc" }],
      where: { ...whereQuery, ...where },
      select: toolManyPayload,
      take,
      skip,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  return { tools, total, page, perPage };
};

export const findRelatedTools = async ({
  where,
  slug,
  ...args
}: Prisma.ToolFindManyArgs & { slug: string }) => {
  "use cache";

  cacheTag("related-tools");
  cacheLife("minutes");

  const relatedWhereClause = {
    ...where,
    AND: [
      { status: ToolStatus.Published },
      { slug: { not: slug } },
      { categories: { some: { tools: { some: { slug } } } } },
    ],
  } satisfies Prisma.ToolWhereInput;

  const take = 3;
  const itemCount = await db.tool.count({ where: relatedWhereClause });
  const skip = Math.max(0, Math.floor(Math.random() * itemCount) - take);
  const properties = [
    "id",
    "name",
  ] satisfies (keyof Prisma.ToolOrderByWithRelationInput)[];
  const orderBy = getRandomElement(properties);
  const orderDir = getRandomElement(["asc", "desc"] as const);

  return db.tool.findMany({
    ...args,
    where: relatedWhereClause,
    select: toolManyPayload,
    orderBy: { [orderBy]: orderDir },
    take,
    skip,
  });
};

export const findTools = async ({
  where,
  orderBy,
  ...args
}: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("tools");
  cacheLife("infinite");

  return db.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    orderBy: orderBy ?? [{ tierPriority: "asc" }, { publishedAt: "desc" }],
    select: toolManyPayload,
  });
};

export const findToolSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.ToolFindManyArgs) => {
  "use cache";

  cacheTag("tools");
  cacheLife("infinite");

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  });
};

export const countSubmittedTools = async ({
  where,
  ...args
}: Prisma.ToolCountArgs) => {
  return db.tool.count({
    ...args,
    where: {
      status: { notIn: [ToolStatus.Published] },
      submitterEmail: { not: null },
      ...where,
    },
  });
};

export const findTool = async ({
  where,
  ...args
}: Prisma.ToolFindFirstArgs = {}) => {
  "use cache";

  cacheTag("tool", `tool-${where?.slug}`);
  cacheLife("infinite");

  return db.tool.findFirst({
    ...args,
    where,
    select: toolOnePayload,
  });
};

export const searchBrokers = async (search: ToolFilterParams, where?: any) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("infinite");

  const { q, category, sort, page, perPage } = search;
  const skip = (page - 1) * perPage;
  const take = perPage;
  let [sortBy, sortOrder] = sort.split(".");

  // Map Tool-specific sort keys back to Brokers schema
  if (sortBy === "publishedAt") sortBy = "scraped_at";
  if (sortBy === "name") sortBy = "broker_name";

  // Ensure sortBy is valid for Brokers model to prevent Prisma errors
  const validSortFields = [
    "scraped_at",
    "broker_name",
    "year_established",
    "overall_rating",
    "id",
  ];
  if (sortBy && !validSortFields.includes(sortBy)) {
    sortBy = "";
  }

  // Safely omit Tool-specific properties from the where clause
  const safeWhere = { ...where };
  delete safeWhere.status;

  const whereQuery: Prisma.BrokersWhereInput = {
    ...safeWhere,
    status: ToolStatus.Published,
    ...(category && { categories: { some: { slug: category } } }),
  };

  if (q) {
    whereQuery.OR = [
      { broker_name: { contains: q, mode: "insensitive" } },
      { subtitle: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { pros: { contains: q, mode: "insensitive" } },
      { cons: { contains: q, mode: "insensitive" } },
    ];
  }

  const [brokers, total] = await Promise.all([
    db.brokers.findMany({
      where: whereQuery,
      orderBy: sortBy
        ? ([{ isSponsor: "desc" }, { [sortBy]: sortOrder }] as any)
        : [
            { isSponsor: "desc" },
            { order: "asc" },
            { year_established: "desc" },
            { broker_name: "asc" },
          ],
      include: { categories: true },
      take,
      skip,
    }),
    db.brokers.count({
      where: whereQuery,
    }),
  ]);

  return { brokers, total, page, perPage };
};

export const findBrokers = async ({
  where,
  orderBy,
  ...args
}: Prisma.BrokersFindManyArgs) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("infinite");

  const finalOrderBy = orderBy
    ? Array.isArray(orderBy)
      ? [{ isSponsor: "desc" }, ...orderBy]
      : [{ isSponsor: "desc" }, orderBy]
    : [
        { isSponsor: "desc" },
        { order: "asc" },
        { year_established: "desc" },
        { broker_name: "asc" },
      ];

  return db.brokers.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    orderBy: finalOrderBy as any,
  });
};

export const findBrokerBySlug = async (slug: string) => {
  "use cache";

  cacheTag("broker", `broker-${slug}`);
  cacheLife("infinite");

  return db.brokers.findFirst({
    where: { status: ToolStatus.Published, slug },
    include: {
      faqs: true,
      type: true,
      categories: true,
      courseModules: {
        orderBy: { order: "asc" },
      },
    },
  });
};

export const findRandomBrokers = async (
  take: number = 3,
  excludeSlug?: string,
  categorySlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    isSponsor: true,
    ...(excludeSlug && { slug: { not: excludeSlug } }),
    ...(categorySlug && { categories: { some: { slug: categorySlug } } }),
  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  // Pick a random starting point
  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 1,
      },
    },
    take,
    skip,
  });
};


export const findRandomCourses = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("courses");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "educationplatforms" },
    isSponsor: true,
    ...(excludeSlug && { slug: { not: excludeSlug } }),

  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  // Pick a random starting point
  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 1,
      },
    },
    take,
    skip,
  });
};
export const findRandomCrmProviders = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "crm" },
    ...(excludeSlug && { slug: { not: excludeSlug } }),
  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 1,
      },
    },
    take,
    skip,
  });
};
export const findRandomBridgeProviders = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "forexbridge" },
    ...(excludeSlug && { slug: { not: excludeSlug } }),
  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 1,
      },
    },
    take,
    skip,
  });
};
export const findRandomLiquidityProviders = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "liquidity" },
    ...(excludeSlug && { slug: { not: excludeSlug } }),
  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 1,
      },
    },
    take,
    skip,
  });
};
export const findRandomPSPPartners = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "psp" },
    ...(excludeSlug && { slug: { not: excludeSlug } }),
  };

  const itemCount = await db.brokers.count({ where: whereClause });

  if (itemCount === 0) return [];

  const skip = Math.max(0, Math.floor(Math.random() * (itemCount - take + 1)));

  return db.brokers.findMany({
    where: whereClause,
    select: {
      broker_name: true,
      logoUrl: true,
      screenshotUrl: true,
      slug: true,
      categories: {
        select: {
          slug: true,
        },
        take: 20,
      },
    },
    take,
    skip,
  });
};
export const findBrokersForComparison = async (take: number = 20) => {
  // "use cache"

  // cacheTag("brokers")
  // cacheLife("minutes")

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "broker" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      logoUrl: true,
      minimum_deposit: true,
      minimum_raw_spreads: true,
      maxLeverage: true,
      regulators: true,
      trading_platforms: true,
      islamicAccount: true,
      copyTrading: true,
      overall_rating: true,
    },
    take,
    orderBy: { isSponsor: "desc" },
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown Broker",
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "Min Deposit",
        value: broker.minimum_deposit || "-",
        type: "text",
      },
      {
        label: "Raw Spread",
        value: broker.minimum_raw_spreads || "-",
        type: "text",
      },
      {
        label: "Max Leverage",
        value: broker.maxLeverage || "-",
        type: "text",
      },
      {
        label: "Regulations",
        value: broker.regulators
          ? (() => {
              const regList = broker.regulators
                .split(",")
                .map((r: string) => r.replace(/\s*\(.*?\)/g, "").trim())
                .filter(Boolean)
                .filter((r) => r.toLowerCase() !== "other");
              if (regList.length <= 3) return regList.join(", ");
              return `${regList.slice(0, 3).join(", ")}, +${regList.length - 3} others`;
            })()
          : "None",
        type: "text",
      },
      {
        label: "Platforms",
        value: broker.trading_platforms
          ? (() => {
              const platformList = broker.trading_platforms
                .split(",")
                .map((r: string) => r.replace(/\s*\(.*?\)/g, "").trim())
                .filter(Boolean)
                .filter((r) => r.toLowerCase() !== "other");
              if (platformList.length <= 2) return platformList.join(", ");
              return `${platformList.slice(0, 2).join(", ")}, +${platformList.length - 2} others`;
            })()
          : "-",
        type: "text",
      },
      {
        label: "Islamic Acc",
        value: broker.islamicAccount ? "Yes" : "No",
        type: broker.islamicAccount ? "badge-dark" : "badge-danger",
      },
      {
        label: "Copy Trading",
        value: broker.copyTrading ? "Yes" : "No",
        type: broker.copyTrading ? "badge-dark" : "badge-danger",
      },
      {
        label: "Overall rating",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};

export const findCrmProvidersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "crm" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      logoUrl: true,
      trading_platforms: true,
      features: true,
      demoAccount: true,
      api_access: true,
      deployment_type: true,
      starting_price: true,
      bestFor: true,
      overall_rating: true,
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown CRM",
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "MT4/MT5",
        value: broker.trading_platforms
          ? broker.trading_platforms.toLowerCase().includes("mt4") &&
            broker.trading_platforms.toLowerCase().includes("mt5")
            ? "Yes"
            : broker.trading_platforms.toLowerCase().includes("mt4")
              ? "MT4 only"
              : broker.trading_platforms.toLowerCase().includes("mt5")
                ? "MT5 only"
                : "No"
          : "No",
        type: "text",
      },
      {
        label: "IB/Affiliate Module",
        value: broker.features?.some((f) => f.toLowerCase().includes("ib"))
          ? "Yes"
          : "No",
        type: broker.features?.some((f) => f.toLowerCase().includes("ib"))
          ? "badge-dark"
          : "badge-danger",
      },
         {
        label: "KYC/AML automation",
        value: broker.features?.some((f) => {
          const lowerF = f.toLowerCase();
          return lowerF.includes("kyc") || lowerF.includes("aml");
        })
          ? "Yes"
          : "No",
        type: broker.features?.some((f) => {
          const lowerF = f.toLowerCase();
          return lowerF.includes("kyc") || lowerF.includes("aml");
        })
          ? "badge-dark"
          : "badge-danger",
      },
         {
        label: "Client Portal",
        value: broker.features?.some((f) => {
          const lowerF = f.toLowerCase();
          return lowerF.includes("client portal");
        })
          ? "Yes"
          : "No",
        type: broker.features?.some((f) => {
          const lowerF = f.toLowerCase();
          return lowerF.includes("client portal");
        })
          ? "badge-dark"
          : "badge-danger",
      },
      {
        label: "Free Demo",
        value: broker.demoAccount ? "Yes" : "No",
        type: broker.demoAccount ? "badge-dark" : "badge-danger",
      },
      {
        label: "API access",
        value: broker.api_access ? "Yes" : "No",
        type: broker.api_access ? "badge-dark" : "badge-danger",
      },
      {
        label: "Deployment Type",
        value: broker.deployment_type || "-",
        type: "text",
      },
      {
        label: "Starting price",
        value: broker.starting_price || "-",
        type: "text",
      },
      {
        label: "Best For",
        value: broker.bestFor?.join(", ") || "-",
        type: "text",
      },
      
      {
        label: "Overall rating",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};

export const findForexEducationProvidersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "educationplatforms" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      logoUrl: true,
      skill_level: true,
      learning_format: true,
      free_trial_available: true,
      certificate_available: true,
      community_access: true,
      mentorship_available: true,
      trading_platforms: true,
      pricingModel: true,
      languages_supported: true,
      headquarters: true,
      overall_rating: true,
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown Provider",
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "Skill level",
        value: (() => {
          const levels = broker.skill_level || [];
          if (levels.length === 0) return "-";
          const hasBeginner = levels.includes("Beginner");
          const hasIntermediate = levels.includes("Intermediate");
          const hasAdvanced = levels.includes("Advanced");

          if (hasBeginner && hasAdvanced) return "Beginner -> Advanced";
          if (hasBeginner && hasIntermediate) return "Beginner -> Intermediate";
          if (hasIntermediate && hasAdvanced) return "Intermediate -> Advanced";
          return levels[0];
        })(),
        type: "text",
      },
      {
        label: "Learning format",
        value: (broker.learning_format || []).join(" + ") || "-",
        type: "text",
      },
      {
        label: "Free trial",
        value: broker.free_trial_available ? "Yes" : "No",
        type: broker.free_trial_available ? "badge-dark" : "badge-danger",
      },
      {
        label: "Certificate on completion",
        value: broker.certificate_available ? "Yes" : "No",
        type: broker.certificate_available ? "badge-dark" : "badge-danger",
      },
      {
        label: "Community access",
        value: broker.community_access ? "Yes" : "No",
        type: broker.community_access ? "badge-dark" : "badge-danger",
      },
      {
        label: "1-on-1 mentorship",
        value: broker.mentorship_available ? "Available" : "No",
        type: broker.mentorship_available ? "badge-dark" : "badge-danger",
      },
      {
        label: "MT4 / MT5 training",
        value: broker.trading_platforms
          ? broker.trading_platforms.toLowerCase().includes("mt4") ||
            broker.trading_platforms.toLowerCase().includes("mt5")
            ? "Yes"
            : "No"
          : "No",
        type:
          broker.trading_platforms?.toLowerCase().includes("mt4") ||
          broker.trading_platforms?.toLowerCase().includes("mt5")
            ? "badge-dark"
            : "badge-danger",
      },
      {
        label: "Pricing model",
        value: broker.pricingModel || "-",
        type: "text",
      },
      {
        label: "Language",
        value: (broker.languages_supported || []).join(", ") || "English",
        type: "text",
      },
      {
        label: "HQ / Region",
        value: broker.headquarters || "-",
        type: "text",
      },
      {
        label: "Score",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};


export const findBridgeProvidersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "forexbridge" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      logoUrl: true,
      solution_type: true,
      trading_platforms: true,
      latency: true,
      target_clients: true,
      white_label: true,
      api_access: true,
      demoAccount: true,
      pricingModel: true,
      setup_time: true,
      overall_rating: true,
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown Provider",
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "Solution type",
        value: broker.solution_type || "-",
        type: "text",
      },
      {
        label: "Compatible platforms",
        value: broker.trading_platforms || "-",
        type: "text",
      },
      {
        label: "Latency",
        value: broker.latency || "-",
        type: "text",
      },
      {
        label: "Target clients",
        value: (broker.target_clients || []).join(", ") || "-",
        type: "text",
      },
      {
        label: "White label",
        value: broker.white_label ? "Yes" : "No",
        type: broker.white_label ? "badge-dark" : "badge-danger",
      },
      {
        label: "API access",
        value: broker.api_access ? "Yes" : "No",
        type: broker.api_access ? "badge-dark" : "badge-danger",
      },
      {
        label: "Demo available",
        value: broker.demoAccount ? "Yes" : "No",
        type: broker.demoAccount ? "badge-dark" : "badge-danger",
      },
      {
        label: "Pricing model",
        value: broker.pricingModel || "-",
        type: "text",
      },
      {
        label: "Setup time",
        value: broker.setup_time || "-",
        type: "text",
      },
      {
        label: "Score",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};

export const findLiquidityProvidersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "liquidity" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      logoUrl: true,
      solution_type: true,
      latency: true,
      asset_classes: true,
      no_last_look: true,
      target_clients: true,
      white_label: true,
      api_access: true,
      pricingModel: true,
      demoAccount: true,
      regulators: true,
      overall_rating: true,
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown Provider",
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "Provider type",
        value: broker.solution_type || "-",
        type: "text",
      },
      {
        label: "Execution latency",
        value: broker.latency || "-",
        type: "text",
      },
      {
        label: "Asset classes",
        value: broker.asset_classes && broker.asset_classes.length > 0 
          ? (broker.asset_classes.length > 2 
              ? `${broker.asset_classes.slice(0, 2).join(", ")}, +${broker.asset_classes.length - 2} others`
              : broker.asset_classes.join(", "))
          : "-",
        type: "text",
      },
      {
        label: "No last look",
        value: broker.no_last_look ? "Yes" : "No",
        type: broker.no_last_look ? "badge-dark" : "badge-danger",
      },
      {
        label: "Target clients",
        value: broker.target_clients && broker.target_clients.length > 0 
          ? (() => {
              const mapped = broker.target_clients.map(t => {
                if (t === "Hedge Funds") return "Funds";
                if (t === "Prop Trading Firms") return "Prop Firms";
                return t;
              });
              return mapped.length > 3 
                ? `${mapped.slice(0, 3).join(", ")}, +${mapped.length - 3} others`
                : mapped.join(", ");
            })()
          : "-",
        type: "text",
      },
      {
        label: "White label",
        value: broker.white_label ? "Yes" : "No",
        type: broker.white_label ? "badge-dark" : "badge-danger",
      },
      {
        label: "API access",
        value: broker.api_access ? "Yes" : "No",
        type: broker.api_access ? "badge-dark" : "badge-danger",
      },
      {
        label: "Pricing model",
        value: broker.pricingModel || "-",
        type: "text",
      },
      {
        label: "Demo available",
        value: broker.demoAccount ? "Yes" : "No",
        type: broker.demoAccount ? "badge-dark" : "badge-danger",
      },
      {
        label: "Regulators",
        value: broker.regulators || "-",
        type: "text",
      },
      {
        label: "Score",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};


export const findPSPPartnersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "psp" },
  };
  
  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      slug: true,
      logoUrl: true,
      company_type: true,
      target_clients: true,
      settlement_time: true,
      auto_fiat_conversion: true,
      supported_cryptos: true,
      fiat_currencies: true,
      integration_type: true,
      white_label: true,
      kyb_required: true,
      mass_payout: true,
      overall_rating: true,
      type: {
        select: { slug: true }
      }
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown Provider",
    slug: broker.slug,
    typeSlug: broker.type?.slug,
    logoUrl: broker.logoUrl,
    stats: [
      {
        label: "Company type",
        value: broker.company_type || "-",
        type: "text",
      },
      {
        label: "Target clients",
        value: broker.target_clients && broker.target_clients.length > 0 
          ? (broker.target_clients.length > 3 
              ? `${broker.target_clients.slice(0, 3).join(", ")}, +${broker.target_clients.length - 3} others`
              : broker.target_clients.join(", "))
          : "-",
        type: "text",
      },
      {
        label: "Settlement",
        value: broker.settlement_time || "-",
        type: "text",
      },
      {
        label: "Auto fiat conversion",
        value: broker.auto_fiat_conversion ? "Yes" : "No",
        type: broker.auto_fiat_conversion ? "badge-dark" : "badge-danger",
      },
      {
        label: "Supported cryptos",
        value: broker.supported_cryptos || "-",
        type: "text",
      },
      {
        label: "Fiat currencies",
        value: broker.fiat_currencies || "-",
        type: "text",
      },
      {
        label: "Integration",
        value: broker.integration_type && broker.integration_type.length > 0 
          ? broker.integration_type.join(", ")
          : "-",
        type: "text",
      },
      {
        label: "White label",
        value: broker.white_label ? "Yes" : "No",
        type: broker.white_label ? "badge-dark" : "badge-danger",
      },
      {
        label: "KYB required",
        value: broker.kyb_required ? "Business" : "No",
        type: broker.kyb_required ? "badge-dark" : "badge-danger",
      },
      {
        label: "Mass payout",
        value: broker.mass_payout ? "Yes" : "No",
        type: broker.mass_payout ? "badge-dark" : "badge-danger",
      },
      {
        label: "Score",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};