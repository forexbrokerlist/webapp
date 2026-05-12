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

  const {
    q,
    category,
    sort,
    page,
    perPage,
    regulators,
    platforms,
    rating,
    features,
    // Forex education specific filters
    skillLevel,
    learningFormat,
    pricing,
    educationFeatures,
    locationLanguage,
    // Bridge & Plugin specific filters
    solutionType,
    compatiblePlatform,
    targetClient,
    hqRegion,
    // Liquidity Provider specific filters
    regulation,
    assetClass,
    executionType,
    providerType,
    // PSP Partner specific filters
    paymentType,
    settlementCurrency,
    integrationType,
    pspFeatures,
    // Trading Platform specific filters
    platformType,
    propFirm,
    deployment,
    bestFor,
    platformFeatures,
  } = search;
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
    ...(rating && { overall_rating: { startsWith: rating } }),
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

  const [allBrokers, totalCount] = await Promise.all([
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
    }),
    db.brokers.count({
      where: whereQuery,
    }),
  ]);

  // Filter brokers in memory for regulators
  let brokers = allBrokers;
  if (regulators) {
  

    const selectedRegulators = regulators.split(",").map((r) => r.trim());

    brokers = allBrokers.filter((broker) => {
      const regulatorList =
        broker.regulators?.split(",").map((r) => r.trim()) || [];
      const hasMatch = selectedRegulators.some((selectedReg) =>
        regulatorList.some(
          (reg) => reg.toLowerCase() === selectedReg.toLowerCase(),
        ),
      );

      if (broker.regulators?.includes("ASIC")) {
        console.log("🔍 DEBUG: ASIC Broker found:", {
          broker_name: broker.broker_name,
          regulators: broker.regulators,
          regulatorList,
          selectedRegulators,
          hasMatch,
          searchingFor: regulators,
        });
      }

      return hasMatch;
    });

  }

  // Filter brokers in memory for platforms
  if (platforms) {
    const selectedPlatforms = platforms.split(",").map((p) => p.trim());
    console.log("🔍 DEBUG: Filtering for platforms:", platforms);
    brokers = brokers.filter((broker) => {
      const platformList =
        broker.trading_platforms?.split(",").map((p) => p.trim()) || [];
      const hasMatch = selectedPlatforms.some((selectedPlatform) =>
        platformList.some(
          (platform) =>
            platform.toLowerCase() === selectedPlatform.toLowerCase(),
        ),
      );
      return hasMatch;
    });
    console.log("🔍 DEBUG: Brokers after platform filter:", brokers.length);
  }

  // Filter brokers in memory for features
  if (features) {
    const selectedFeatures = features.split(",").map((f) => f.trim());
    console.log("🔍 DEBUG: Filtering for features:", features);
    brokers = brokers.filter((broker) => {
      return selectedFeatures.some((selectedFeature) => {
        switch (selectedFeature) {
          case "Islamic Account":
            return broker.islamicAccount === true;
          case "Copy Trading":
            return broker.copyTrading === true;
          case "Demo Account":
            return broker.demoAccount === true;
          case "India Available":
            return broker.availableInIndia === true;
          default:
            return false;
        }
      });
    });
    console.log("🔍 DEBUG: Brokers after features filter:", brokers.length);
  }

  // Filter brokers in memory for skill level
  if (skillLevel) {
    console.log("🔍 DEBUG: Filtering for skill level:", skillLevel);
    brokers = brokers.filter((broker) => {
      const skillLevels = broker.skill_level || [];
      return skillLevels.includes(skillLevel);
    });
    console.log("🔍 DEBUG: Brokers after skill level filter:", brokers.length);
  }

  // Filter brokers in memory for learning format
  if (learningFormat) {
    const selectedFormats = learningFormat.split(",").map((f) => f.trim());
    console.log("🔍 DEBUG: Filtering for learning format:", learningFormat);
    brokers = brokers.filter((broker) => {
      const formats = broker.learning_format || [];
      return selectedFormats.some((selectedFormat) =>
        formats.some(
          (format) => format.toLowerCase() === selectedFormat.toLowerCase(),
        ),
      );
    });
    console.log(
      "🔍 DEBUG: Brokers after learning format filter:",
      brokers.length,
    );
  }

  // Filter brokers in memory for pricing
  if (pricing) {
    console.log("🔍 DEBUG: Filtering for pricing:", pricing);
    brokers = brokers.filter((broker) => {
      const pricingModels = broker.pricingModel || [];
      return pricingModels.some((model) =>
        model.toLowerCase().includes(pricing.toLowerCase()),
      );
    });
    console.log("🔍 DEBUG: Brokers after pricing filter:", brokers.length);
  }

  // Filter brokers in memory for education features
  if (educationFeatures) {
    const selectedFeatures = educationFeatures.split(",").map((f) => f.trim());
    console.log(
      "🔍 DEBUG: Filtering for education features:",
      educationFeatures,
    );
    brokers = brokers.filter((broker) => {
      return selectedFeatures.some((selectedFeature) => {
        switch (selectedFeature) {
          case "Certificate":
            return broker.certificate_available === true;
          case "Community":
            return broker.community_access === true;
          case "1-on-1 Mentor":
            return broker.mentorship_available === true;
          case "MT4/MT5 training":
            return (
              broker.trading_platforms?.toLowerCase().includes("mt4") ||
              broker.trading_platforms?.toLowerCase().includes("mt5")
            );
          default:
            return false;
        }
      });
    });
    console.log(
      "🔍 DEBUG: Brokers after education features filter:",
      brokers.length,
    );
  }

  // Filter brokers in memory for location/language
  if (locationLanguage) {
    const selectedLocations = locationLanguage.split(",").map((l) => l.trim());
    
    brokers = brokers.filter((broker) => {
      const languages = broker.languages_supported || [];
      const headquarters = broker.headquarters || "";

      return selectedLocations.some((selectedLocation) => {
        const lowerSelected = selectedLocation.toLowerCase();

        // Check if language matches
        const languageMatch = languages.some(
          (lang) => lang.toLowerCase() === lowerSelected,
        );

        // Check if location matches (for things like UK, UAE, USA)
        const locationMatch = headquarters
          .toLowerCase()
          .includes(lowerSelected);

        return languageMatch || locationMatch;
      });
    });
    
  }

  // Filter brokers in memory for solution type
  if (solutionType && solutionType !== "All") {
    console.log("🔍 DEBUG: Filtering for solution type:", solutionType);
    brokers = brokers.filter((broker) => {
      return broker.solution_type === solutionType;
    });
  
  }

  // Filter brokers in memory for compatible platform
  if (compatiblePlatform) {
    const selectedPlatforms = compatiblePlatform
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "All");
   
    brokers = brokers.filter((broker) => {
      if (selectedPlatforms.length === 0) return true;

      // Check if broker supports any of the selected platforms
      return selectedPlatforms.some((selectedPlatform) => {
        const brokerPlatforms =
          broker.trading_platforms?.split(",").map((p) => p.trim()) || [];
        return brokerPlatforms.some(
          (platform) =>
            platform.toLowerCase() === selectedPlatform.toLowerCase(),
        );
      });
    });
  
  }

  // Filter brokers in memory for target client
  if (targetClient) {
    const selectedClients = targetClient
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "All");
    
    brokers = brokers.filter((broker) => {
      if (selectedClients.length === 0) return true;

      const targetClients = broker.target_clients || [];
      return selectedClients.some((selectedClient) =>
        targetClients.some(
          (client) => client.toLowerCase() === selectedClient.toLowerCase(),
        ),
      );
    });
  
  }

  // Filter brokers in memory for HQ region
  if (hqRegion) {
    const selectedRegions = hqRegion
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r !== "All");
   
    brokers = brokers.filter((broker) => {
      if (selectedRegions.length === 0) return true;

      const headquarters = broker.headquarters || "";
      return selectedRegions.some((selectedRegion) => {
        const lowerSelected = selectedRegion.toLowerCase();
        return headquarters.toLowerCase().includes(lowerSelected);
      });
    });
   
  }

  // Filter brokers in memory for regulation
  if (regulation) {
    const selectedRegulations = regulation
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r !== "All");
    
    brokers = brokers.filter((broker) => {
      if (selectedRegulations.length === 0) return true;

      const brokerRegulations = broker.regulators
        ? broker.regulators.split(",").map((r) => r.trim())
        : [];
      return selectedRegulations.some((selectedReg) =>
        brokerRegulations.some(
          (reg) => reg.toLowerCase() === selectedReg.toLowerCase(),
        ),
      );
    });
   
  }

  // Filter brokers in memory for asset class
  if (assetClass) {
    const selectedAssetClasses = assetClass
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "All");
 
    brokers = brokers.filter((broker) => {
      if (selectedAssetClasses.length === 0) return true;

      const brokerAssetClasses = broker.asset_classes || [];
      return selectedAssetClasses.some((selectedAsset) =>
        brokerAssetClasses.some(
          (asset) => asset.toLowerCase() === selectedAsset.toLowerCase(),
        ),
      );
    });
   
  }

  // Filter brokers in memory for execution type
  if (executionType) {
    const selectedExecutionTypes = executionType
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e !== "All");
    
    brokers = brokers.filter((broker) => {
      if (selectedExecutionTypes.length === 0) return true;

      const brokerExecutionTypes = broker.execution_types
        ? broker.execution_types.split(",").map((e) => e.trim())
        : [];
      return selectedExecutionTypes.some((selectedExec) =>
        brokerExecutionTypes.some(
          (exec) => exec.toLowerCase() === selectedExec.toLowerCase(),
        ),
      );
    });
    console.log(
      "🔍 DEBUG: Brokers after execution type filter:",
      brokers.length,
    );
  }

  // Filter brokers in memory for provider type
  if (providerType) {
    const selectedProviderTypes = providerType
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "All");
  
    brokers = brokers.filter((broker) => {
      if (selectedProviderTypes.length === 0) return true;

      const brokerProviderTypes = broker.provider_type || [];
      return selectedProviderTypes.some((selectedProv) =>
        brokerProviderTypes.some(
          (prov) => prov.toLowerCase() === selectedProv.toLowerCase(),
        ),
      );
    });
    console.log(
      "🔍 DEBUG: Brokers after provider type filter:",
      brokers.length,
    );
  }

  // Filter brokers in memory for payment type
  if (paymentType) {
    const selectedPaymentTypes = paymentType
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "All");
      
    brokers = brokers.filter((broker) => {
      if (selectedPaymentTypes.length === 0) return true;

      const brokerFundingMethods =
        broker.funding_methods?.split(",").map((m) => m.trim()) || [];
      return selectedPaymentTypes.some((selectedPay) =>
        brokerFundingMethods.some(
          (pay) => pay.toLowerCase() === selectedPay.toLowerCase(),
        ),
      );
    });
   
  }

  // Filter brokers in memory for settlement currency
  if (settlementCurrency) {
    const selectedCurrencies = settlementCurrency
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "All");
    console.log(
      "🔍 DEBUG: Filtering for settlement currency:",
      settlementCurrency,
    );
    brokers = brokers.filter((broker) => {
      if (selectedCurrencies.length === 0) return true;

      const brokerFiatCurrencies =
        broker.fiat_currencies?.split(",").map((c) => c.trim()) || [];
      return selectedCurrencies.some((selectedCurr) =>
        brokerFiatCurrencies.some(
          (curr) => curr.toLowerCase() === selectedCurr.toLowerCase(),
        ),
      );
    });
    
  }

  // Filter brokers in memory for integration type
  if (integrationType) {
    const selectedIntegrationTypes = integrationType
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "All");
    console.log("🔍 DEBUG: Filtering for integration type:", integrationType);
    brokers = brokers.filter((broker) => {
      if (selectedIntegrationTypes.length === 0) return true;

      const brokerIntegrationTypes = broker.integration_type || [];
      return selectedIntegrationTypes.some((selectedInt) =>
        brokerIntegrationTypes.some(
          (int) => int.toLowerCase() === selectedInt.toLowerCase(),
        ),
      );
    });
    console.log(
      "🔍 DEBUG: Brokers after integration type filter:",
      brokers.length,
    );
  }

  // Filter brokers in memory for PSP features
  if (pspFeatures) {
    const selectedFeatures = pspFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "All");
    console.log("🔍 DEBUG: Filtering for PSP features:", pspFeatures);
    console.log("🔍 DEBUG: Selected PSP Features:", selectedFeatures);
    console.log("🔍 DEBUG: Total brokers before PSP filter:", brokers.length);

    brokers = brokers.filter((broker) => {
      if (selectedFeatures.length === 0) return true;

      const brokerMatches = selectedFeatures.some((selectedFeat) => {
        console.log(
          `🔍 DEBUG: Checking broker ${broker.broker_name} for feature: ${selectedFeat}`,
        );
        switch (selectedFeat) {
          case "auto_fiat_conversion":
            console.log(
              `🔍 DEBUG: auto_fiat_conversion for ${broker.broker_name}: ${broker.auto_fiat_conversion}`,
            );
            return broker.auto_fiat_conversion === true;
          case "instant_settlement":
            const settlementType = broker.settlement_time?.toLowerCase();
         
            return settlementType?.includes("Instant") || false;
          case "invoice_payments":
           
            return broker.checkout_page === true;
          case "recurring_billing":
            console.log(
              `🔍 DEBUG: recurring_billing for ${broker.broker_name}: (no direct field)`,
            );
            return false; // No direct field found, skipping
          case "chargeback_protection":
          
            return false; // No direct field found, skipping
          default:
            return false;
        }
      });
     
      return brokerMatches;
    });
   
  }

  // Filter brokers in memory for platform type
  if (platformType && platformType !== "All") {
   
    brokers = brokers.filter((broker) => {
      const platformTypes = broker.platform_type || [];
      return platformTypes.some(
        (type) => type.toLowerCase() === platformType.toLowerCase(),
      );
    });

  }

  // Filter brokers in memory for prop firm
  if (propFirm && propFirm !== "all") {

    brokers = brokers.filter((broker) => {
      const propFirmSupport = broker.prop_firm_support || [];
      if (propFirm === "supported") {
        return propFirmSupport.some((support) =>
          support.toLowerCase().includes("supported"),
        );
      } else if (propFirm === "not_supported") {
        return propFirmSupport.some((support) =>
          support.toLowerCase().includes("not supported"),
        );
      }
      return true;
    });
   
  }

  // Filter brokers in memory for deployment
  if (deployment && deployment !== "All") {
    brokers = brokers.filter((broker) => {
      const deployments = broker.deployment_type || [];

      // Split deployment filter by comma and check if any match
      const selectedDeployments = deployment
        .split(",")
        .map((d) => d.toLowerCase().trim());

      const hasMatch = deployments.some((dep: string) => {
        const depClean = dep.toLowerCase().trim();
        const match = selectedDeployments.includes(depClean);
     
        return match;
      });

      return hasMatch;
    });
   
  }

  // Filter brokers in memory for best for
  if (bestFor && bestFor !== "All") {
   
    brokers = brokers.filter((broker) => {
      const bestForArray = broker.bestFor || [];
      if (bestFor === "Both") {
        return (
          bestForArray.some((item: string) =>
            item.toLowerCase().includes("brokers"),
          ) &&
          bestForArray.some((item: string) =>
            item.toLowerCase().includes("prop firms"),
          )
        );
      } else if (bestFor === "Brokers") {
        return bestForArray.some((item: string) =>
          item.toLowerCase().includes("brokers"),
        );
      } else if (bestFor === "Prop Firms") {
        return bestForArray.some((item: string) =>
          item.toLowerCase().includes("prop firms"),
        );
      }
      return true;
    });
  
  }

  // Filter brokers in memory for platform features
  if (platformFeatures) {
    const selectedFeatures = platformFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "All");
   
    brokers = brokers.filter((broker) => {
      return selectedFeatures.some((selectedFeature) => {
        switch (selectedFeature) {
          case "TradingView Charts":
            const chartingTools = broker.charting_tools || [];
            return chartingTools.some((tool: string) =>
              tool.toLowerCase().trim().includes("trading view"),
            );
          case "MT5 Backend":
            return broker.mt5_backend === true;
          case "ECN Execution":
            // Check if execution_types contains ECN
            const executionTypes = broker.execution_types
              ? broker.execution_types.split(",").map((e) => e.trim())
              : [];
            return executionTypes.some((type: string) =>
              type.toLowerCase().includes("ecn"),
            );
          case "Algo Trading":
            // Check if features array contains algo trading
            const features = broker.features || [];
            return features.some((feature: string) =>
              feature.toLowerCase().includes("algo"),
            );
          case "Demo Available":
            return broker.demoAccount === true;
          default:
            return false;
        }
      });
    });
   
  }

  // Filter brokers in memory for settlement currency
  if (settlementCurrency) {
    const selectedCurrencies = settlementCurrency
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "All");
 
    brokers = brokers.filter((broker) => {
      if (selectedCurrencies.length === 0) return true;

      const brokerFiatCurrencies =
        broker.fiat_currencies?.split(",").map((c) => c.trim()) || [];
      return selectedCurrencies.some((selectedCurr) =>
        brokerFiatCurrencies.some(
          (curr) => curr.toLowerCase() === selectedCurr.toLowerCase(),
        ),
      );
    });
  
  }

  // Filter brokers in memory for integration type
  if (integrationType) {
    const selectedIntegrationTypes = integrationType
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "All");
  
    brokers = brokers.filter((broker) => {
      if (selectedIntegrationTypes.length === 0) return true;

      const brokerIntegrationTypes = broker.integration_type || [];
      return selectedIntegrationTypes.some((selectedInt) =>
        brokerIntegrationTypes.some(
          (int) => int.toLowerCase() === selectedInt.toLowerCase(),
        ),
      );
    });
    
  }

  // Filter brokers in memory for PSP features
  if (pspFeatures) {
    const selectedFeatures = pspFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "All");

    brokers = brokers.filter((broker) => {
      if (selectedFeatures.length === 0) return true;

      const brokerMatches = selectedFeatures.every((selectedFeat) => {
        switch (selectedFeat) {
          case "auto_fiat_conversion":
            return broker.auto_fiat_conversion === true;
          case "instant_settlement":
            const settlementTime = broker.settlement_time;
           

            if (!settlementTime) return false;

            const settlementParts = settlementTime
              .split("/")
              .map((part) => part.trim());
            const hasInstantSettlement = settlementParts.some((part) =>
              part.toLowerCase().includes("instant"),
            );

        

            return hasInstantSettlement;
          case "invoice_payments":
          
            return broker.checkout_page === true;
          case "recurring_billing":
          
            return false; // No direct field found, skipping
          case "chargeback_protection":
            return false; // No direct field found, skipping
          default:
            return false;
        }
      });

      return brokerMatches;
    });
  }

  // Apply pagination after filtering
  const hasFilters = !!(
    regulators ||
    platforms ||
    features ||
    skillLevel ||
    learningFormat ||
    pricing ||
    educationFeatures ||
    locationLanguage ||
    solutionType ||
    compatiblePlatform ||
    targetClient ||
    hqRegion ||
    regulation ||
    assetClass ||
    executionType ||
    providerType ||
    paymentType ||
    settlementCurrency ||
    integrationType ||
    pspFeatures ||
    platformType ||
    propFirm ||
    deployment ||
    bestFor ||
    platformFeatures
  );
  const total = hasFilters ? brokers.length : totalCount;
  const paginatedBrokers = brokers.slice(skip, skip + take);

  return { brokers: paginatedBrokers, total, page, perPage };
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
      reviews: {
        orderBy: { createdAt: "desc" },
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
export const findRandomTradingPlatforms = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "trading" },
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
export const findRandomAlgoProviders = async (
  take: number = 3,
  excludeSlug?: string,
) => {
  "use cache";

  cacheTag("brokers");
  cacheLife("minutes");

  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "botprovider" },
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
      slug: true,
      broker_name: true,
      logoUrl: true,
      type: true,
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
    slug: broker.slug,
    name: broker.broker_name || "Unknown Broker",
    logoUrl: broker.logoUrl,
    typeSlug: broker.type?.slug,
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
      slug: true,
      logoUrl: true,
      trading_platforms: true,
      features: true,
      demoAccount: true,
      api_access: true,
      deployment_type: true,
      starting_price: true,
      bestFor: true,
      overall_rating: true,
      type: {
        select: { slug: true },
      },
    },
    take,
  });

  return rawBrokers.map((broker) => ({
    id: broker.id,
    name: broker.broker_name || "Unknown CRM",
    slug: broker.slug,
    typeSlug: broker.type?.slug,
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
        value:
          broker.bestFor && broker.bestFor.length > 0
            ? broker.bestFor?.join(", ")
            : "-",
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

export const findForexEducationProvidersForComparison = async (
  take: number = 20,
) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "educationplatforms" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      slug: true,
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
      type: {
        select: { slug: true },
      },
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
        value:
          broker.pricingModel && broker.pricingModel.length > 0
            ? broker.pricingModel.join("/")
            : "-",
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
      slug: true,
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
      type: {
        select: { slug: true },
      },
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
        value:
          (broker.pricingModel &&
            broker.pricingModel?.length > 0 &&
            broker.pricingModel.join("/")) ||
          "-",
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

export const findLiquidityProvidersForComparison = async (
  take: number = 20,
) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "liquidity" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      slug: true,
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
      type: {
        select: { slug: true },
      },
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
        value:
          broker.asset_classes && broker.asset_classes.length > 0
            ? broker.asset_classes.length > 2
              ? `${broker.asset_classes.slice(0, 2).join(", ")}, +${broker.asset_classes.length - 2} others`
              : broker.asset_classes.join(", ")
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
        value:
          broker.target_clients && broker.target_clients.length > 0
            ? (() => {
                const mapped = broker.target_clients.map((t) => {
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
        value:
          (broker.pricingModel &&
            broker.pricingModel?.length > 0 &&
            broker.pricingModel.join("/")) ||
          "-",
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
        select: { slug: true },
      },
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
        value:
          broker.target_clients && broker.target_clients.length > 0
            ? broker.target_clients.length > 3
              ? `${broker.target_clients.slice(0, 3).join(", ")}, +${broker.target_clients.length - 3} others`
              : broker.target_clients.join(", ")
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
        value:
          broker.integration_type && broker.integration_type.length > 0
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
export const findAlgoProvidersForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "botprovider" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      slug: true,
      logoUrl: true,
      bot_type: true,
      strategy_type: true,
      automation_level: true,
      trading_platforms: true,
      win_rate: true,
      verified_performance: true,
      pricingModel: true,
      starting_price: true,
      free_trial_available: true,
      demoAccount: true,
      bestFor: true,
      minimum_deposit: true,
      trades_per_day: true,
      nfa_fifo: true,
      overall_rating: true,
      type: {
        select: { slug: true },
      },
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
        label: "Bot type",
        value: broker.bot_type?.replace(/\s*\(.*?\)/g, "") || "-",
        type: "text",
      },
      {
        label: "Strategy",
        value:
          broker.strategy_type && broker.strategy_type.length > 0
            ? broker.strategy_type
                .map((s) => s.replace(/\s*\(.*?\)/g, ""))
                .join(", ")
            : "-",
        type: "text",
      },
      {
        label: "Automation level",
        value: broker.automation_level || "-",
        type: broker.automation_level?.toLowerCase().includes("fully")
          ? "badge-success"
          : broker.automation_level
            ? "badge-warning"
            : "text",
      },
      {
        label: "Compatible platforms",
        value: broker.trading_platforms
          ? (() => {
              const platformList = broker.trading_platforms
                .split(",")
                .map((r: string) => r.replace(/\s*\(.*?\)/g, "").trim())
                .filter(Boolean);
              if (platformList.length <= 2) return platformList.join(", ");
              return `${platformList.slice(0, 2).join(", ")}, +${platformList.length - 2} others`;
            })()
          : "-",
        type: "text",
      },
      {
        label: "Win rate",
        value: broker.win_rate || "-",
        type: "text",
      },
      {
        label: "Verified performance",
        value: broker.verified_performance || "No",
        type:
          broker.verified_performance && broker.verified_performance !== "No"
            ? "badge-success"
            : "badge-danger",
      },
      {
        label: "Pricing model",
        value:
          broker.pricingModel && broker.pricingModel.length > 0
            ? broker.pricingModel.join("/")
            : "-",
        type: "text",
      },
      {
        label: "Price",
        value: broker.starting_price || "-",
        type: "text",
      },
      {
        label: "Free trial",
        value: broker.free_trial_available
          ? "Yes"
          : broker.demoAccount
            ? "Demo only"
            : "No",
        type: broker.free_trial_available
          ? "badge-dark"
          : broker.demoAccount
            ? "badge-warning"
            : "badge-danger",
      },
      {
        label: "Best for",
        value:
          broker.bestFor && broker.bestFor.length > 0
            ? broker.bestFor.join(" + ")
            : "-",
        type: "text",
      },
      {
        label: "Min deposit",
        value: broker.minimum_deposit || "-",
        type: "text",
      },
      {
        label: "Trades/day",
        value: broker.trades_per_day || "-",
        type: "text",
      },
      {
        label: "NFA/FIFO compatible",
        value: broker.nfa_fifo ? "Yes" : "No",
        type: broker.nfa_fifo ? "badge-success" : "badge-danger",
      },
      {
        label: "Score",
        value: broker.overall_rating || "0",
        type: "star",
      },
    ],
  }));
};

export const findTradingPlatformsForComparison = async (take: number = 20) => {
  const whereClause: Prisma.BrokersWhereInput = {
    status: ToolStatus.Published,
    type: { slug: "trading" },
  };

  const rawBrokers = await db.brokers.findMany({
    where: whereClause,
    select: {
      id: true,
      broker_name: true,
      slug: true,
      logoUrl: true,
      platform_type: true,
      bestFor: true,
      white_label_price: true,
      server_license: true,
      deployment_type: true,
      charting_tools: true,
      mt5_backend: true,
      prop_firm_support: true,
      setup_time: true,
      yearly_commitment: true,
      hosting_included: true,
      demoAccount: true,
      clients_count: true,
      overall_rating: true,
      type: {
        select: { slug: true },
      },
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
        label: "Platform type",
        value: broker.platform_type?.join(" / ") || "-",
        type: "text",
      },
      {
        label: "Best for",
        value:
          broker.bestFor && broker.bestFor.length > 0
            ? broker.bestFor?.join(", ")
            : "-",
        type: "text",
      },
      {
        label: "White label price",
        value: broker.white_label_price || "-",
        type: "text",
      },
      {
        label: "Server licence",
        value: broker.server_license || "-",
        type: "text",
      },
      {
        label: "Deployment",
        value: broker.deployment_type?.join(", ") || "-",
        type: "text",
      },
      {
        label: "Charting",
        value: broker.charting_tools?.join(" + ") || "-",
        type: "text",
      },
      {
        label: "MT5 backend",
        value: broker.mt5_backend ? "Supported" : "No",
        type: broker.mt5_backend ? "badge-success" : "badge-danger",
      },
      {
        label: "Prop firm tools",
        value: broker.prop_firm_support?.join(", ") || "-",
        type: "text",
      },
      {
        label: "Setup time",
        value: broker.setup_time || "-",
        type: "text",
      },
      {
        label: "Yearly commitment",
        value: broker.yearly_commitment ? "Required" : "Not required",
        type: broker.yearly_commitment ? "badge-danger" : "badge-success",
      },
      {
        label: "Hosting included",
        value: broker.hosting_included ? "Yes" : "No",
        type: broker.hosting_included ? "badge-success" : "badge-danger",
      },
      {
        label: "Demo available",
        value: broker.demoAccount ? "Yes" : "No",
        type: broker.demoAccount ? "badge-success" : "badge-danger",
      },
      {
        label: `Clients (${new Date().getFullYear()})`,
        value: broker.clients_count || "-",
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
