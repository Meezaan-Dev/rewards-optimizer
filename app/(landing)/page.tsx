import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { DashboardHome } from "@/features/rewards/components/DashboardHome";

export default function LandingPage() {
    return (
        <RewardsAppShell>
            <DashboardHome />
        </RewardsAppShell>
    );
}
