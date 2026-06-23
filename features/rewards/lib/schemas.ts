import { z } from "zod";

import type {
    PaymentMethod,
    RewardProvider,
    RewardType,
    SpendCategory,
} from "@/features/rewards/lib/types";

export const spendCategories = [
    "groceries",
    "fuel",
    "pharmacy",
    "fashion",
    "health",
    "lifestyle",
    "travel",
    "transport",
    "general",
] as const satisfies readonly SpendCategory[];

export const rewardProviders = [
    "ucount",
    "discovery",
] as const satisfies readonly RewardProvider[];

export const paymentMethods = [
    "standard-bank-card",
    "discovery-bank-card",
] as const satisfies readonly PaymentMethod[];

export const rewardTypes = [
    "points",
    "miles",
    "cashback",
] as const satisfies readonly RewardType[];

export const profileSchema = z.object({
    ucountEnabled: z.boolean(),
    ucountTier: z.string().max(60).optional(),
    discoveryEnabled: z.boolean(),
    discoveryStatus: z.string().max(60).optional(),
    healthyFoodEnabled: z.boolean().optional(),
    healthyCareEnabled: z.boolean().optional(),
    preferredPaymentMethod: z.enum(paymentMethods).optional(),
    monthlySpendCategories: z.array(z.enum(spendCategories)).min(1),
});

export const simulatorSchema = z.object({
    retailerId: z.string().min(1, "Choose a retailer."),
    amount: z
        .number()
        .positive("Enter a spend amount above R0.")
        .max(100000, "Use a smaller simulator amount."),
    category: z.enum(spendCategories),
    availablePaymentMethods: z.array(z.enum(paymentMethods)).min(1),
});

export const retailerSchema = z.object({
    name: z.string().trim().min(2).max(80),
    category: z.enum(spendCategories),
    active: z.boolean(),
    notes: z.string().trim().max(240).optional(),
});

export const rewardRuleSchema = z.object({
    provider: z.enum(rewardProviders),
    retailerId: z.string().min(1),
    category: z.enum(spendCategories),
    earnRate: z.number().min(0).max(1).optional(),
    maxRewardLabel: z.string().trim().min(1).max(80),
    estimateMethod: z.enum([
        "percentage",
        "rand-per-litre",
        "qualifying-spend",
    ]),
    rewardValue: z.number().min(0).max(100),
    rewardType: z.enum(rewardTypes),
    conditions: z.string().trim().max(400).optional(),
    monthlyCap: z.number().min(0).max(100000).optional(),
    active: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SimulatorFormValues = z.infer<typeof simulatorSchema>;
export type RetailerFormValues = z.infer<typeof retailerSchema>;
export type RewardRuleFormValues = z.infer<typeof rewardRuleSchema>;
