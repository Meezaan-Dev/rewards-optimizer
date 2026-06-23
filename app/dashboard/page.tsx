import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { DashboardHome } from "@/features/rewards/components/DashboardHome";

export default async function DashboardPage() {
    return (
        <RewardsAppShell>
            <DashboardHome />
        </RewardsAppShell>
    );
}
