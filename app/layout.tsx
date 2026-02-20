import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VC Intelligence Platform",
    description: "Modern VC discovery and enrichment tool",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex min-h-screen bg-background text-foreground">
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-w-0">
                        <Navbar />
                        <main className="flex-1 overflow-y-auto p-6 md:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
