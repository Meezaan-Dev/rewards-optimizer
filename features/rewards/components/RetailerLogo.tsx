"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import type { Retailer } from "@/features/rewards/lib/types";

type RetailerLogoProps = {
    retailer: Retailer;
    size?: "sm" | "md" | "lg";
};

const sizeClasses = {
    sm: "size-10 text-sm",
    md: "size-12 text-sm sm:size-14 sm:text-base",
    lg: "size-16 text-lg sm:size-20 sm:text-xl",
};

export function RetailerLogo({ retailer, size = "md" }: RetailerLogoProps) {
    const [failed, setFailed] = useState(false);
    const initials = retailer.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("");

    return (
        <div
            className={`${sizeClasses[size]} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-zinc-950 bg-white font-black text-zinc-950`}
            style={{
                boxShadow: `4px 4px 0 ${retailer.brandColor ?? "#18181b"}`,
            }}
        >
            {retailer.logoUrl && !failed ? (
                <img
                    alt={`${retailer.name} logo`}
                    className="h-full w-full object-contain p-2"
                    onError={() => setFailed(true)}
                    src={retailer.logoUrl}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
}
