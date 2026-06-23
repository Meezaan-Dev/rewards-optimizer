import type { SpendCategory } from "@/features/rewards/lib/types";

export type RetailerCatalogEntry = {
    id: string;
    name: string;
    category: SpendCategory;
    domain: string;
    websiteUrl: string;
    brandColor: string;
    notes: string;
};

export const RETAILER_CATALOG: RetailerCatalogEntry[] = [
    {
        id: "checkers",
        name: "Checkers",
        category: "groceries",
        domain: "checkers.co.za",
        websiteUrl: "https://www.checkers.co.za/",
        brandColor: "#0072ce",
        notes: "Grocery rewards appear in both UCount and Discovery Miles source material.",
    },
    {
        id: "woolworths",
        name: "Woolworths",
        category: "groceries",
        domain: "woolworths.co.za",
        websiteUrl: "https://www.woolworths.co.za/",
        brandColor: "#111111",
        notes: "Discovery HealthyFood source material names Woolworths.",
    },
    {
        id: "shoprite",
        name: "Shoprite",
        category: "groceries",
        domain: "shoprite.co.za",
        websiteUrl: "https://www.shoprite.co.za/",
        brandColor: "#e31b23",
        notes: "UCount source material references Checkers and Shoprite rewards.",
    },
    {
        id: "dis-chem",
        name: "Dis-Chem",
        category: "pharmacy",
        domain: "dischem.co.za",
        websiteUrl: "https://www.dischem.co.za/",
        brandColor: "#00a651",
        notes: "Discovery HealthyCare source material names Dis-Chem.",
    },
    {
        id: "clicks",
        name: "Clicks",
        category: "pharmacy",
        domain: "clicks.co.za",
        websiteUrl: "https://www.clicks.co.za/",
        brandColor: "#ee2a7b",
        notes: "Discovery HealthyCare source material names Clicks.",
    },
    {
        id: "astron-energy",
        name: "Astron Energy",
        category: "fuel",
        domain: "astronenergy.co.za",
        websiteUrl: "https://www.astronenergy.co.za/",
        brandColor: "#ff6a00",
        notes: "UCount source material names Astron Energy for fuel rewards.",
    },
    {
        id: "caltex",
        name: "Caltex",
        category: "fuel",
        domain: "caltex.com",
        websiteUrl: "https://www.caltex.com/",
        brandColor: "#d71920",
        notes: "UCount source material names Caltex for fuel rewards.",
    },
    {
        id: "bp",
        name: "bp",
        category: "fuel",
        domain: "bp.com",
        websiteUrl: "https://www.bp.com/en_za/south-africa/home.html",
        brandColor: "#78be20",
        notes: "Discovery source material references bp fuel rewards.",
    },
    {
        id: "shell",
        name: "Shell",
        category: "fuel",
        domain: "shell.co.za",
        websiteUrl: "https://www.shell.co.za/",
        brandColor: "#fbd600",
        notes: "Discovery source material references select Shell fuel rewards.",
    },
    {
        id: "uber",
        name: "Uber",
        category: "transport",
        domain: "uber.com",
        websiteUrl: "https://www.uber.com/za/en/",
        brandColor: "#000000",
        notes: "Discovery source material references Uber transport rewards.",
    },
];

export function faviconUrl(domain: string) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
