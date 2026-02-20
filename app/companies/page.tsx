"use client";

import { useState, useEffect, Suspense } from "react";
import companiesData from "@/data/companies.json";
import Link from "next/link";
import {
    ChevronRight,
    MapPin,
    Layers,
    Search,
    Filter as FilterIcon,
    ArrowUpDown,
    MoreHorizontal,
    X,
    Loader2
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Company {
    id: string;
    name: string;
    website: string;
    industry: string;
    stage: string;
    location: string;
    description: string;
}

function CompaniesList() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q') || "";

    const [search, setSearch] = useState(queryParam);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        industry: "All",
        stage: "All"
    });

    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companiesData);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'asc' | 'desc' } | null>(null);

    const industries = ["All", ...Array.from(new Set(companiesData.map(c => c.industry)))];
    const stages = ["All", ...Array.from(new Set(companiesData.map(c => c.stage)))];

    useEffect(() => {
        let result = companiesData.filter(c => {
            const matchesSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.industry.toLowerCase().includes(search.toLowerCase()) ||
                c.location.toLowerCase().includes(search.toLowerCase());

            const matchesIndustry = activeFilters.industry === "All" || c.industry === activeFilters.industry;
            const matchesStage = activeFilters.stage === "All" || c.stage === activeFilters.stage;

            return matchesSearch && matchesIndustry && matchesStage;
        });

        if (sortConfig) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredCompanies(result);
    }, [search, sortConfig, activeFilters]);

    const handleSort = (key: keyof Company) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Company Discovery</h1>
                    <p className="text-gray-500 dark:text-gray-400">Find and track high-growth technology companies.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-gray-200 dark:bg-white/10' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FilterIcon className="w-4 h-4" />
                            <span>Filter</span>
                            {(activeFilters.industry !== "All" || activeFilters.stage !== "All") && (
                                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-30 p-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm">Advanced Filters</h3>
                                    <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-gray-400" /></button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Industry</label>
                                        <select
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none"
                                            value={activeFilters.industry}
                                            onChange={(e) => setActiveFilters(prev => ({ ...prev, industry: e.target.value }))}
                                        >
                                            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Stage</label>
                                        <select
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none"
                                            value={activeFilters.stage}
                                            onChange={(e) => setActiveFilters(prev => ({ ...prev, stage: e.target.value }))}
                                        >
                                            {stages.map(stg => <option key={stg} value={stg}>{stg}</option>)}
                                        </select>
                                    </div>

                                    <button
                                        className="w-full py-2 bg-gray-100 dark:bg-white/5 text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                        onClick={() => setActiveFilters({ industry: "All", stage: "All" })}
                                    >
                                        Reset All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="btn-primary">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-4 bg-gray-50/50 dark:bg-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies by name, industry or location..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        {filteredCompanies.length} result{filteredCompanies.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                                <th className="px-6 py-4 cursor-pointer hover:text-brand-600 transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Company <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-brand-600 transition-colors" onClick={() => handleSort('industry')}>
                                    <div className="flex items-center gap-2">
                                        Industry <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-brand-600 transition-colors" onClick={() => handleSort('stage')}>
                                    <div className="flex items-center gap-2">
                                        Stage <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-brand-600 transition-colors" onClick={() => handleSort('location')}>
                                    <div className="flex items-center gap-2">
                                        Location <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                            {filteredCompanies.map((company) => (
                                <tr
                                    key={company.id}
                                    className="group hover:bg-brand-50/50 dark:hover:bg-brand-900/10 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Link href={`/companies/${company.id}`} className="block">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                                                    {company.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{company.name}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{company.website.replace('https://', '')}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {company.industry}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                            <Layers className="w-4 h-4 text-gray-400" />
                                            {company.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            {company.location}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                            <Link href={`/companies/${company.id}`} className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCompanies.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No companies found matching your search.</p>
                            <button className="mt-4 text-brand-600 font-semibold" onClick={() => setSearch("")}>Clear search</button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50 dark:bg-white/5">
                    <div>Showing 1-{filteredCompanies.length} of {filteredCompanies.length}</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin w-8 h-8 text-brand-600" /></div>}>
            <CompaniesList />
        </Suspense>
    );
}
