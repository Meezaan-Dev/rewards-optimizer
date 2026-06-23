import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const config = [{
    ignores: [
        ".next/**",
        "node_modules/**",
        "dist/**",
        "build/**",
        ".git/**",
    ],
}, ...compat.extends("next/core-web-vitals"), {
    rules: {
        semi: "warn",
        quotes: ["warn", "double"],
        indent: ["warn", 4],
        "@next/next/no-assign-module-variable": "off",

        "max-len": ["warn", {
            code: 80,
            tabWidth: 4,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
    },
}];

export default config;
