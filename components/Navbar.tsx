"use client";

import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search companies, signals, or investors..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-black border focus:border-brand-500 rounded-full transition-all text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-xs cursor-pointer hover:ring-2 hover:ring-brand-500 transition-all">
                    JD
                </div>
            </div>
        </header>
    );
}
