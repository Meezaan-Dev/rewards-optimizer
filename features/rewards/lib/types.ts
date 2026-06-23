export type RewardProvider = "ucount" | "discovery";

export type RewardType = "points" | "miles" | "cashback";

export type SpendCategory =
    | "groceries"
    | "fuel"
    | "pharmacy"
    | "fashion"
    | "health"
    | "lifestyle"
    | "travel"
    | "transport"
    | "general";

export type PaymentMethod = "standard-bank-card" | "discovery-bank-card";

export type UserProfile = {
    id: string;
    ucountEnabled: boolean;
    ucountTier?: string;
    discoveryEnabled: boolean;
    discoveryStatus?: string;
    healthyFoodEnabled?: boolean;
    healthyCareEnabled?: boolean;
    preferredPaymentMethod?: PaymentMethod;
    monthlySpendCategories: SpendCategory[];
    updatedAt?: string;
};

export type Retailer = {
    id: string;
    name: string;
    category: SpendCategory;
    logoUrl?: string;
    websiteUrl?: string;
    domain?: string;
    storeMetaTitle?: string;
    storeMetaDescription?: string;
    storeDataSource?: string;
    brandColor?: string;
    active: boolean;
    notes?: string;
};

export type RewardRule = {
    id: string;
    provider: RewardProvider;
    retailerId: string;
    category: SpendCategory;
    earnRate?: number;
    maxRewardLabel: string;
    estimateMethod: "percentage" | "rand-per-litre" | "qualifying-spend";
    rewardValue: number;
    rewardType: RewardType;
    conditions?: string[];
    monthlyCap?: number;
    active: boolean;
    lastUpdated: string;
    sourceUrl: string;
    sourceName: string;
    sourceExtract: string;
    lastFetched: string;
    confidence: "high" | "medium" | "low";
};

export type RewardResult = {
    provider: RewardProvider;
    paymentMethod: PaymentMethod;
    rewardType: RewardType;
    estimatedValue: number;
    earnRate?: number;
    maxRewardLabel: string;
    estimateMethod: RewardRule["estimateMethod"];
    sourceName: string;
    sourceUrl: string;
    sourceExtract: string;
    confidence: RewardRule["confidence"];
    conditions: string[];
    explanation: string;
    ruleId: string;
};

export type SpendSimulation = {
    id?: string;
    retailerId: string;
    amount: number;
    category: SpendCategory;
    availablePaymentMethods: PaymentMethod[];
    results: RewardResult[];
    recommendedProvider?: RewardProvider;
    createdAt?: string;
};
