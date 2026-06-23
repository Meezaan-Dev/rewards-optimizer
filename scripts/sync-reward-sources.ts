import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { RETAILER_CATALOG } from "../features/rewards/lib/retailer-catalog";
import { enrichRetailerFromWebsite } from "../features/rewards/lib/retailer-enrichment";
import {
    buildOfficialSourceRules,
    DISCOVERY_SOURCE_URL,
    UCOUNT_SOURCE_URL,
} from "../features/rewards/lib/source-loader";
import type { Retailer, RewardRule } from "../features/rewards/lib/types";

const outputPath = fileURLToPath(
    new URL("../features/rewards/lib/generated-source-data.ts", import.meta.url)
);

function normaliseText(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

async function fetchSourceText(url: string) {
    const response = await fetch(url, {
        headers: {
            "user-agent": "Rewards Optimizer source sync",
        },
    });

    if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
    }

    return normaliseText(await response.text());
}

function renderGeneratedModule(input: {
    fetchedAt: string;
    mode: "synced" | "fallback";
    message: string;
    retailers: Retailer[];
    rules: RewardRule[];
}) {
    return `import type {
    Retailer,
    RewardRule,
} from "@/features/rewards/lib/types";

export const generatedAt = ${JSON.stringify(input.fetchedAt)};

export const generatedSourceStatus = ${JSON.stringify(
        { mode: input.mode, message: input.message },
        null,
        4
    )};

export const generatedRetailers: Retailer[] = ${JSON.stringify(
        input.retailers,
        null,
        4
    )};

export const generatedRewardRules: RewardRule[] = ${JSON.stringify(
        input.rules,
        null,
        4
    )};
`;
}

async function main() {
    const fetchedAt = new Date().toISOString();

    try {
        const [ucountText, discoveryText, retailers] = await Promise.all([
            fetchSourceText(UCOUNT_SOURCE_URL),
            fetchSourceText(DISCOVERY_SOURCE_URL),
            Promise.all(RETAILER_CATALOG.map(enrichRetailerFromWebsite)),
        ]);

        const rules = buildOfficialSourceRules({
            ucountText,
            discoveryText,
            fetchedAt,
        });

        await writeFile(
            outputPath,
            renderGeneratedModule({
                fetchedAt,
                mode: "synced",
                message: "Synced from official source pages.",
                retailers,
                rules,
            })
        );
    } catch (error) {
        const existing = await readFile(outputPath, "utf8");

        if (!existing.includes("generatedRewardRules")) {
            throw error;
        }

        console.warn(
            `[source-sync] Using committed fallback data: ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
