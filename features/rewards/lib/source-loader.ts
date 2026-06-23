import {
    DISCOVERY_SOURCE_URL,
    RATE_FALLBACKS,
    RATE_PATTERNS,
    UCOUNT_SOURCE_URL,
} from "@/features/rewards/lib/source-constants";
import type { RewardRule } from "@/features/rewards/lib/types";

export { DISCOVERY_SOURCE_URL, UCOUNT_SOURCE_URL };

export type SourceTextInput = {
    ucountText?: string;
    discoveryText?: string;
    fetchedAt: string;
};

type ExtractedRates = {
    ucountRetailerRate: number;
    ucountFuelRandPerLitre: number;
    discoveryHealthyFoodRate: number;
    discoveryHealthyFoodBoostedRate: number;
    discoveryHealthyCareRate: number;
    discoveryTransportRate: number;
};

function percentFromText(text: string | undefined, pattern: RegExp) {
    const match = text?.match(pattern);
    return match ? Number(match[1]) / 100 : null;
}

function randFromText(text: string | undefined, pattern: RegExp) {
    const match = text?.match(pattern);
    return match ? Number(match[1]) : null;
}

export function extractSourceRates(input: SourceTextInput): ExtractedRates {
    return {
        ucountRetailerRate:
            percentFromText(input.ucountText, RATE_PATTERNS.ucountRetailer) ??
            RATE_FALLBACKS.ucountRetailerRate,
        ucountFuelRandPerLitre:
            randFromText(
                input.ucountText,
                RATE_PATTERNS.ucountFuelRandPerLitre
            ) ?? RATE_FALLBACKS.ucountFuelRandPerLitre,
        discoveryHealthyFoodRate:
            percentFromText(
                input.discoveryText,
                RATE_PATTERNS.discoveryHealthyFood
            ) ?? RATE_FALLBACKS.discoveryHealthyFoodRate,
        discoveryHealthyFoodBoostedRate:
            percentFromText(
                input.discoveryText,
                RATE_PATTERNS.discoveryHealthyFoodBoosted
            ) ?? RATE_FALLBACKS.discoveryHealthyFoodBoostedRate,
        discoveryHealthyCareRate:
            percentFromText(
                input.discoveryText,
                RATE_PATTERNS.discoveryHealthyCare
            ) ?? RATE_FALLBACKS.discoveryHealthyCareRate,
        discoveryTransportRate:
            percentFromText(
                input.discoveryText,
                RATE_PATTERNS.discoveryTransport
            ) ?? RATE_FALLBACKS.discoveryTransportRate,
    };
}

type RuleDraft = Omit<
    RewardRule,
    "active" | "lastUpdated" | "lastFetched" | "confidence"
>;

function sourceRule(
    rule: RuleDraft,
    fetchedAt: string,
    confidence: RewardRule["confidence"] = "high"
): RewardRule {
    return {
        ...rule,
        active: true,
        lastUpdated: fetchedAt.slice(0, 10),
        lastFetched: fetchedAt,
        confidence,
    };
}

export function buildOfficialSourceRules(
    input: SourceTextInput,
    confidence: RewardRule["confidence"] = "high"
): RewardRule[] {
    const rates = extractSourceRates(input);

    return [
        ...["checkers", "shoprite"].map((retailerId) =>
            sourceRule(
                {
                    id: `${retailerId}-ucount-rewards-retailer`,
                    provider: "ucount",
                    retailerId,
                    category: "groceries",
                    earnRate: rates.ucountRetailerRate,
                    maxRewardLabel: `Up to ${Math.round(rates.ucountRetailerRate * 100)}% back`,
                    estimateMethod: "percentage",
                    rewardValue: rates.ucountRetailerRate,
                    rewardType: "points",
                    conditions: [
                        "Pay with a qualifying Standard Bank card.",
                        "Tier level and programme rules affect final points.",
                    ],
                    sourceUrl: UCOUNT_SOURCE_URL,
                    sourceName: "Standard Bank UCount",
                    sourceExtract:
                        "UCount describes Rewards Retailers and qualifying-card earn.",
                },
                input.fetchedAt,
                confidence
            )
        ),
        ...["astron-energy", "caltex"].map((retailerId) =>
            sourceRule(
                {
                    id: `${retailerId}-ucount-fuel`,
                    provider: "ucount",
                    retailerId,
                    category: "fuel",
                    maxRewardLabel: `Up to R${rates.ucountFuelRandPerLitre}/litre`,
                    estimateMethod: "rand-per-litre",
                    rewardValue: rates.ucountFuelRandPerLitre,
                    rewardType: "points",
                    conditions: [
                        "Fuel estimate assumes R25 per litre.",
                        "Tier level and qualifying-card rules apply.",
                    ],
                    sourceUrl: UCOUNT_SOURCE_URL,
                    sourceName: "Standard Bank UCount",
                    sourceExtract:
                        "UCount describes fuel rewards at Astron Energy and Caltex.",
                },
                input.fetchedAt,
                confidence
            )
        ),
        ...["checkers", "woolworths"].map((retailerId) =>
            sourceRule(
                {
                    id: `${retailerId}-discovery-healthyfood`,
                    provider: "discovery",
                    retailerId,
                    category: "groceries",
                    earnRate: rates.discoveryHealthyFoodBoostedRate,
                    maxRewardLabel: `Up to ${Math.round(rates.discoveryHealthyFoodBoostedRate * 100)}% back`,
                    estimateMethod: "percentage",
                    rewardValue: rates.discoveryHealthyFoodBoostedRate,
                    rewardType: "miles",
                    conditions: [
                        `Base HealthyFood can be up to ${Math.round(rates.discoveryHealthyFoodRate * 100)}%.`,
                        "Boosted estimate requires qualifying Discovery Bank and Vitality Money.",
                        "Qualifying HealthyFood items only.",
                    ],
                    sourceUrl: DISCOVERY_SOURCE_URL,
                    sourceName: "Discovery Miles",
                    sourceExtract:
                        "Discovery describes HealthyFood rewards at Checkers and Woolworths.",
                },
                input.fetchedAt,
                confidence
            )
        ),
        ...["clicks", "dis-chem"].map((retailerId) =>
            sourceRule(
                {
                    id: `${retailerId}-discovery-healthycare`,
                    provider: "discovery",
                    retailerId,
                    category: "pharmacy",
                    earnRate: rates.discoveryHealthyCareRate,
                    maxRewardLabel: `Up to ${Math.round(rates.discoveryHealthyCareRate * 100)}% back`,
                    estimateMethod: "percentage",
                    rewardValue: rates.discoveryHealthyCareRate,
                    rewardType: "miles",
                    conditions: [
                        "HealthyCare benefit and qualifying Discovery Bank product required.",
                        "Qualifying personal care, baby, or premium items only.",
                    ],
                    sourceUrl: DISCOVERY_SOURCE_URL,
                    sourceName: "Discovery Miles",
                    sourceExtract:
                        "Discovery describes HealthyCare rewards at Clicks and Dis-Chem.",
                },
                input.fetchedAt,
                confidence
            )
        ),
        ...["bp", "shell"].map((retailerId) =>
            sourceRule(
                {
                    id: `${retailerId}-discovery-fuel`,
                    provider: "discovery",
                    retailerId,
                    category: "fuel",
                    earnRate: rates.discoveryTransportRate,
                    maxRewardLabel: `Up to ${Math.round(rates.discoveryTransportRate * 100)}% back`,
                    estimateMethod: "percentage",
                    rewardValue: rates.discoveryTransportRate,
                    rewardType: "miles",
                    conditions: [
                        "Discovery Bank client and qualifying spend required.",
                        "Select fuel partners and programme limits apply.",
                    ],
                    sourceUrl: DISCOVERY_SOURCE_URL,
                    sourceName: "Discovery Miles",
                    sourceExtract:
                        "Discovery describes fuel rewards at bp and select Shell sites.",
                },
                input.fetchedAt,
                confidence
            )
        ),
        sourceRule(
            {
                id: "uber-discovery-transport",
                provider: "discovery",
                retailerId: "uber",
                category: "transport",
                earnRate: rates.discoveryTransportRate,
                maxRewardLabel: `Up to ${Math.round(rates.discoveryTransportRate * 100)}% back`,
                estimateMethod: "percentage",
                rewardValue: rates.discoveryTransportRate,
                rewardType: "miles",
                conditions: [
                    "Discovery Bank client and qualifying Uber spend required.",
                    "Programme limits and fair usage may apply.",
                ],
                sourceUrl: DISCOVERY_SOURCE_URL,
                sourceName: "Discovery Miles",
                sourceExtract:
                    "Discovery describes transport rewards including Uber.",
            },
            input.fetchedAt,
            confidence
        ),
    ];
}
