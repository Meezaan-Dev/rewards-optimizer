import type {
    PaymentMethod,
    RewardProvider,
    SpendCategory,
} from "@/features/rewards/lib/types";

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatProvider(provider: RewardProvider) {
    return provider === "ucount" ? "UCount" : "Discovery Miles";
}

export function formatPaymentMethod(method: PaymentMethod) {
    return method === "standard-bank-card"
        ? "Standard Bank card"
        : "Discovery Bank card";
}

export function formatCategory(category: SpendCategory) {
    return category[0].toUpperCase() + category.slice(1);
}
