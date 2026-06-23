import type { RewardRule } from "@/features/rewards/lib/types";

export const FUEL_RAND_PER_LITRE_ASSUMPTION = 25;

export function estimateRewardValue(rule: RewardRule, amount: number) {
    if (rule.estimateMethod === "rand-per-litre") {
        return (amount / FUEL_RAND_PER_LITRE_ASSUMPTION) * rule.rewardValue;
    }

    return amount * rule.rewardValue;
}

export function getRuleComparableRate(rule: RewardRule) {
    if (rule.estimateMethod === "rand-per-litre") {
        return rule.rewardValue / FUEL_RAND_PER_LITRE_ASSUMPTION;
    }

    return rule.rewardValue;
}
