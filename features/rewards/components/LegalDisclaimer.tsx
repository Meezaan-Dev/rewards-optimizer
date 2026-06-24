import Link from "next/link";

const sections = [
    {
        title: "Independent resource",
        body: [
            "Rewards Optimizer is an independent, unofficial tool. It is not owned, operated, sponsored, or endorsed by Standard Bank, UCount, Discovery, Discovery Bank, Discovery Miles, or any retailer or rewards programme mentioned on this site.",
            "Nothing on this site creates a partnership, agency, or affiliation with those organisations. Names and logos are used only to describe publicly available programmes and help you compare options.",
        ],
    },
    {
        title: "Estimates, not advice",
        body: [
            "Calculations, rankings, and rule summaries are estimates based on publicly available information and may be incomplete, outdated, or wrong for your situation.",
            "This site does not provide financial, legal, or tax advice. Use it as a starting point only — not as a substitute for reading official programme terms or speaking to your bank or financial adviser.",
        ],
    },
    {
        title: "Always verify with official sources",
        body: [
            "Before you spend, redeem miles, or change cards or accounts, confirm earn rates, caps, exclusions, and eligibility on the official UCount, Discovery Miles, and retailer websites.",
            "Programme rules change. If this site disagrees with an official source, the official source wins.",
        ],
    },
    {
        title: "No guarantees",
        body: [
            "We do not guarantee accuracy, availability, or that following any suggestion here will maximise your rewards.",
            "You use this site at your own risk. We are not liable for losses or missed rewards arising from reliance on this content.",
        ],
    },
] as const;

export function LegalDisclaimer() {
    return (
        <div className="space-y-5 sm:space-y-6">
            <div>
                <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
                    Legal disclaimer
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-600">
                    Last updated: June 2026. Please read this before using the
                    calculator or relying on any information shown here.
                </p>
            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <section
                        className="rounded-[1.25rem] border-2 border-zinc-950 bg-white p-4 sm:p-5"
                        key={section.title}
                    >
                        <h2 className="text-lg font-black tracking-tight">
                            {section.title}
                        </h2>
                        <div className="mt-3 space-y-3 text-sm font-medium leading-6 text-zinc-700">
                            {section.body.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <p className="text-sm font-medium leading-6 text-zinc-600">
                Questions about this disclaimer?{" "}
                <Link
                    className="font-extrabold text-zinc-950 underline underline-offset-2 hover:text-zinc-700"
                    href="/"
                >
                    Return to the calculator
                </Link>
                .
            </p>
        </div>
    );
}
