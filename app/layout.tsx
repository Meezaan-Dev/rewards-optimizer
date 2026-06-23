import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Rewards Optimizer",
    description:
        "Compare UCount and Discovery Miles rewards before you spend.",
    keywords: [
        "Next.js",
        "Shadcn UI",
        "Tailwind CSS",
        "React",
        "TypeScript",
        "Rewards",
        "UCount",
        "Discovery Miles",
    ],
    authors: [{ name: "CodeLab Davis" }],
    creator: "CodeLab Davis",
    openGraph: {
        type: "website",
        locale: "en_US",
        title: "Rewards Optimizer",
        description:
            "Compare UCount and Discovery Miles rewards before you spend.",
        siteName: "Rewards Optimizer Dashboard",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden antialiased">{children}</body>
        </html>
    );
}
