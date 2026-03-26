import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { type Payment, PaymentStatus } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const paymentListParams = {
  email: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum(Object.values(PaymentStatus))).withDefault([]),
  gateway: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Payment>().withDefault([{ id: "createdAt", desc: true }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const paymentListSchema = createStandardSchemaV1(paymentListParams)
export type PaymentListParams = inferParserType<typeof paymentListParams>
