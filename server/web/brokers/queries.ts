import { db } from "~/services/db";
import { ToolStatus } from "~/.generated/prisma/client";
import { getBrokerLogo } from "~/lib/brokers";
import { getPresignedUrlFromFull } from "~/lib/media";

/**
 * Fetches a category by its slug and includes its sponsored brokers.
 */
export const getCategoryWithBrokers = async (slug: string, limit?: number) => {
  return db.category.findUnique({
    where: { slug },
    include: {
      brokers: {
        where: {
          status: { in: ["Published", "Scheduled"] },
          isSponsor: true,
        },
        orderBy: { order: "asc" },
        take: limit,
      },
    },
  });
};

/**
 * Fetches trusted trading platforms.
 */
export const getTrustedPlatforms = async (limit: number = 7) => {
  const category = await getCategoryWithBrokers(
    "trusted-trading-platforms",
    limit,
  );
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id,
      name: broker.broker_name || "",
      description: broker.subtitle || broker.description || "",
      minDeposit: broker.minimum_deposit || "Varies",
      logoUrl: await getBrokerLogo(broker),
      isSponsor: broker.isSponsor,
      rating: broker.overall_rating || "0",
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches CRM and back office software.
 */
export const getCrmPlatforms = async (limit: number = 4) => {
  const category = await getCategoryWithBrokers("forex-crm-providers", limit);
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker: any) => ({
      id: broker.id,
      name: broker.broker_name || "",
      title: broker.broker_name || "",
      description: broker.subtitle || broker.description || "",
      minDeposit: broker.minimum_deposit || "Varies",
      logoUrl: await getBrokerLogo(broker),
      isSponsor: broker.isSponsor,
      rating: broker.overall_rating || "0",
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches bridge and plug-in partners.
 */
export const getBridgePartners = async (limit: number = 6) => {
  const category = await getCategoryWithBrokers(
    "forex-bridge-providers",
    limit,
  );
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.broker_name || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: broker.features || [],
      highlightedPoint: broker.highlightedPoint,
      socialProof: broker.socialProof,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches liquidity partners.
 */
export const getLiquidityPartners = async (limit: number = 2) => {
  const category = await getCategoryWithBrokers("liquidity-providers", limit);
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.subtitle || "",
      subtitle: broker.subtitle || null,
      description: broker.highlightedPoint || "",
      logoUrl: await getBrokerLogo(broker),
      features: [],
      highlightedPoint: null,
      socialProof: null,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches PSP partners.
 */
export const getPspPartners = async (limit: number = 12) => {
  const category = await getCategoryWithBrokers("forex-psp-partners", limit);
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.broker_name || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: [],
      highlightedPoint: null,
      socialProof: null,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches trading platform partners.
 */
export const getTradingPlatformPartners = async (limit: number = 5) => {
  const category = await getCategoryWithBrokers(
    "forex-trading-platform",
    limit,
  );
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.broker_name || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: [],
      highlightedPoint: null,
      socialProof: null,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches algorithmic trading partners.
 */
export const getAlgoPartners = async (limit: number = 5) => {
  const category = await getCategoryWithBrokers("algo-trading", limit);
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.subtitle || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: broker.features,
      bannerUrl:
        broker.bannerUrl ||
        (await getPresignedUrlFromFull(broker.screenshotUrl)) ||
        "",
      websiteUrl: broker.url || null,
      highlightedPoint: null,
      socialProof: null,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches forex education partners.
 */
export const getForexEducationPartners = async (limit: number = 3) => {
  const category = await getCategoryWithBrokers("forex-trading-courses", limit);
  const brokers = await Promise.all(
    (category?.brokers || []).map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.description || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: [],
      bannerUrl:
        broker.bannerUrl ||
        (await getPresignedUrlFromFull(broker.screenshotUrl)) ||
        "",
      websiteUrl: broker.broker_website || broker.url || null,
      highlightedPoint: broker.highlightedPoint || null,
      socialProof: broker.socialProof,
      slug: broker.slug || "",
    })),
  );
  return { brokers, category };
};

/**
 * Fetches all published brokers across all categories.
 */
export const getAllPartners = async (limit: number = 40) => {
  const brokers = await db.brokers.findMany({
    where: { status: ToolStatus.Published },
    orderBy: [
      { isSponsor: "desc" },
      { year_established: "desc" },
      { broker_name: "asc" },
    ],
    take: limit,
  });

  const formattedBrokers = await Promise.all(
    brokers.map(async (broker) => ({
      id: broker.id.toString(),
      order: broker.order,
      name: broker.broker_name || "",
      title: broker.broker_name || "",
      subtitle: broker.subtitle || null,
      description: broker.subtitle || broker.description || "",
      logoUrl: await getBrokerLogo(broker),
      features: [],
      highlightedPoint: null,
      socialProof: null,
      slug: broker.slug || "",
    })),
  );
  return formattedBrokers;
};
