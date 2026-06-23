"use client";

import Link from "next/link";
import {
    BadgeCheck,
    Brain,
    ReceiptText,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    formatCategory,
    formatCurrency,
    formatProvider,
} from "@/features/rewards/lib/format";
import {
    usePublicRewardAssumptions,
    useRewardsData,
} from "@/features/rewards/lib/hooks";
import {
    getDashboardSummary,
    getRewardRuleComparableRate,
} from "@/features/rewards/lib/recommendations";
import { SpendSimulator } from "@/features/rewards/components/SpendSimulator";
import { RetailerLogo } from "@/features/rewards/components/RetailerLogo";

export function DashboardHome() {
    const rewardsData = useRewardsData();
    const publicAssumptions = usePublicRewardAssumptions();
    const profile = publicAssumptions.profile;
    const isLoading = rewardsData.isLoading || publicAssumptions.isLoading;
    const error = rewardsData.error ?? publicAssumptions.error;

    if (isLoading) {
        return <div className="rounded-lg border bg-white p-6">Loading rewards...</div>;
    }

    if (error || !profile) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error ?? "Could not load your rewards profile."}
            </div>
        );
    }

    const summary = getDashboardSummary({
        retailers: rewardsData.retailers,
        rules: rewardsData.rules,
        profile,
    });
    const topRules = [...rewardsData.rules]
        .filter((rule) => rule.active)
        .sort(
            (first, second) =>
                getRewardRuleComparableRate(second) -
                getRewardRuleComparableRate(first)
        )
        .slice(0, 4);

    return (
        <div className="space-y-6 sm:space-y-8">
            <section className="rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 shadow-[4px_4px_0_#18181b] sm:rounded-[1.5rem] sm:p-5 sm:shadow-[8px_8px_0_#18181b] md:p-7">
                <div className="grid gap-5 md:gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="inline-flex rounded-full bg-[#ff4faf] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                            Public rewards calculator
                        </p>
                        <h1 className="mt-4 max-w-xl text-balance text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
                            Make your everyday spend pay you back.
                        </h1>
                        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-zinc-700">
                            For adults stepping into real-world money decisions:
                            petrol, groceries, pharmacy runs, and rides can all
                            become smarter choices.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <SourcePill label="UCount source" />
                            <SourcePill label="Discovery Miles source" />
                            <SourcePill label="No login" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 min-[28rem]:grid-cols-2 sm:grid-cols-3">
                        <Metric
                            icon={ReceiptText}
                            label="Monthly estimate"
                            value={formatCurrency(
                                summary.estimatedMonthlyRewards
                            )}
                        />
                        <Metric
                            icon={BadgeCheck}
                            label="Source mode"
                            value={rewardsData.sourceStatus.mode}
                        />
                        <Metric
                            icon={Sparkles}
                            label="Active retailers"
                            value={String(summary.activeRetailerCount)}
                        />
                    </div>
                </div>
            </section>

            <SpendSimulator />

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EducationCard
                    accent="#0072ce"
                    title="How UCount works"
                    body="UCount is mostly about using a qualifying Standard Bank card, improving your tier, and spending at the right partners or chosen reward categories."
                />
                <EducationCard
                    accent="#00a651"
                    title="How Discovery Miles works"
                    body="Discovery Miles rewards often depend on Vitality-style benefits, Discovery Bank products, and whether the item or partner qualifies."
                />
                <EducationCard
                    accent="#ff4faf"
                    title="How to think smart"
                    body="Do not spend more just to earn rewards. Use the calculator for things you already planned to buy, then pick the payment method with the better return."
                />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <EcosystemPanel
                    accent="blue"
                    description="Qualifying Standard Bank card, tier-dependent points, Choose Your Own Rewards, fuel partners, and Rewards Retailers."
                    enabled={profile.ucountEnabled}
                    provider="UCount"
                    ruleCount={summary.ucountRuleCount}
                    status="Official UCount page"
                />
                <EcosystemPanel
                    accent="emerald"
                    description="HealthyFood, HealthyCare, Discovery Bank earn, and fuel or transport rewards with partner and status conditions."
                    enabled={profile.discoveryEnabled}
                    provider="Discovery Miles"
                    ruleCount={summary.discoveryRuleCount}
                    status="Official Discovery page"
                />
            </section>

            <section className="rounded-[1.25rem] border-2 border-zinc-950 bg-white">
                <div className="flex flex-col gap-3 border-b-2 border-zinc-950 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <h2 className="text-lg font-black">
                            Top source-backed opportunities
                        </h2>
                        <p className="text-sm font-medium text-zinc-600">
                            Highest comparable estimates from the current rules.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="touch-target w-full border-2 border-zinc-950 bg-white font-black text-zinc-950 shadow-[3px_3px_0_#18181b] hover:bg-[#fff15a] sm:w-auto"
                        variant="outline"
                    >
                        <Link href="/retailers">View retailers</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                    {topRules.length === 0 ? (
                        <div className="p-5 text-sm text-zinc-600">
                            No reward rules yet. Seed or add rules from the
                            rules page.
                        </div>
                    ) : (
                        topRules.map((rule) => {
                            const retailer = rewardsData.retailers.find(
                                (item) => item.id === rule.retailerId
                            );

                            return (
                                <div
                                    className="rounded-2xl border-2 border-zinc-950 bg-[#fffdf6] p-4 text-sm shadow-[4px_4px_0_#18181b]"
                                    key={rule.id}
                                >
                                    {retailer ? (
                                        <RetailerLogo
                                            retailer={retailer}
                                            size="sm"
                                        />
                                    ) : null}
                                    <p className="text-xs font-black uppercase text-[#ff4faf]">
                                        {formatProvider(rule.provider)}
                                    </p>
                                    <h3 className="mt-2 text-lg font-black">
                                        {retailer?.name ?? rule.retailerId}
                                    </h3>
                                    <p className="mt-1 text-sm font-semibold text-zinc-600">
                                        {formatCategory(rule.category)}
                                    </p>
                                    <p className="mt-4 text-2xl font-black">
                                        {rule.maxRewardLabel}
                                    </p>
                                    <p className="mt-3 text-xs font-medium leading-5 text-zinc-600">
                                        {rule.conditions?.[0] ??
                                            "Conditions apply."}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}

function EducationCard({
    accent,
    body,
    title,
}: {
    accent: string;
    body: string;
    title: string;
}) {
    return (
        <article className="rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 sm:p-5">
            <div
                className="flex size-11 items-center justify-center rounded-xl border-2 border-zinc-950 text-white"
                style={{ backgroundColor: accent }}
            >
                <Brain className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">
                {body}
            </p>
        </article>
    );
}

function SourcePill({ label }: { label: string }) {
    return (
        <span className="rounded-full border-2 border-zinc-950 bg-[#b7ff4a] px-3 py-1 text-xs font-black uppercase text-zinc-950">
            {label}
        </span>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof ReceiptText;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border-2 border-zinc-950 bg-[#fff15a] p-4 shadow-[3px_3px_0_#18181b] sm:shadow-[4px_4px_0_#18181b]">
            <Icon className="size-4 text-zinc-700" />
            <p className="mt-3 text-xs font-black uppercase text-zinc-600">
                {label}
            </p>
            <p className="mt-1 text-xl font-black capitalize">{value}</p>
        </div>
    );
}

function EcosystemPanel({
    accent,
    description,
    enabled,
    provider,
    ruleCount,
    status,
}: {
    accent: "blue" | "emerald";
    description: string;
    enabled: boolean;
    provider: string;
    ruleCount: number;
    status: string;
}) {
    const color =
        accent === "blue"
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-emerald-600 bg-emerald-50 text-emerald-700";

    return (
        <article className="rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black">{provider}</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">
                        {description}
                    </p>
                </div>
                <span className={`rounded-full border-2 px-2 py-1 text-xs font-black ${color}`}>
                    {enabled ? "Live" : "Off"}
                </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-zinc-950 p-4">
                    <Sparkles className="size-4 text-[#ff4faf]" />
                    <p className="mt-3 text-xs font-black uppercase text-zinc-500">
                        Source
                    </p>
                    <p className="mt-1 font-black">{status}</p>
                </div>
                <div className="rounded-2xl border-2 border-zinc-950 p-4">
                    <ReceiptText className="size-4 text-[#28cf66]" />
                    <p className="mt-3 text-xs font-black uppercase text-zinc-500">
                        Active rules
                    </p>
                    <p className="mt-1 font-black">{ruleCount}</p>
                </div>
            </div>
        </article>
    );
}
