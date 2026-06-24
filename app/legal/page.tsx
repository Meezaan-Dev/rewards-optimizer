import { RewardsAppShell } from "@/features/rewards/components/AppShell";
import { LegalDisclaimer } from "@/features/rewards/components/LegalDisclaimer";

export default function LegalPage() {
    return (
        <RewardsAppShell>
            <LegalDisclaimer />
        </RewardsAppShell>
    );
}
