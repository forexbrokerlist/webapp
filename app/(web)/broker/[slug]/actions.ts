"use server"

import { findBrokers } from "~/server/web/tools/queries"
import { getPresignedUrlFromFull } from "~/lib/media"

export async function searchBrokersAction(query: string) {
    const rawBrokers = await findBrokers({
        where: {
            type: { slug: "broker" },
            broker_name: { contains: query, mode: 'insensitive' }
        },
        take: 50
    });

    return Promise.all(rawBrokers.map(async (broker) => ({
        id: broker.id,
        name: broker.broker_name || "Unknown Broker",
        logoUrl: await getPresignedUrlFromFull(broker.logoUrl),
        stats: [
            { label: "Min Deposit", value: broker.minimum_deposit || "N/A", type: "text" },
            { label: "Raw Spread", value: broker.minimum_raw_spreads || "N/A", type: "text" },
            { label: "Max Leverage", value: broker.maxLeverage || "N/A", type: "text" },
            { label: "Regulations", value: broker.regulators ? (() => {
                const regList = broker.regulators.split(',')
                    .map((r: string) => r.replace(/\s*\(.*?\)/g, '').trim())
                    .filter(Boolean)
                     .filter(r => r.toLowerCase() !== 'other');
                if (regList.length <= 3) return regList.join(', ');
                return `${regList.slice(0, 3).join(', ')}, +${regList.length - 3} others`;
            })() : "None", type: "text" },
            { label: "Platforms", value: broker.trading_platforms ? (() => {
                const platformList = broker.trading_platforms.split(',')
                    .map((r: string) => r.replace(/\s*\(.*?\)/g, '').trim())
                    .filter(Boolean)
                    .filter(r => r.toLowerCase() !== 'other');
                if (platformList.length <= 2) return platformList.join(', ');
                return `${platformList.slice(0, 2).join(', ')}, +${platformList.length - 2} others`;
            })() : "N/A", type: "text" },
            { label: "Islamic Acc", value: broker.islamicAccount ? "Yes" : "No", type: broker.islamicAccount ? "badge-dark" : "badge-danger" },
            { label: "Copy Trading", value: broker.copyTrading ? "Yes" : "No", type: broker.copyTrading ? "badge-dark" : "badge-danger" },
            { label: "Overall rating", value: broker.overall_rating || "0", type: "star" }
        ]
    })));
}
