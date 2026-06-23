import {
    faviconUrl,
    type RetailerCatalogEntry,
} from "@/features/rewards/lib/retailer-catalog";
import type { Retailer } from "@/features/rewards/lib/types";

const DESCRIPTION_META_PATTERN =
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i;
const OG_DESCRIPTION_META_PATTERN =
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i;
const OG_IMAGE_META_PATTERN =
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
const ICON_LINK_PATTERN =
    /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i;

function extractMeta(html: string, pattern: RegExp) {
    return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim();
}

function absolutiseUrl(url: string | undefined, baseUrl: string) {
    if (!url) {
        return undefined;
    }

    try {
        return new URL(url, baseUrl).toString();
    } catch {
        return undefined;
    }
}

function buildFallbackRetailer(entry: RetailerCatalogEntry): Retailer {
    return {
        id: entry.id,
        name: entry.name,
        category: entry.category,
        active: true,
        domain: entry.domain,
        websiteUrl: entry.websiteUrl,
        logoUrl: faviconUrl(entry.domain),
        storeDataSource: entry.websiteUrl,
        brandColor: entry.brandColor,
        notes: entry.notes,
    };
}

export function buildCatalogRetailers(
    catalog: RetailerCatalogEntry[] = []
): Retailer[] {
    return catalog.map(buildFallbackRetailer);
}

export async function enrichRetailerFromWebsite(
    entry: RetailerCatalogEntry
): Promise<Retailer> {
    const fallback = buildFallbackRetailer(entry);

    try {
        const response = await fetch(entry.websiteUrl, {
            headers: {
                "user-agent": "Rewards Optimizer store metadata sync",
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const html = await response.text();
        const title = extractMeta(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
        const description =
            extractMeta(html, DESCRIPTION_META_PATTERN) ??
            extractMeta(html, OG_DESCRIPTION_META_PATTERN);
        const logo =
            extractMeta(html, OG_IMAGE_META_PATTERN) ??
            extractMeta(html, ICON_LINK_PATTERN);

        return {
            ...fallback,
            logoUrl: absolutiseUrl(logo, entry.websiteUrl) ?? fallback.logoUrl,
            storeMetaTitle: title ?? fallback.name,
            storeMetaDescription: description,
        };
    } catch {
        return {
            ...fallback,
            storeMetaTitle: fallback.name,
        };
    }
}
