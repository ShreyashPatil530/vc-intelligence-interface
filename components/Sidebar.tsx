"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    ListTodo,
    Bookmark,
    Search,
    TrendingUp,
    LayoutDashboard
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: ListTodo },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-brand-600">
                    <TrendingUp className="w-8 h-8" />
                    <span>VC Intelligence</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-brand-600 dark:text-brand-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                            )} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                    <p className="text-sm font-semibold mb-1">Pro Access</p>
                    <p className="text-xs text-brand-100 mb-3">Enrich unlimited companies and export lists.</p>
                    <button className="w-full py-2 bg-white text-brand-700 text-xs font-bold rounded-lg hover:bg-brand-50 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
}
