"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calculator,
    Home,
    Scale,
    Store,
} from "lucide-react";

import { cn } from "@/lib/utils";

type RewardsAppShellProps = {
    children: React.ReactNode;
};

const navItems = [
    { href: "/", label: "Home", icon: Home, match: ["/", "/dashboard"] },
    { href: "/simulator", label: "Simulator", icon: Calculator, match: ["/simulator"] },
    { href: "/retailers", label: "Retailers", icon: Store, match: ["/retailers"] },
    { href: "/rules", label: "Rules", icon: Scale, match: ["/rules"] },
] as const;

function isNavActive(pathname: string, match: readonly string[]) {
    return match.some((href) =>
        href === "/" ? pathname === "/" || pathname === "/dashboard" : pathname === href
    );
}

export function RewardsAppShell({ children }: RewardsAppShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#fffdf6] text-zinc-950">
            <header className="safe-top sticky top-0 z-20 border-b-2 border-zinc-950 bg-[#fff15a]">
                <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-16 sm:px-6 lg:px-8">
                    <Link className="flex min-w-0 items-center gap-2.5 sm:gap-3" href="/">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-950 bg-white text-lg font-black shadow-[3px_3px_0_#18181b]">
                            R
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-black tracking-tight sm:text-lg">
                                Rewards Optimizer
                            </span>
                            <span className="hidden text-xs font-semibold text-zinc-700 md:block">
                                Public calculator · no login
                            </span>
                        </span>
                    </Link>

                    <nav
                        aria-label="Main navigation"
                        className="hidden items-center gap-1 md:flex"
                    >
                        {navItems.map((item) => {
                            const isActive = isNavActive(pathname, item.match);

                            return (
                                <Link
                                    className={cn(
                                        "touch-target inline-flex items-center rounded-full px-3 py-2 text-sm font-extrabold transition-colors hover:bg-white",
                                        isActive &&
                                            "bg-zinc-950 text-white hover:bg-zinc-900"
                                    )}
                                    href={item.href}
                                    key={item.href}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6 md:pb-6 lg:px-8">
                {children}
            </main>

            <footer className="mx-auto max-w-7xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-xs font-medium leading-5 text-zinc-500 sm:px-6 md:pb-8 lg:px-8">
                <p>
                    Independent resource — not affiliated with UCount, Discovery
                    Miles, or any retailer.{" "}
                    <Link
                        className="font-extrabold text-zinc-700 underline underline-offset-2 hover:text-zinc-950"
                        href="/legal"
                    >
                        Legal disclaimer
                    </Link>
                </p>
            </footer>

            <nav
                aria-label="Mobile navigation"
                className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t-2 border-zinc-950 bg-[#fff15a] md:hidden"
            >
                <div className="mx-auto grid max-w-7xl grid-cols-4 gap-1 px-2 pt-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isNavActive(pathname, item.match);

                        return (
                            <Link
                                className={cn(
                                    "touch-target flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-extrabold leading-tight transition-colors sm:text-xs",
                                    isActive
                                        ? "bg-zinc-950 text-white"
                                        : "text-zinc-800 hover:bg-white/80"
                                )}
                                href={item.href}
                                key={item.href}
                            >
                                <Icon aria-hidden className="size-5 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
