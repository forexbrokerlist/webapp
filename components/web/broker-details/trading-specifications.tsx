import React from 'react'
import PlatformFeatures from './platform-features';
import ProsCons from './pros-cons';
import TopicsSkillsSection from '../forex-trading-course-details/topics-skills-section';
import BestSuitedFor from '../forex-bridge-provider-details/bestSuitedFor';

const RoundIcon = '/assets/images/round.svg';

export default function TradingSpecifications({ broker, showTradingHours = true, showAccountFunding = true, accountFundingHeading="Account Funding", accountFundingDetails, tradingSpreadsHeading="Trading Costs & Spreads", tradingSpreadsDetails, showTradingSpreads = true,showStarRatings = true, showFeatures = false, platformSectionId = "platform-&-features",showSkills=false,bridgeTitle,showBestSuitedFor=false }: { broker: any, showTradingHours?: boolean, showAccountFunding?: boolean, accountFundingHeading?: string, accountFundingDetails?: any[], tradingSpreadsHeading?: string, tradingSpreadsDetails?: any[], showTradingSpreads?: boolean,showStarRatings?: boolean, showFeatures?: boolean, platformSectionId?: string,showSkills?:boolean,bridgeTitle?:string,showBestSuitedFor?:boolean,showAccountFounding?:string}) {
    const tradingHoursRaw = broker.trading_hours;
    let tradingHours: { label: string, value: string }[] = [];

    try {
        if (tradingHoursRaw) {
            const parsed = typeof tradingHoursRaw === 'string' ? JSON.parse(tradingHoursRaw) : tradingHoursRaw;
            if (Array.isArray(parsed)) {
                tradingHours = parsed.map((item: any) => ({
                    label: item.asset_class || item.label || "-",
                    value: item.from && item.to ? `${item.from} - ${item.to}` : (item.value || "-")
                }));
            }
        }
    } catch (e) {
        console.error("Error parsing trading hours:", e);
    }

    // Fallback if no data is found
    if (tradingHours.length === 0) {
        tradingHours = [
            { label: "Currency Pairs", value: "Mon 00:00-Sat 00:00" },
            { label: "Crude Oil", value: "Mon 01:00 Fri 23:59" },
            { label: "Metals", value: "Mon 01:00 Fri 23:59" },
            { label: "Stocks", value: "Mon 10:00-Fri 22:55" },
            { label: "Commodities", value: "Mon 01:00-Fri 23:59" },
            { label: "Gold", value: "Mon 01:00- Fri 23:59" },
            { label: "Equity Indices", value: "Mon 00:01-Fri 23:59" },
            { label: "ETFS", value: "Mon 16:31-Fri 22:55" },
        ];
    }

    const half = Math.ceil(tradingHours.length / 2);
    const col1 = tradingHours.slice(0, half);
    const col2 = tradingHours.slice(half);

    const accountFunding = accountFundingDetails || [
        { label: "Account Types", value: broker.accountTypes?.join(", ") || "-", isNew: true },
        { label: "Deposit Fee", value: broker.deposit_fees || "-", isPositive: parseFloat(broker.deposit_fees?.replace(/[^0-9.]/g, '') || '0') > 0 },
        { label: "Withdrawal Fee", value: broker.withdrawal_fee || "-", isPositive: parseFloat(broker.withdrawal_fee?.replace(/[^0-9.]/g, '') || '0') > 0 },
        { label: "Deposit Methods", value: broker.deposit_options || "-" },
        { label: "Inactivity Fee", value: broker.inactivity_fee || "-" },
    ];

    const tradingCostSpreads = tradingSpreadsDetails || [
        { label: "EUR/USD", value: broker.average_trading_cost_eur_usd || "-", isNew: true, },
        { label: "GBP/USD", value: broker.average_trading_cost_gbp_usd || "-", },
        { label: "Gold", value: broker.average_trading_cost_gold || "-", },
        { label: "Bitcoin", value: broker.average_trading_cost_bitcoin || "-", },
        { label: "WTI Crude", value: broker.average_trading_cost_wti_crude_oil || "-", },
    ];

    return (
        <div id='trading-specifications' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    Trading Specifications
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-2 gap-5'>

                    {/* Trading Hours */}
                    {showTradingHours && <div className='col-span-2 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                Trading Hours:
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2 grid grid-cols-[1fr_1px_1fr] gap-6'>
                            <div>
                                {col1.map((detail: any, index: number) => (
                                    <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        </div>
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='bg-border-light300 my-2'></div>
                            <div>
                                {col2.map((detail: any, index: number) => (
                                    <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        </div>
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    }
                    {/* Account Funding */}
                    {showAccountFunding && <div className='col-span-1 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                {accountFundingHeading}
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {accountFunding.map((detail: any, index: number) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {/* {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )} */}
                                    </div>
                                    {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                    ) : (
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    }
                    {/* Trading Cost & Spreads */}
                    {showTradingSpreads && <div className='col-span-1 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                {tradingSpreadsHeading}
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {tradingCostSpreads.map((detail: any, index: number) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {/* {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )} */}
                                    </div>
                                    {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                    ) : (
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>}

                </div>
            </div>

            <div id={platformSectionId} className='px-4'>
           {showSkills&&       <div id="topics-skills">
                                            <TopicsSkillsSection broker={broker} />
                                        </div>
            }    {!showSkills && !showBestSuitedFor && <PlatformFeatures bridgeTitle={bridgeTitle} broker={broker} showStarRatings={showStarRatings} showFeatures={showFeatures} />}
            {!showSkills&&showBestSuitedFor&&broker?.best_suited_for.length>0&&
            <BestSuitedFor bridgeTitle={bridgeTitle} broker={broker} showStarRatings={showStarRatings} showFeatures={showFeatures} />
            }
                <div className='pt-4'>
                    <ProsCons broker={broker} />
                </div>
            </div>

        </div>
    )
}
