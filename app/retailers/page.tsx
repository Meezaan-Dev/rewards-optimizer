import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { RetailersView } from "@/features/rewards/components/RetailersView";

export default async function RetailersPage() {
    return (
        <RewardsAppShell>
            <RetailersView />
        </RewardsAppShell>
    );
}
