import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { SpendSimulator } from "@/features/rewards/components/SpendSimulator";

export default async function SimulatorPage() {
    return (
        <RewardsAppShell>
            <SpendSimulator />
        </RewardsAppShell>
    );
}
