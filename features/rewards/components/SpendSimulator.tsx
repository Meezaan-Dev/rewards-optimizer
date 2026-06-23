"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, ExternalLink, Trophy } from "lucide-react";

import {
    formatCategory,
    formatCurrency,
    formatPaymentMethod,
    formatProvider,
} from "@/features/rewards/lib/format";
import {
    usePublicRewardAssumptions,
    useRewardsData,
} from "@/features/rewards/lib/hooks";
import { compareRewards } from "@/features/rewards/lib/recommendations";
import {
    FUEL_RAND_PER_LITRE_ASSUMPTION,
} from "@/features/rewards/lib/reward-estimates";
import { RetailerLogo } from "@/features/rewards/components/RetailerLogo";
import {
    paymentMethods,
    simulatorSchema,
    spendCategories,
    type SimulatorFormValues,
} from "@/features/rewards/lib/schemas";

export function SpendSimulator() {
    const rewardsData = useRewardsData();
    const publicAssumptions = usePublicRewardAssumptions();
    const [selectedProvider, setSelectedProvider] = useState<string | null>(
        null
    );

    const form = useForm<SimulatorFormValues>({
        resolver: zodResolver(simulatorSchema),
        defaultValues: {
            retailerId: "astron-energy",
            amount: 750,
            category: "fuel",
            availablePaymentMethods: [
                "standard-bank-card",
                "discovery-bank-card",
            ],
        },
    });
    const watchedValues = form.watch();
    const profile = publicAssumptions.profile;

    const result = useMemo(() => {
        if (!profile || !watchedValues.retailerId || !watchedValues.amount) {
            return null;
        }

        const parsed = simulatorSchema.safeParse(watchedValues);

        if (!parsed.success) {
            return null;
        }

        return compareRewards({
            ...parsed.data,
            rules: rewardsData.rules,
            profile,
        });
    }, [profile, rewardsData.rules, watchedValues]);

    const activeRetailers = rewardsData.retailers.filter(
        (retailer) => retailer.active
    );
    const selectedRetailer = rewardsData.retailers.find(
        (retailer) => retailer.id === watchedValues.retailerId
    );
    const winner = result?.results[0];
    const fuelLitres =
        winner?.estimateMethod === "rand-per-litre"
            ? Math.round(watchedValues.amount / FUEL_RAND_PER_LITRE_ASSUMPTION)
            : null;
    const fuelExplanation =
        winner?.estimateMethod === "rand-per-litre" && fuelLitres
            ? `For ${formatCurrency(watchedValues.amount)} at an assumed ${formatCurrency(FUEL_RAND_PER_LITRE_ASSUMPTION)}/litre, this models about ${fuelLitres} litres. At the source maximum of ${winner.maxRewardLabel}, the estimate is ${formatCurrency(winner.estimatedValue)}.`
            : null;

    return (
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <form className="space-y-4 rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 shadow-[4px_4px_0_#18181b] sm:space-y-5 sm:p-5 sm:shadow-[6px_6px_0_#18181b]">
                <div>
                    <p className="inline-flex rounded-full bg-[#fff15a] px-3 py-1 text-xs font-black uppercase text-zinc-950">
                        Start here
                    </p>
                    <h1 className="mt-3 text-balance text-2xl font-black tracking-tight sm:text-3xl">
                        I spent R750. What do I get back?
                    </h1>
                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">
                        Pick the store, enter the spend, and see which rewards
                        world works harder for that transaction.
                    </p>
                </div>

                <label className="block space-y-2 text-sm font-black">
                    Retailer
                    <select
                        className="touch-target h-12 w-full rounded-xl border-2 border-zinc-950 bg-white px-3 text-base font-semibold outline-none focus:ring-4 focus:ring-[#ff4faf]/25 sm:text-sm"
                        {...form.register("retailerId")}
                    >
                        <option value="">Choose a retailer</option>
                        {activeRetailers.map((retailer) => (
                            <option key={retailer.id} value={retailer.id}>
                                {retailer.name}
                            </option>
                        ))}
                    </select>
                    {form.formState.errors.retailerId ? (
                        <span className="text-xs text-red-600">
                            {form.formState.errors.retailerId.message}
                        </span>
                    ) : null}
                </label>

                <label className="block space-y-2 text-sm font-black">
                    Spend amount
                    <input
                        className="touch-target h-12 w-full rounded-xl border-2 border-zinc-950 px-3 text-base font-semibold outline-none focus:ring-4 focus:ring-[#ff4faf]/25 sm:text-sm"
                        min={1}
                        step={50}
                        type="number"
                        {...form.register("amount", { valueAsNumber: true })}
                    />
                </label>

                <label className="block space-y-2 text-sm font-black">
                    Category
                    <select
                        className="touch-target h-12 w-full rounded-xl border-2 border-zinc-950 bg-white px-3 text-base font-semibold outline-none focus:ring-4 focus:ring-[#ff4faf]/25 sm:text-sm"
                        {...form.register("category")}
                    >
                        {spendCategories.map((category) => (
                            <option key={category} value={category}>
                                {formatCategory(category)}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="space-y-3">
                    <p className="text-sm font-black">Available methods</p>
                    <div className="grid gap-2">
                        {paymentMethods.map((method) => (
                            <label
                                className="touch-target flex min-h-12 items-center gap-3 rounded-xl border-2 border-zinc-950 bg-[#fffdf6] px-3 py-3 text-sm font-semibold sm:min-h-0"
                                key={method}
                            >
                                <input
                                    className="size-4"
                                    type="checkbox"
                                    value={method}
                                    {...form.register("availablePaymentMethods")}
                                />
                                {formatPaymentMethod(method)}
                            </label>
                        ))}
                    </div>
                </div>
            </form>

            <section className="space-y-4">
                <div className="min-h-full rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 sm:p-5">
                    {winner ? (
                        <>
                            <div className="flex items-start gap-3">
                                {selectedRetailer ? (
                                    <RetailerLogo
                                        retailer={selectedRetailer}
                                        size="md"
                                    />
                                ) : (
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-950 bg-[#b7ff4a] text-zinc-950">
                                        <Trophy className="size-5" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-black uppercase text-[#28cf66]">
                                        Recommendation
                                    </p>
                                    <h2 className="mt-1 text-balance text-xl font-black sm:text-2xl">
                                        At {selectedRetailer?.name}, use{" "}
                                        {formatPaymentMethod(
                                            winner.paymentMethod
                                        )}
                                    </h2>
                                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">
                                        On{" "}
                                        {formatCurrency(watchedValues.amount)}{" "}
                                        of{" "}
                                        {formatCategory(
                                            watchedValues.category
                                        )}
                                        , {formatProvider(winner.provider)}{" "}
                                        gives the best estimated return.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {result.results.map((item) => (
                                    <button
                                        className="touch-target rounded-2xl border-2 border-zinc-950 bg-[#fffdf6] p-4 text-left transition-transform active:scale-[0.98] sm:hover:-translate-y-0.5"
                                        key={item.ruleId}
                                        onClick={() =>
                                            setSelectedProvider(item.provider)
                                        }
                                        type="button"
                                    >
                                        <p className="text-sm font-black">
                                            {formatProvider(item.provider)}
                                        </p>
                                        <p className="mt-1 text-xs font-black uppercase text-[#ff4faf]">
                                            {item.maxRewardLabel}
                                        </p>
                                        <p className="mt-2 text-2xl font-black sm:text-3xl">
                                            {formatCurrency(
                                                item.estimatedValue
                                            )}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-zinc-600">
                                            {item.estimateMethod ===
                                            "rand-per-litre"
                                                ? "Fuel litres estimate"
                                                : "Qualifying spend estimate"}
                                        </p>
                                        {item.conditions.length > 0 ? (
                                            <p className="mt-3 text-xs font-medium leading-5 text-zinc-700">
                                                {item.conditions[0]}
                                            </p>
                                        ) : null}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5 rounded-2xl border-2 border-zinc-950 bg-[#b7ff4a] p-4 text-sm font-semibold leading-6 text-zinc-800">
                                <p>{winner.explanation}</p>
                                {fuelExplanation ? (
                                    <p className="mt-2">{fuelExplanation}</p>
                                ) : null}
                                <a
                                    className="mt-3 inline-flex items-center gap-2 font-black underline"
                                    href={winner.sourceUrl}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {winner.sourceName}
                                    <ExternalLink className="size-3.5" />
                                </a>
                            </div>

                            <p className="mt-4 text-sm font-medium leading-6 text-zinc-600">
                                {selectedProvider
                                    ? `${formatProvider(selectedProvider as "ucount" | "discovery")} is selected for closer comparison.`
                                    : "Select an option above to inspect it. No login or saved account is required."}
                            </p>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 size-5 text-[#ff4faf]" />
                            <div>
                                <h2 className="font-black">
                                    No recommendation yet
                                </h2>
                                <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">
                                    Choose a retailer and category that exists
                                    in the local MVP rule set.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
