"use client";

import { Database, ExternalLink } from "lucide-react";

import {
    formatCategory,
    formatProvider,
} from "@/features/rewards/lib/format";
import { useRewardsData } from "@/features/rewards/lib/hooks";
import { RetailerLogo } from "@/features/rewards/components/RetailerLogo";
import type { Retailer, RewardRule } from "@/features/rewards/lib/types";

export function RulesReference() {
    const { retailers, rules, sourceStatus } = useRewardsData();

    return (
        <div className="space-y-5 sm:space-y-6">
            <div>
                <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
                    Reward rules
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-600">
                    These rules are generated from official UCount and
                    Discovery Miles source pages, with a checked-in fallback
                    snapshot when source sync is unavailable.
                </p>
            </div>

            <section className="grid grid-cols-1 gap-3 min-[28rem]:grid-cols-2 md:grid-cols-3">
                <SummaryCard label="Retailers" value={String(retailers.length)} />
                <SummaryCard label="Rules" value={String(rules.length)} />
                <SummaryCard
                    className="min-[28rem]:col-span-2 md:col-span-1"
                    label="Source mode"
                    value={sourceStatus.mode}
                />
            </section>

            <section className="rounded-[1.25rem] border-2 border-zinc-950 bg-white">
                <div className="flex items-start gap-3 border-b-2 border-zinc-950 px-4 py-4 sm:px-5">
                    <Database className="mt-0.5 size-5 shrink-0 text-[#ff4faf]" />
                    <div className="min-w-0">
                        <h2 className="font-black">Source-backed rule set</h2>
                        <p className="text-sm font-medium text-zinc-600">
                            {sourceStatus.message}
                        </p>
                    </div>
                </div>

                <div className="divide-y-2 divide-zinc-950">
                    {rules.map((rule) => {
                        const retailer = retailers.find(
                            (item) => item.id === rule.retailerId
                        );

                        return (
                            <RuleRow
                                key={rule.id}
                                retailerName={
                                    retailer?.name ?? rule.retailerId
                                }
                                retailer={retailer}
                                rule={rule}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function RuleRow({
    retailer,
    retailerName,
    rule,
}: {
    retailer?: Retailer;
    retailerName: string;
    rule: RewardRule;
}) {
    return (
        <article className="px-4 py-4 text-sm sm:px-5">
            <div className="flex items-center gap-3 md:hidden">
                {retailer ? (
                    <RetailerLogo retailer={retailer} size="sm" />
                ) : null}
                <div className="min-w-0">
                    <p className="font-black">{retailerName}</p>
                    <p className="mt-0.5 font-medium text-zinc-600">
                        {formatCategory(rule.category)}
                    </p>
                </div>
            </div>

            <div className="mt-3 grid gap-3 md:mt-0 md:grid-cols-[1.1fr_0.9fr_0.9fr_1.5fr] md:items-start md:gap-4">
                <div className="hidden md:block">
                    <div className="flex items-center gap-3">
                        {retailer ? (
                            <RetailerLogo retailer={retailer} size="sm" />
                        ) : null}
                        <div>
                            <p className="font-black">{retailerName}</p>
                            <p className="mt-1 font-medium text-zinc-600">
                                {formatCategory(rule.category)}
                            </p>
                        </div>
                    </div>
                </div>

                <RuleField
                    className="md:hidden"
                    label="Provider"
                    value={formatProvider(rule.provider)}
                />
                <RuleField
                    className="hidden md:block"
                    label="Provider"
                    value={
                        <>
                            <p className="font-black">
                                {formatProvider(rule.provider)}
                            </p>
                            <p className="mt-1 font-medium text-zinc-600">
                                {rule.rewardType}
                            </p>
                        </>
                    }
                />

                <RuleField
                    label="Reward"
                    value={
                        <>
                            <p className="font-black">{rule.maxRewardLabel}</p>
                            <p className="mt-1 font-medium text-zinc-600">
                                {rule.estimateMethod}
                            </p>
                        </>
                    }
                />

                <div>
                    <p className="text-xs font-black uppercase text-zinc-500 md:hidden">
                        Conditions
                    </p>
                    <p className="mt-1 font-medium leading-6 text-zinc-700 md:mt-0">
                        {rule.conditions?.join("; ") ?? "No condition noted"}
                    </p>
                    <a
                        className="touch-target mt-2 inline-flex min-h-11 items-center gap-1 font-black underline"
                        href={rule.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                    >
                        {rule.sourceName}
                        <ExternalLink className="size-3.5 shrink-0" />
                    </a>
                </div>
            </div>
        </article>
    );
}

function RuleField({
    className,
    label,
    value,
}: {
    className?: string;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className={className}>
            <p className="text-xs font-black uppercase text-zinc-500 md:hidden">
                {label}
            </p>
            <div className="mt-1 md:mt-0">{value}</div>
        </div>
    );
}

function SummaryCard({
    className,
    label,
    value,
}: {
    className?: string;
    label: string;
    value: string;
}) {
    return (
        <div
            className={`rounded-2xl border-2 border-zinc-950 bg-[#fff15a] p-4 shadow-[3px_3px_0_#18181b] sm:p-5 sm:shadow-[4px_4px_0_#18181b] ${className ?? ""}`}
        >
            <p className="text-xs font-black uppercase text-zinc-600">
                {label}
            </p>
            <p className="mt-2 text-xl font-black capitalize sm:text-2xl">
                {value}
            </p>
        </div>
    );
}
