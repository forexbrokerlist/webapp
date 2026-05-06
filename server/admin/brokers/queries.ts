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
      company_name: true,
      deployment_type: true,
      starting_price: true,
      bestFor: true,
      free_trial_available: true,
      api_access: true,
      support_channels: true,
      support_hours: true,
      languages_supported: true,
      pricingModel: true,
      provider_type: true,
      skill_level: true,
      learning_format: true,
      topics_covered: true,
      outcomes: true,
      certificate_available: true,
      community_access: true,
      mentorship_available: true,
      solution_type: true,
      target_clients: true,
      asset_classes: true,
      latency: true,
      white_label: true,
      setup_time: true,
      peak_capacity: true,
      global_hubs: true,
      no_last_look: true,
      liquiditySources: true,
      best_suited_for: true,
      company_type: true,
      settlement_time: true,
      auto_fiat_conversion: true,
      kyb_required: true,
      supported_cryptos: true,
      fiat_currencies: true,
      integration_type: true,
      mass_payout: true,
      checkout_page: true,
      platform_type: true,
      prop_firm_support: true,
      brokers_onboarded: true,
      trader_accounts: true,
      white_label_price: true,
      server_license: true,
      charting_tools: true,
      mt5_backend: true,
      yearly_commitment: true,
      clients_count: true,
      hosting_included: true,
      crm_integrations: true,
      liquidity_connect: true,
      kyc_compliance: true,
      verified_performance: true,
      bot_type: true,
      strategy_type: true,
      risk_levels: true,
      win_rate: true,
      trades_per_day: true,
      supported_pairs: true,
      nfa_fifo: true,
      ecn_compatible: true,
      vps_required: true,
      mobile_support: true,
      gold_plan_price: true,
      gold_plan_statements: true,
      diamond_plan_price: true,
      diamond_plan_statements: true,
      automation_level: true,

      typeId: true,
      isSponsor: true,
      isPremiumBroker: true,
      isMainSponsor: true,
      categories: { select: { id: true, name: true } },
      subcategories: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
      type: { select: { id: true, name: true } },
      features: true,
      socialProof: true,
      highlightedPoint: true,
      beginner_friendly: true,
      review_article: true,
      seo_title: true,
      seo_meta_description: true,
      newer_traders_rating: true,
      scalpers_rating: true,
      swing_traders_rating: true,
      news_traders_rating: true,
      day_traders_rating: true,
      copy_traders_rating: true,
      automated_traders_rating: true,
      investors_rating: true,
      overall_review_rating: true,
      total_reviews: true,
      faqs: {
        select: {
          id: true,
          question: true,
          answer: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
      courseModules: {
        select: {
          id: true,
          title: true,
          difficulty: true,
          duration: true,
          topics: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
      reviews: true,
    },
  });
};
