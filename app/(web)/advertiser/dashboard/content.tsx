"use client"

import { DownloadIcon, EyeIcon, MousePointerClickIcon, TrendingUpIcon } from "lucide-react"
import { Button } from "~/components/common/button"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { cx } from "~/lib/utils"
import type { Ad } from "~/.generated/prisma/client"

interface AdvertiserStats {
  totalImpressions: number
  totalClicks: number
  ctr: number
  daysRemaining: number
  activeCampaigns: number
  totalCampaigns: number
}

interface AdvertiserDashboardContentProps {
  ads: Ad[]
  stats: AdvertiserStats
}

export const AdvertiserDashboardContent = ({ ads, stats }: AdvertiserDashboardContentProps) => {
  const downloadCSV = () => {
    const csvContent = [
      ["Campaign Name", "Type", "Status", "Impressions", "Clicks", "CTR", "Start Date", "End Date", "Days Remaining"],
      ...ads.map(ad => {
        const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00"
        const daysRemaining = Math.max(0, Math.ceil((new Date(ad.endsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        return [
          ad.name,
          ad.type,
          ad.status,
          ad.impressions.toString(),
          ad.clicks.toString(),
          `${ctr}%`,
          new Date(ad.startsAt).toLocaleDateString(),
          new Date(ad.endsAt).toLocaleDateString(),
          daysRemaining.toString(),
        ]
      }),
    ]
      .map(row => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `campaign-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description,
    trend 
  }: { 
    title: string
    value: string | number
    icon: any
    description?: string
    trend?: "up" | "down" | "neutral"
  }) => (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <div className="px-5">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        )}
      </div>
    </Card>
  )

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <H2>Campaign Analytics</H2>
        <Button onClick={downloadCSV} variant="secondary" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download CSV Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <StatCard
          title="Total Impressions"
          value={stats.totalImpressions.toLocaleString()}
          icon={EyeIcon}
          description="Across all campaigns"
        />
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={MousePointerClickIcon}
          description="Across all campaigns"
        />
        <StatCard
          title="CTR"
          value={`${stats.ctr}%`}
          icon={TrendingUpIcon}
          description="Click-through rate"
        />
        <StatCard
          title="Days Remaining"
          value={stats.daysRemaining}
          icon={TrendingUpIcon}
          description={`${stats.activeCampaigns} active campaign${stats.activeCampaigns !== 1 ? "s" : ""}`}
        />
      </div>

      {/* Campaigns Table */}
      <Card className="w-full">
        <CardHeader>
          <div className="text-lg font-semibold">Your Campaigns</div>
          <CardDescription>
            Performance metrics for all your advertising campaigns
          </CardDescription>
        </CardHeader>
        <div className="w-full">
          {ads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No campaigns found. Create your first campaign to see analytics here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">Type</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">Status</th>
                    <th className="text-right py-3 px-4 font-medium whitespace-nowrap">Impressions</th>
                    <th className="text-right py-3 px-4 font-medium whitespace-nowrap">Clicks</th>
                    <th className="text-right py-3 px-4 font-medium whitespace-nowrap">CTR</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => {
                    const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00"
                    const daysRemaining = Math.max(0, Math.ceil((new Date(ad.endsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    const isActive = ad.status === "Scheduled" && new Date() >= new Date(ad.startsAt) && new Date() <= new Date(ad.endsAt)
                    
                    return (
                      <tr key={ad.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{ad.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-xs">
                              {ad.description || "No description"}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                            {ad.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={cx(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              {
                                "bg-green-100 text-green-800": isActive,
                                "bg-yellow-100 text-yellow-800": ad.status === "Pending",
                                "bg-gray-100 text-gray-800": ad.status === "Draft",
                                "bg-red-100 text-red-800": new Date(ad.endsAt) < new Date(),
                              }
                            )}
                          >
                            {isActive ? "Active" : ad.status === "Draft" ? "Draft" : ad.status === "Pending" ? "Pending" : new Date(ad.endsAt) < new Date() ? "Expired" : "Scheduled"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">{ad.impressions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">{ad.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">{ctr}%</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={cx(
                            "text-sm",
                            {
                              "text-green-600": daysRemaining > 7,
                              "text-yellow-600": daysRemaining > 0 && daysRemaining <= 7,
                              "text-red-600": daysRemaining === 0,
                            }
                          )}>
                            {daysRemaining} days
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
