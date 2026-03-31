"use client"

import { useRef, useEffect } from "react"
import { Boxes, ChartColumn, FileText, Layers, Loader2, Lightbulb, AlertTriangle, Building2, Clock } from "lucide-react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/web/ui/accordion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ContentPanelProps {
  fullReport?: string | null
  selectedShortReport?: string | null
  rawResponse?: any
  isLoading?: boolean
  blogLoading?: boolean
  scrollToTopSignal?: number
  handleGenerateBlog?: (data: string) => void
}

export function ContentPanel({
  fullReport,
  rawResponse,
  isLoading = false,
  blogLoading = false,
  scrollToTopSignal,
  selectedShortReport,
  handleGenerateBlog,
}: ContentPanelProps) {
  const scrollContentRef = useRef<HTMLDivElement>(null)

  // Scroll to top when scrollToTopSignal changes
  useEffect(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [scrollToTopSignal])

  // Download handler
  const handleDownload = () => {
    if (!fullReport) {
      console.log('No report available for download')
      return
    }

    let content = ''

    if (rawResponse) {
      // Format structured data as a readable report
      content = formatStructuredReport(rawResponse)
    } else {
      // Use the fullReport text (markdown)
      content = fullReport
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "market-analysis-report.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Helper function to format structured data into a readable report
  const formatStructuredReport = (data: any): string => {
    let report = '='.repeat(60) + '\n'
    report += '           FOREX MARKET ANALYSIS REPORT\n'
    report += '='.repeat(60) + '\n\n'

    const formatDate = () => new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    report += `Generated on: ${formatDate()}\n`
    report += '='.repeat(60) + '\n\n'

    // Market Analysis Section
    if (data.overall_trend) {
      report += '📈 MARKET ANALYSIS\n'
      report += '-'.repeat(30) + '\n'
      report += `Overall Trend: ${data.overall_trend?.trend_type || 'N/A'}\n`
      if (data.overall_trend?.confidence) {
        report += `Confidence Level: ${data.overall_trend.confidence}\n`
      }
      report += '\n'
    }

    // Market Structure Section
    if (data.market_structure) {
      report += '🏗️ MARKET STRUCTURE\n'
      report += '-'.repeat(30) + '\n'
      if (data.market_structure.current_structure) {
        report += `Current Structure: ${data.market_structure.current_structure}\n`
      }
      if (data.market_structure.key_levels) {
        report += `Key Levels: ${data.market_structure.key_levels}\n`
      }
      if (data.market_structure.breakout_potential) {
        report += `Breakout Potential: ${data.market_structure.breakout_potential}\n`
      }
      report += '\n'
    }

    // Support & Resistance Section
    if (data.support_and_resistance) {
      report += '📊 SUPPORT & RESISTANCE LEVELS\n'
      report += '-'.repeat(40) + '\n'

      if (data.support_and_resistance.support_levels) {
        report += '\nSUPPORT LEVELS:\n'
        if (Array.isArray(data.support_and_resistance.support_levels)) {
          data.support_and_resistance.support_levels.forEach((level: any, index: number) => {
            const value = typeof level === 'object' ?
              level.level_description || level.price || level.level || level.value || JSON.stringify(level) :
              level
            report += `  ${index + 1}. ${value}\n`
          })
        } else {
          report += `  ${data.support_and_resistance.support_levels}\n`
        }
      }

      if (data.support_and_resistance.resistance_levels) {
        report += '\nRESISTANCE LEVELS:\n'
        if (Array.isArray(data.support_and_resistance.resistance_levels)) {
          data.support_and_resistance.resistance_levels.forEach((level: any, index: number) => {
            const value = typeof level === 'object' ?
              level.level_description || level.price || level.level || level.value || JSON.stringify(level) :
              level
            report += `  ${index + 1}. ${value}\n`
          })
        } else {
          report += `  ${data.support_and_resistance.resistance_levels}\n`
        }
      }
      report += '\n'
    }

    // Supply & Demand Zones Section
    if (data.supply_and_demand_zones) {
      report += '📦 SUPPLY & DEMAND ZONES\n'
      report += '-'.repeat(35) + '\n'

      if (data.supply_and_demand_zones.supply_zones) {
        report += '\nSUPPLY ZONES:\n'
        if (Array.isArray(data.supply_and_demand_zones.supply_zones)) {
          data.supply_and_demand_zones.supply_zones.forEach((zone: any, index: number) => {
            const value = typeof zone === 'object' && zone.zone_location ?
              `Zone at ${zone.zone_location}` :
              typeof zone === 'object' && zone.rejection_evidence ?
                `Rejection: ${zone.rejection_evidence}` :
                typeof zone === 'object' ? JSON.stringify(zone) :
                  zone
            report += `  ${index + 1}. ${value}\n`
          })
        } else {
          report += `  ${data.supply_and_demand_zones.supply_zones}\n`
        }
      }

      if (data.supply_and_demand_zones.demand_zones) {
        report += '\nDEMAND ZONES:\n'
        if (Array.isArray(data.supply_and_demand_zones.demand_zones)) {
          data.supply_and_demand_zones.demand_zones.forEach((zone: any, index: number) => {
            const value = typeof zone === 'object' && zone.zone_location ?
              `Zone at ${zone.zone_location}` :
              typeof zone === 'object' && zone.rejection_evidence ?
                `Rejection: ${zone.rejection_evidence}` :
                typeof zone === 'object' ? JSON.stringify(zone) :
                  zone
            report += `  ${index + 1}. ${value}\n`
          })
        } else {
          report += `  ${data.supply_and_demand_zones.demand_zones}\n`
        }
      }
      report += '\n'
    }

    // Recommendations Section
    if (data.recommendations) {
      report += '💡 TRADING RECOMMENDATIONS\n'
      report += '-'.repeat(35) + '\n'
      if (Array.isArray(data.recommendations)) {
        data.recommendations.forEach((rec: any, index: number) => {
          const recommendation = rec.action || rec.text || rec
          report += `  ${index + 1}. ${recommendation}\n`
        })
      } else {
        report += `  ${data.recommendations}\n`
      }
      report += '\n'
    }

    // Risk Factors Section
    if (data.risk_factors) {
      report += '⚠️ RISK FACTORS\n'
      report += '-'.repeat(25) + '\n'
      if (Array.isArray(data.risk_factors)) {
        data.risk_factors.forEach((risk: any, index: number) => {
          const riskFactor = risk.factor || risk.text || risk
          report += `  ${index + 1}. ${riskFactor}\n`
        })
      } else {
        report += `  ${data.risk_factors}\n`
      }
      report += '\n'
    }

    // Time Horizon Section
    if (data.time_horizon) {
      report += '⏰ TIME HORIZON\n'
      report += '-'.repeat(25) + '\n'
      report += `Recommended Timeframe: ${data.time_horizon}\n\n`
    }

    report += '='.repeat(60) + '\n'
    report += '           END OF REPORT\n'
    report += '='.repeat(60) + '\n'
    report += '\nDisclaimer: This report is generated by AI and should be used\n'
    report += 'for informational purposes only. Always conduct your own\n'
    report += 'research before making trading decisions.\n'

    return report
  }

  // Structured Market Analysis Component
  const StructuredMarketAnalysis = ({ data }: { data: any }) => {
    if (!data || typeof data !== 'object') {
      console.log('StructuredMarketAnalysis: No data or invalid data', data)
      return null
    }

    // Check if data is empty object
    const isEmpty = Object.keys(data).length === 0
    if (isEmpty) {
      console.log('StructuredMarketAnalysis: Empty data object received')
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No analysis data available. Please try generating a new report.</p>
        </div>
      )
    }

    const extractValue = (item: any) => {
      if (typeof item === 'string') return item
      if (typeof item === 'object') {
        return item.level_description || item.price || item.level || item.value ||
          (item.zone_location && `Zone at ${item.zone_location}`) ||
          JSON.stringify(item)
      }
      return String(item)
    }

    return (
      <div className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {/* Market Analysis */}
          {data.overall_trend && (
            <AccordionItem value="market-analysis">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Layers size={20} />
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-100">Market Analysis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Overall Trend:</span>
                    <span className="text-blue-700 dark:text-blue-300">{data.overall_trend?.trend_type || 'N/A'}</span>
                  </div>
                  {data.overall_trend?.confidence && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-800 dark:text-blue-200">Confidence:</span>
                      <span className="text-blue-700 dark:text-blue-300">{data.overall_trend.confidence}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Market Structure */}
          {data.market_structure && (
            <AccordionItem value="market-structure">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 size={20} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-lg font-bold text-purple-900 dark:text-purple-100">Market Structure</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {data.market_structure.current_structure && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-800 dark:text-purple-200">Current Structure:</span>
                      <span className="text-purple-700 dark:text-purple-300">{data.market_structure.current_structure}</span>
                    </div>
                  )}
                  {data.market_structure.key_levels && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-800 dark:text-purple-200">Key Levels:</span>
                      <span className="text-purple-700 dark:text-purple-300">{data.market_structure.key_levels}</span>
                    </div>
                  )}
                  {data.market_structure.breakout_potential && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-800 dark:text-purple-200">Breakout Potential:</span>
                      <span className="text-purple-700 dark:text-purple-300">{data.market_structure.breakout_potential}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Support & Resistance */}
          {data.support_and_resistance && (
            <AccordionItem value="support-resistance">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ChartColumn size={20} />
                  <span className="text-lg font-bold text-green-900 dark:text-green-100">Support & Resistance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {data.support_and_resistance.support_levels && (
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Support Levels:</h4>
                      <div className="space-y-1">
                        {Array.isArray(data.support_and_resistance.support_levels)
                          ? data.support_and_resistance.support_levels.map((level: any, index: number) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                              {extractValue(level)}
                            </div>
                          ))
                          : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.support_and_resistance.support_levels}</div>
                        }
                      </div>
                    </div>
                  )}
                  {data.support_and_resistance.resistance_levels && (
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Resistance Levels:</h4>
                      <div className="space-y-1">
                        {Array.isArray(data.support_and_resistance.resistance_levels)
                          ? data.support_and_resistance.resistance_levels.map((level: any, index: number) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                              {extractValue(level)}
                            </div>
                          ))
                          : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.support_and_resistance.resistance_levels}</div>
                        }
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Supply & Demand Zones */}
          {data.supply_and_demand_zones && (
            <AccordionItem value="supply-demand">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Boxes size={20} />
                  <span className="text-lg font-bold text-orange-900 dark:text-orange-100">Supply & Demand Zones</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {data.supply_and_demand_zones.supply_zones && (
                    <div>

                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Supply Zones:</h4>
                      <div className="space-y-1">
                        {Array.isArray(data.supply_and_demand_zones.supply_zones)
                          ? data.supply_and_demand_zones.supply_zones.map((zone: any, index: number) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                              {typeof zone === 'object' && zone.zone_location ? `Zone at ${zone.zone_location}` :
                                typeof zone === 'object' && zone.rejection_evidence ? `Rejection: ${zone.rejection_evidence}` :
                                  extractValue(zone)}
                            </div>
                          ))
                          : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.supply_and_demand_zones.supply_zones}</div>
                        }
                      </div>
                    </div>
                  )}
                  {data.supply_and_demand_zones.demand_zones && (
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Demand Zones:</h4>
                      <div className="space-y-1">
                        {Array.isArray(data.supply_and_demand_zones.demand_zones)
                          ? data.supply_and_demand_zones.demand_zones.map((zone: any, index: number) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                              {typeof zone === 'object' && zone.zone_location ? `Zone at ${zone.zone_location}` :
                                typeof zone === 'object' && zone.acceptance_evidence ? `Acceptance: ${zone.acceptance_evidence}` :
                                  extractValue(zone)}
                            </div>
                          ))
                          : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.supply_and_demand_zones.demand_zones}</div>
                        }
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Fair Value Gaps */}
          {data.fair_value_gaps && data.fair_value_gaps.length > 0 && (
            <AccordionItem value="fair-value-gaps">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🕳️</span>
                  <span className="text-lg font-bold text-cyan-900 dark:text-cyan-100">Fair Value Gaps</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {data.fair_value_gaps.map((fvg: any, index: number) => (
                    <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                      <strong>FVG {index + 1}:</strong> {fvg.range || fvg.level || 'N/A'}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Recommendations */}
          {data.recommendations && (
            <AccordionItem value="recommendations">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb size={20} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-lg font-bold text-yellow-900 dark:text-yellow-100">Recommendations</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {Array.isArray(data.recommendations)
                    ? data.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                        {index + 1}. {rec.action || rec.text || rec}
                      </div>
                    ))
                    : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.recommendations}</div>
                  }
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Risk Factors */}
          {data.risk_factors && (
            <AccordionItem value="risk-factors">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                  <span className="text-lg font-bold text-red-900 dark:text-red-100">Risk Factors</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {Array.isArray(data.risk_factors)
                    ? data.risk_factors.map((risk: any, index: number) => (
                      <div key={index} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                        • {risk.factor || risk.text || risk}
                      </div>
                    ))
                    : <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">{data.risk_factors}</div>
                  }
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Time Horizon */}
          {data.time_horizon && (
            <AccordionItem value="time-horizon">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Time Horizon</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                    <strong>Recommended Timeframe:</strong> {data.time_horizon}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background sm:bg-card/30 border-l border-border h-full min-h-[calc(100vh-(174px+var(--header-height)))] max-h-[calc(100vh-(174px+var(--header-height)))] overflow-hidden flex flex-col">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-20 p-5 border-b border-border/60 bg-background/60 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
              {fullReport ? "Market Analysis Report" : "Awaiting Analysis"}
            </h3>
            {fullReport && (
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Comprehensive Forex Insights</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="fancy"
              size="sm"
              className="rounded-2xl px-6 bg-linear-to-r from-indigo-500 to-blue-600 text-white border-none shadow-md shadow-indigo-500/10 hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-xs"
              onClick={handleDownload}
              disabled={!fullReport}
              prefix={<FileText className="h-3.5 w-3.5 mr-0.5" />}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-6" ref={scrollContentRef}>
          <Card className="border-0 shadow-none bg-transparent">
            <div className="p-0">
              <div className="prose text-base markdown-text prose-sm max-w-none dark:prose-invert">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  </div>
                ) : rawResponse ? (
                  <StructuredMarketAnalysis data={rawResponse} />
                ) : fullReport ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {fullReport}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-700">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                      <div className="relative bg-linear-to-b from-indigo-500/10 to-transparent p-8 rounded-full border border-indigo-500/10">
                        <FileText className="h-16 w-16 text-indigo-500/40" strokeWidth={1} />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Ready for Analysis</h4>
                    <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                      Select a currency pair in the chat and ask FxGURU for any market insights or professional analysis reports.
                    </p>
                    <div className="mt-8 flex gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/40"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/20"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/10"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
