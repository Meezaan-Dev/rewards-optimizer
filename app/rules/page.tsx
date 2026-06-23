import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { RulesReference } from "@/features/rewards/components/RulesReference";

export default async function RulesPage() {
    return (
        <RewardsAppShell>
            <RulesReference />
        </RewardsAppShell>
    );
}
