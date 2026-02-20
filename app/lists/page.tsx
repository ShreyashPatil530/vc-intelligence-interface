"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Download,
    FileJson,
    FileSpreadsheet,
    ListTodo,
    MoreVertical,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import companiesData from "@/data/companies.json";

interface List {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
}

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [newListName, setNewListName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const savedLists = localStorage.getItem("vc_lists");
        if (savedLists) {
            setLists(JSON.parse(savedLists));
        } else {
            // Default list
            const initial = [{
                id: "1",
                name: "Q1 Opportunities",
                companyIds: ["1", "3", "5"],
                createdAt: new Date().toISOString()
            }];
            setLists(initial);
            localStorage.setItem("vc_lists", JSON.stringify(initial));
        }
    }, []);

    const saveLists = (updatedLists: List[]) => {
        setLists(updatedLists);
        localStorage.setItem("vc_lists", JSON.stringify(updatedLists));
    };

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList: List = {
            id: Math.random().toString(36).substr(2, 9),
            name: newListName,
            companyIds: [],
            createdAt: new Date().toISOString()
        };
        saveLists([...lists, newList]);
        setNewListName("");
        setIsCreating(false);
    };

    const handleDeleteList = (id: string) => {
        saveLists(lists.filter(l => l.id !== id));
    };

    const exportList = (list: List, format: 'json' | 'csv') => {
        const listCompanies = companiesData.filter(c => list.companyIds.includes(c.id));
        let content = "";
        let mimeType = "";
        let fileName = `${list.name.replace(/\s+/g, '_')}.${format}`;

        if (format === 'json') {
            content = JSON.stringify(listCompanies, null, 2);
            mimeType = "application/json";
        } else {
            const headers = ["id", "name", "website", "industry", "stage", "location"];
            const rows = listCompanies.map(c => [c.id, c.name, c.website, c.industry, c.stage, c.location].join(","));
            content = [headers.join(","), ...rows].join("\n");
            mimeType = "text/csv";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Your Lists</h1>
                    <p className="text-gray-500 dark:text-gray-400">Organize and export your curated company sets.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New List</span>
                </button>
            </div>

            {isCreating && (
                <div className="glass-card rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <h3 className="font-bold mb-4">Create New List</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Fintech Series A, Sustainability..."
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                            autoFocus
                        />
                        <button className="btn-primary" onClick={handleCreateList}>Create</button>
                        <button className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lists.map((list) => (
                    <div key={list.id} className="glass-card rounded-2xl p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-all group shadow-sm hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400">
                                <ListTodo className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => exportList(list, 'csv')}
                                    title="Export CSV"
                                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => exportList(list, 'json')}
                                    title="Export JSON"
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <FileJson className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteList(list.id)}
                                    title="Delete List"
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold group-hover:text-brand-600 transition-colors">{list.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{list.companyIds.length} companies curated</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <div className="flex -space-x-2">
                                {list.companyIds.slice(0, 4).map((cid, i) => {
                                    const c = companiesData.find(com => com.id === cid);
                                    return (
                                        <div key={i} className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                                            {c?.name[0]}
                                        </div>
                                    );
                                })}
                                {list.companyIds.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                                        +{list.companyIds.length - 4}
                                    </div>
                                )}
                                {list.companyIds.length === 0 && (
                                    <p className="text-xs text-gray-400 italic">No companies added yet</p>
                                )}
                            </div>

                            <Link href={`/companies`} className="mt-4 flex items-center justify-between text-sm font-semibold text-brand-600 hover:text-brand-700">
                                Manage List
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {lists.length === 0 && (
                    <div className="md:col-span-2 xl:col-span-3 py-20 text-center glass-card rounded-2xl border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mb-4">
                            <ListTodo className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No lists created yet.</p>
                        <button
                            className="mt-4 text-brand-600 font-semibold"
                            onClick={() => setIsCreating(true)}
                        >
                            Create your first list
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
