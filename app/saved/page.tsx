"use client";

import { useState, useEffect } from "react";
import {
    Bookmark,
    Search,
    Trash2,
    Play,
    Clock,
    ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedSearch {
    id: string;
    query: string;
    filters: any;
    createdAt: string;
}

export default function SavedSearchesPage() {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem("vc_saved_searches");
        if (saved) {
            setSavedSearches(JSON.parse(saved));
        } else {
            const initial = [
                {
                    id: "1",
                    query: "Robotics in SF",
                    filters: { industry: "Robotics", location: "San Francisco" },
                    createdAt: new Date().toISOString()
                },
                {
                    id: "2",
                    query: "Series A Fintech",
                    filters: { stage: "Series A", industry: "Fintech" },
                    createdAt: new Date().toLocaleDateString()
                }
            ];
            setSavedSearches(initial);
            localStorage.setItem("vc_saved_searches", JSON.stringify(initial));
        }
    }, []);

    const handleDelete = (id: string) => {
        const updated = savedSearches.filter(s => s.id !== id);
        setSavedSearches(updated);
        localStorage.setItem("vc_saved_searches", JSON.stringify(updated));
    };

    const handleRun = (search: SavedSearch) => {
        router.push(`/companies?q=${encodeURIComponent(search.query)}`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Saved Searches</h1>
                <p className="text-gray-500 dark:text-gray-400">Quickly re-run your frequent pipeline queries.</p>
            </div>

            <div className="space-y-4">
                {savedSearches.map((search) => (
                    <div key={search.id} className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-300 dark:hover:border-brand-700 transition-all group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 transition-colors">
                                <Bookmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    {search.query}
                                    <span className="p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <ExternalLink className="w-3 h-3 text-gray-400 hover:text-brand-600" />
                                    </span>
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(search.filters).map(([key, val]: [string, any]) => (
                                        <span key={key} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 rounded">
                                            {key}: {val}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                                    <Clock className="w-3 h-3" />
                                    Last Run
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {new Date(search.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRun(search)}
                                    className="p-2.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                </button>
                                <button
                                    onClick={() => handleDelete(search.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {savedSearches.length === 0 && (
                    <div className="py-20 text-center glass-card rounded-2xl border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No saved searches yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Save a search from the discovery page to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
