# Rewards Optimizer

A public Next.js MVP for comparing Standard Bank UCount and Discovery Miles
reward estimates before spending.

The app is intentionally no-login for the MVP. Anyone can open it and use the
simulator immediately.

## MVP Flow

1. Choose a retailer.
2. Enter a spend amount.
3. Choose a spend category.
4. Select available payment methods.
5. Compare UCount and Discovery Miles estimates.
6. See the recommended payment method and the reason for the recommendation.

## Data

Reward rules and retailers are generated from official UCount and Discovery
source pages and checked into:

- `features/rewards/lib/generated-source-data.ts`

Source sync logic lives in:

- `features/rewards/lib/source-loader.ts` — rate extraction and rule building
- `features/rewards/lib/retailer-catalog.ts` — retailer definitions
- `scripts/sync-reward-sources.ts` — fetch, enrich, and regenerate data

No user accounts, saved profiles, transaction history, or remote database are
required for this version.

## Routes

- `/` and `/dashboard` show the public dashboard.
- `/simulator` contains the spend simulator.
- `/retailers` lists retailer opportunities.
- `/rules` shows the local rule reference.

## Future Scope

Authentication can be added later if the product needs saved user profiles,
monthly spend history, personal reward statuses, transaction imports, or
favourite retailers.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```
