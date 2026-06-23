"use client";

import {
    generatedRetailers,
    generatedRewardRules,
    generatedSourceStatus,
} from "@/features/rewards/lib/generated-source-data";
import type { UserProfile } from "@/features/rewards/lib/types";

export const defaultAssumptionsProfile: UserProfile = {
    id: "public-mvp",
    ucountEnabled: true,
    ucountTier: "Standard estimate",
    discoveryEnabled: true,
    discoveryStatus: "Standard estimate",
    healthyFoodEnabled: true,
    healthyCareEnabled: true,
    preferredPaymentMethod: "discovery-bank-card",
    monthlySpendCategories: ["groceries", "fuel", "pharmacy"],
};

export function useRewardsData() {
    return {
        retailers: generatedRetailers,
        rules: generatedRewardRules,
        sourceStatus: generatedSourceStatus,
        isLoading: false,
        error: null,
    };
}

export function usePublicRewardAssumptions() {
    return {
        profile: defaultAssumptionsProfile,
        isLoading: false,
        error: null,
    };
}
