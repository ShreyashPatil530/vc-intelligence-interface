"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import companiesData from "@/data/companies.json";
import {
    ArrowLeft,
    Globe,
    MapPin,
    Building2,
    Clock,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save,
    Plus
} from "lucide-react";
import Link from "next/link";
import { EnrichmentResult } from "@/lib/enrich";

export default function CompanyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<any>(null);
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentResult, setEnrichmentResult] = useState<EnrichmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [lists, setLists] = useState<any[]>([]);

    useEffect(() => {
        const found = companiesData.find(c => c.id === id);
        if (found) {
            setCompany(found);
            const savedNotes = localStorage.getItem(`notes_${id}`);
            if (savedNotes) setNotes(savedNotes);

            const cachedEnrichment = localStorage.getItem(`enrichment_${id}`);
            if (cachedEnrichment) {
                setEnrichmentResult(JSON.parse(cachedEnrichment));
            }

            const savedLists = localStorage.getItem("vc_lists");
            if (savedLists) setLists(JSON.parse(savedLists));
        }
    }, [id]);

    const handleAddToList = (listId: string) => {
        const updatedLists = lists.map(list => {
            if (list.id === listId && !list.companyIds.includes(id)) {
                return { ...list, companyIds: [...list.companyIds, id] };
            }
            return list;
        });
        setLists(updatedLists);
        localStorage.setItem("vc_lists", JSON.stringify(updatedLists));
        alert(`Added to list!`);
    };

    const handleSaveNotes = () => {
        setIsSaving(true);
        localStorage.setItem(`notes_${id}`, notes);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleEnrich = async () => {
        setIsEnriching(true);
        setError(null);
        try {
            const response = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: company.name, website: company.website }),
            });

            if (!response.ok) {
                throw new Error("Failed to enrich company data");
            }

            const result = await response.json();
            setEnrichmentResult(result);
            localStorage.setItem(`enrichment_${id}`, JSON.stringify(result));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsEnriching(false);
        }
    };

    if (!company) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{company.name}</h1>
                        <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 text-sm font-semibold uppercase tracking-wider">
                            {company.stage}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-500">
                        <span className="flex items-center gap-1.5 underline">
                            <Globe className="w-4 h-4" />
                            {company.website.replace('https://', '')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {company.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {company.industry}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative group">
                        <button className="btn-secondary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Add to List</span>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                            <div className="p-2 space-y-1">
                                {lists.length > 0 ? lists.map(list => (
                                    <button
                                        key={list.id}
                                        onClick={() => handleAddToList(list.id)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                    >
                                        {list.name}
                                    </button>
                                )) : (
                                    <p className="px-3 py-2 text-xs text-gray-500 italic">No lists found</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-500/20"
                        onClick={handleEnrich}
                        disabled={isEnriching}
                    >
                        {isEnriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>{enrichmentResult ? "Re-enrich" : "Enrich Profile"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Company Overview</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {company.description}
                        </p>
                    </div>

                    {isEnriching && (
                        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-brand-600 mx-auto" />
                            <div>
                                <p className="text-lg font-bold">Enriching Intelligence</p>
                                <p className="text-gray-500">Analyzing public records, news, and signals...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-800 dark:text-red-400">Enrichment Failed</p>
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                <button onClick={handleEnrich} className="mt-2 text-sm font-bold text-red-800 underline">Try again</button>
                            </div>
                        </div>
                    )}

                    {enrichmentResult && !isEnriching && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-brand-600">
                                <div className="flex items-center gap-2 mb-4 text-brand-600">
                                    <Sparkles className="w-5 h-5" />
                                    <h2 className="text-lg font-bold">AI Summary</h2>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed">
                                    "{enrichmentResult.summary}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Key Capabilities
                                    </h3>
                                    <ul className="space-y-3">
                                        {enrichmentResult.whatTheyDo.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        Derived Signals
                                    </h3>
                                    <div className="space-y-3">
                                        {enrichmentResult.derivedSignals.map((signal, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                                                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                                <span className="text-sm font-medium">{signal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="font-bold mb-4">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {enrichmentResult.keywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-default">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="text-xs text-gray-400 flex items-center gap-4 px-2">
                                {enrichmentResult.sources.map((src, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <span>Source: {src.url}</span>
                                        <span className="opacity-50">•</span>
                                        <span>Enriched: {new Date(src.fetchedAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Internal Notes</h2>
                            <button
                                onClick={handleSaveNotes}
                                disabled={isSaving}
                                className="text-brand-600 hover:text-brand-700 transition-colors"
                            >
                                {isSaving ? "Saving..." : <Save className="w-5 h-5" />}
                            </button>
                        </div>
                        <textarea
                            className="w-full h-40 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                            placeholder="Add your thoughts about this company..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="glass-card rounded-2xl p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Clock className="w-12 h-12" />
                        </div>
                        <h2 className="text-lg font-bold mb-4">Signals Timeline</h2>
                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-white/5">
                            {[
                                { date: "Oct 2023", title: "New Job Posting", desc: "Senior Backend Engineer" },
                                { date: "Aug 2023", title: "Domain Update", desc: "Updated SSL certificates" },
                                { date: "May 2023", title: "Social Spike", desc: "Mentioned on HackerNews" },
                            ].map((event, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-brand-500 z-10"></div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{event.date}</p>
                                    <p className="text-sm font-semibold mt-0.5">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
