import { isTruthy } from "@primoui/utils";
import { endOfDay, startOfDay } from "date-fns";
import { type Prisma, ToolStatus } from "~/.generated/prisma/client";
import type { BrokerListParams } from "~/server/admin/brokers/schema";
import { db } from "~/services/db";

export const findBrokers = async (
  search: BrokerListParams,
  where?: Prisma.BrokersWhereInput,
) => {
  const { broker_name, status, type, page, perPage, sort, from, to, operator } =
    search;

  // Offset to paginate the results
  const offset = (page - 1) * perPage;

  // Column and order to sort by
  const orderBy = sort.map(
    (item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const,
  );

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.BrokersWhereInput | undefined)[] = [
    // Filter by name
    broker_name
      ? { broker_name: { contains: broker_name, mode: "insensitive" } }
      : undefined,

    // Filter by status
    status && status.length > 0 ? { status: { in: status } } : undefined,

    // Filter by type
    type ? { type: { slug: type } } : undefined,

    // Filter by date
    fromDate || toDate
      ? { createdAt: { gte: fromDate, lte: toDate } }
      : undefined,
  ];

  const whereQuery: Prisma.BrokersWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  const [tools, total] = await db.$transaction([
    db.brokers.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [{ order: "asc" }, ...orderBy, { createdAt: "desc" }],
      take: perPage,
      skip: offset,
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        categories: { select: { id: true, name: true } },
        type: { select: { id: true, name: true } },
      },
    }),

    db.brokers.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(total / perPage);
  return { tools, total, pageCount };
};

export const findScheduledBrokers = async ({
  where,
  ...args
}: Prisma.BrokersFindManyArgs = {}) => {
  return db.brokers.findMany({
    ...args,
    where: {
      status: { in: [ToolStatus.Published, ToolStatus.Scheduled] },
      ...where,
    },
    select: {
      id: true,
      slug: true,
      broker_name: true,
      status: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "asc" },
  });
};

export const findBrokerList = async ({
  ...args
}: Prisma.BrokersFindManyArgs = {}) => {
  return db.brokers.findMany({
    ...args,
    select: { id: true, broker_name: true },
    orderBy: { broker_name: "asc" },
  });
};

export const findBrokerSlugs = async ({
  ...args
}: Prisma.BrokersFindManyArgs = {}) => {
  return db.brokers.findMany({
    ...args,
    select: { slug: true, updatedAt: true },
    where: { status: ToolStatus.Published },
    orderBy: { updatedAt: "desc" },
  });
};

export const findBrokerById = async (id: number) => {
  return db.brokers.findUnique({
    where: { id },
    select: {
      id: true,
      broker_name: true,
      slug: true,
      broker_website: true,
      overall_rating: true,
      description: true,
      headquarters: true,
      year_established: true,
      regulators: true,
      minimum_deposit: true,
      execution_types: true,
      trading_platforms: true,
      funding_methods: true,
      deposit_options: true,
      withdrawal_options: true,
      deposit_fees: true,
      withdrawal_fee: true,
      inactivity_fee: true,
      profit_share: true,
      retail_loss_rate: true,
      pros: true,
      cons: true,
      submitterName: true,
      submitterEmail: true,
      submitterNote: true,
      status: true,
      publishedAt: true,
      maximum_evaluation_fee: true,
      daily_loss_limit: true,
      minimum_raw_spreads: true,
      minimum_standard_spreads: true,
      minimum_commission_for_forex: true,
      average_trading_cost_eur_usd: true,
      average_trading_cost_gbp_usd: true,
      average_trading_cost_gold: true,
      average_trading_cost_bitcoin: true,
      average_trading_cost_wti_crude_oil: true,
      subtitle: true,
      screenshotUrl: true,
      bannerUrl: true,
      logoUrl: true,
      maxLeverage: true,
      totalInstruments: true,
      availableInIndia: true,
      islamicAccount: true,
      demoAccount: true,
      copyTrading: true,
      accountTypes: true,

      typeId: true,
      isSponsor: true,
      isMainSponsor: true,
      categories: { select: { id: true, name: true } },
      subcategories: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
      type: { select: { id: true, name: true } },
      features: true,
      socialProof: true,
      highlightedPoint: true,
    },
  });
};
