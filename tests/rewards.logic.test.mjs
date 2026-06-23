import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, test } from "node:test";

import {
    estimateRewardValue,
    FUEL_RAND_PER_LITRE_ASSUMPTION,
} from "../features/rewards/lib/reward-estimates";

const dataFile = new URL(
    "../features/rewards/lib/generated-source-data.ts",
    import.meta.url
);

describe("source-backed rewards data", () => {
    test("includes official source metadata for both ecosystems", async () => {
        const data = await readFile(dataFile, "utf8");

        assert.match(data, /Standard Bank UCount/);
        assert.match(data, /Discovery Miles/);
        assert.match(data, /sourceUrl/);
        assert.match(data, /sourceExtract/);
        assert.match(data, /lastFetched/);
    });

    test("calculates percentage estimates from qualifying spend", () => {
        const rule = {
            estimateMethod: "percentage",
            rewardValue: 0.75,
        };

        assert.equal(estimateRewardValue(rule, 800), 600);
    });

    test("calculates fuel estimates with the R25 per litre assumption", () => {
        const rule = {
            estimateMethod: "rand-per-litre",
            rewardValue: 10,
        };

        assert.equal(
            estimateRewardValue(rule, 500),
            (500 / FUEL_RAND_PER_LITRE_ASSUMPTION) * 10
        );
    });

    test("sorts no-rule cases below source-backed rules", () => {
        const rules = [
            { estimateMethod: "percentage", rewardValue: 0 },
            { estimateMethod: "percentage", rewardValue: 0.2 },
        ];

        rules.sort((first, second) => second.rewardValue - first.rewardValue);

        assert.equal(rules[0].rewardValue, 0.2);
    });
});
