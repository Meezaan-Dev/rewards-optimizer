"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";

import { formatCategory, formatProvider } from "@/features/rewards/lib/format";
import { useRewardsData } from "@/features/rewards/lib/hooks";
import { RetailerLogo } from "@/features/rewards/components/RetailerLogo";

export function RetailersView() {
    const { retailers, rules, isLoading, error } = useRewardsData();

    if (isLoading) {
        return (
            <div className="rounded-2xl border-2 border-zinc-950 bg-white p-6">
                Loading retailers...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-5 sm:space-y-6">
            <div>
                <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
                    Retailer comparison
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-600">
                    Browse source-backed opportunities by retailer before
                    trying a spend amount in the simulator.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {retailers.length === 0 ? (
                    <div className="rounded-2xl border-2 border-zinc-950 bg-[#fff15a] p-5">
                        <AlertTriangle className="size-5 text-zinc-950" />
                        <p className="mt-3 text-sm font-semibold text-zinc-800">
                            No retailers exist yet. Seed or add them from Rules.
                        </p>
                    </div>
                ) : (
                    retailers.map((retailer) => {
                        const retailerRules = rules.filter(
                            (rule) => rule.retailerId === retailer.id
                        );

                        return (
                            <article
                                className="rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 shadow-[4px_4px_0_#18181b] sm:p-5 sm:shadow-[5px_5px_0_#18181b]"
                                key={retailer.id}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 gap-3 sm:gap-4">
                                        <RetailerLogo
                                            retailer={retailer}
                                            size="lg"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-black sm:text-xl">
                                                {retailer.name}
                                            </h2>
                                            <p className="mt-1 text-sm font-black uppercase text-[#ff4faf]">
                                                {formatCategory(
                                                    retailer.category
                                                )}
                                            </p>
                                            {retailer.storeMetaTitle ? (
                                                <p className="mt-2 line-clamp-2 text-xs font-black text-zinc-500">
                                                    {retailer.storeMetaTitle}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
                                        <span className="rounded-full border-2 border-zinc-950 bg-[#b7ff4a] px-2 py-1 text-xs font-black text-zinc-950">
                                            {retailer.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                        {retailer.websiteUrl ? (
                                            <a
                                                className="touch-target inline-flex min-h-11 items-center gap-1 text-xs font-black underline"
                                                href={retailer.websiteUrl}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                Store site
                                                <ExternalLink className="size-3 shrink-0" />
                                            </a>
                                        ) : null}
                                    </div>
                                </div>

                                {retailer.storeMetaDescription ||
                                retailer.notes ? (
                                        <p className="mt-4 text-sm font-medium leading-6 text-zinc-600">
                                            {retailer.storeMetaDescription ??
                                                retailer.notes}
                                        </p>
                                    ) : null}

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {retailerRules.map((rule) => (
                                        <div
                                            className="rounded-2xl border-2 border-zinc-950 bg-[#fffdf6] p-4 text-sm"
                                            key={rule.id}
                                        >
                                            <p className="font-black">
                                                {formatProvider(rule.provider)}
                                            </p>
                                            <p className="mt-2 text-xl font-black sm:text-2xl">
                                                {rule.maxRewardLabel}
                                            </p>
                                            <p className="mt-3 text-xs font-medium leading-5 text-zinc-700">
                                                {rule.conditions?.[0] ??
                                                    "No condition noted"}
                                            </p>
                                            <a
                                                className="touch-target mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-black underline"
                                                href={rule.sourceUrl}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                {rule.sourceName}
                                                <ExternalLink className="size-3 shrink-0" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
}
