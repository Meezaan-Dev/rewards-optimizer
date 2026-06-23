import {
    formatCurrency,
    formatPaymentMethod,
    formatProvider,
} from "@/features/rewards/lib/format";
import {
    estimateRewardValue,
    FUEL_RAND_PER_LITRE_ASSUMPTION,
    getRuleComparableRate,
} from "@/features/rewards/lib/reward-estimates";
import type {
    PaymentMethod,
    Retailer,
    RewardProvider,
    RewardResult,
    RewardRule,
    SpendCategory,
    SpendSimulation,
    UserProfile,
} from "@/features/rewards/lib/types";

export { getRuleComparableRate as getRewardRuleComparableRate };

const providerPaymentMethods: Record<RewardProvider, PaymentMethod> = {
    ucount: "standard-bank-card",
    discovery: "discovery-bank-card",
};

function isProviderEnabled(provider: RewardProvider, profile: UserProfile) {
    return provider === "ucount"
        ? profile.ucountEnabled
        : profile.discoveryEnabled;
}

function hasRequiredBenefit(rule: RewardRule, profile: UserProfile) {
    const conditions = rule.conditions?.join(" ").toLowerCase() ?? "";

    if (conditions.includes("healthyfood") && !profile.healthyFoodEnabled) {
        return false;
    }

    if (conditions.includes("healthycare") && !profile.healthyCareEnabled) {
        return false;
    }

    return true;
}

function getEstimateMethodCopy(rule: RewardRule) {
    if (rule.estimateMethod === "rand-per-litre") {
        return `This fuel estimate converts spend to litres at ${formatCurrency(FUEL_RAND_PER_LITRE_ASSUMPTION)} per litre.`;
    }

    if (rule.estimateMethod === "qualifying-spend") {
        return "This estimate applies the rule to qualifying spend only.";
    }

    return "This estimate applies the listed percentage to the spend amount.";
}

export function compareRewards(input: {
    retailerId: string;
    amount: number;
    category: SpendCategory;
    availablePaymentMethods: PaymentMethod[];
    rules: RewardRule[];
    profile: UserProfile;
}): Omit<SpendSimulation, "id" | "createdAt"> {
    const results = input.rules
        .filter((rule) => rule.active)
        .filter((rule) => rule.retailerId === input.retailerId)
        .filter((rule) => rule.category === input.category)
        .filter((rule) => isProviderEnabled(rule.provider, input.profile))
        .filter((rule) => hasRequiredBenefit(rule, input.profile))
        .filter((rule) =>
            input.availablePaymentMethods.includes(
                providerPaymentMethods[rule.provider]
            )
        )
        .map<RewardResult>((rule) => {
            const uncappedValue = estimateRewardValue(rule, input.amount);
            const estimatedValue = rule.monthlyCap
                ? Math.min(uncappedValue, rule.monthlyCap)
                : uncappedValue;

            return {
                provider: rule.provider,
                paymentMethod: providerPaymentMethods[rule.provider],
                rewardType: rule.rewardType,
                estimatedValue,
                earnRate: rule.earnRate,
                maxRewardLabel: rule.maxRewardLabel,
                estimateMethod: rule.estimateMethod,
                sourceName: rule.sourceName,
                sourceUrl: rule.sourceUrl,
                sourceExtract: rule.sourceExtract,
                confidence: rule.confidence,
                conditions: rule.conditions ?? [],
                ruleId: rule.id,
                explanation: `${formatProvider(rule.provider)} estimates ${formatCurrency(estimatedValue)} back using ${formatPaymentMethod(providerPaymentMethods[rule.provider])}. ${getEstimateMethodCopy(rule)}`,
            };
        })
        .sort((first, second) => second.estimatedValue - first.estimatedValue);

    return {
        retailerId: input.retailerId,
        amount: input.amount,
        category: input.category,
        availablePaymentMethods: input.availablePaymentMethods,
        results,
        recommendedProvider: results[0]?.provider,
    };
}

export function getDashboardSummary(input: {
    retailers: Retailer[];
    rules: RewardRule[];
    profile: UserProfile;
}) {
    const activeRules = input.rules.filter((rule) => rule.active);
    const ucountRules = activeRules.filter((rule) => rule.provider === "ucount");
    const discoveryRules = activeRules.filter(
        (rule) => rule.provider === "discovery"
    );

    const monthlyRewards = activeRules.reduce((total, rule) => {
        const assumedSpend = rule.category === "fuel" ? 1800 : 2400;
        return (
            total +
            Math.min(
                estimateRewardValue(rule, assumedSpend),
                rule.monthlyCap ?? Infinity
            )
        );
    }, 0);

    const bestRule = [...activeRules].sort(
        (first, second) =>
            getRuleComparableRate(second) - getRuleComparableRate(first)
    )[0];
    const bestRetailer = input.retailers.find(
        (retailer) => retailer.id === bestRule?.retailerId
    );

    return {
        estimatedMonthlyRewards: monthlyRewards,
        missedOpportunity: Math.round(monthlyRewards * 0.22),
        bestRule,
        bestRetailer,
        ucountRuleCount: ucountRules.length,
        discoveryRuleCount: discoveryRules.length,
        activeRetailerCount: input.retailers.filter(
            (retailer) => retailer.active
        ).length,
    };
}
