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
        value: broker.minimum_deposit || "N/A",
        type: "text",
      },
      {
        label: "Raw Spread",
        value: broker.minimum_raw_spreads || "N/A",
        type: "text",
      },
      {
        label: "Max Leverage",
        value: broker.maxLeverage || "N/A",
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
          : "N/A",
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
      starting_price: true,
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
        label: "IB Module",
        value: broker.features?.some((f) => f.toLowerCase().includes("ib"))
          ? "Yes"
          : "No",
        type: broker.features?.some((f) => f.toLowerCase().includes("ib"))
          ? "badge-dark"
          : "badge-danger",
      },
      {
        label: "Free Demo",
        value: broker.demoAccount ? "Yes" : "No",
        type: broker.demoAccount ? "badge-dark" : "badge-danger",
      },
      {
        label: "Starting price",
        value: broker.starting_price || "N/A",
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
