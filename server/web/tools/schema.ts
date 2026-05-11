import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { adsConfig } from "~/config/ads";

export const toolFilterParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(
    36 - (adsConfig.enabled ? adsConfig.adsPerPage : 0),
  ),
  category: parseAsString.withDefault(""),
  regulators: parseAsString.withDefault(""),
  platforms: parseAsString.withDefault(""),
  rating: parseAsString.withDefault(""),
  features: parseAsString.withDefault(""),
  // Forex Education specific fields
  skillLevel: parseAsString.withDefault(""),
  learningFormat: parseAsString.withDefault(""),
  pricing: parseAsString.withDefault(""),
  educationFeatures: parseAsString.withDefault(""),
  locationLanguage: parseAsString.withDefault(""),
  // Bridge & Plugin specific fields
  solutionType: parseAsString.withDefault(""),
  compatiblePlatform: parseAsString.withDefault(""),
  targetClient: parseAsString.withDefault(""),
  hqRegion: parseAsString.withDefault(""),
  // Liquidity Partner specific fields
  regulation: parseAsString.withDefault(""),
  assetClass: parseAsString.withDefault(""),
  executionType: parseAsString.withDefault(""),
  providerType: parseAsString.withDefault(""),
};

export const toolFilterParamsCache = createSearchParamsCache(toolFilterParams);

export type ToolFilterSchema = typeof toolFilterParams;
export type ToolFilterParams = inferParserType<typeof toolFilterParams>;
