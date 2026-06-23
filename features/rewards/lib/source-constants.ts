export const UCOUNT_SOURCE_URL =
    "https://ucount.standardbank.co.za/personal/earn-points/how-to-earn-points/";

export const DISCOVERY_SOURCE_URL =
    "https://www.discovery.co.za/vitality/how-to-earn-miles";

export const RATE_PATTERNS = {
    ucountRetailer: /up to\s+(\d+)%[^.]+Rewards Retailers/i,
    ucountFuelRandPerLitre: /up to\s+R(\d+)[^/]*per litre/i,
    discoveryHealthyFood: /up to\s+(\d+)%[^.]+HealthyFood/i,
    discoveryHealthyFoodBoosted:
        /boost[^.]+HealthyFood[^.]+up to\s+(\d+)%/i,
    discoveryHealthyCare: /up to\s+(\d+)%[^.]+HealthyCare/i,
    discoveryTransport: /up to\s+(\d+)%[^.]+bp[^.]+Shell[^.]+Uber/i,
} as const;

export const RATE_FALLBACKS = {
    ucountRetailerRate: 0.3,
    ucountFuelRandPerLitre: 10,
    discoveryHealthyFoodRate: 0.25,
    discoveryHealthyFoodBoostedRate: 0.75,
    discoveryHealthyCareRate: 0.5,
    discoveryTransportRate: 0.2,
} as const;
