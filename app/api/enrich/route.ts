import { NextRequest, NextResponse } from "next/server";
import { enrichCompany } from "@/lib/enrich";

export async function POST(req: NextRequest) {
    try {
        const { name, website } = await req.json();

        if (!name || !website) {
            return NextResponse.json(
                { error: "Name and website are required" },
                { status: 400 }
            );
        }

        const result = await enrichCompany(name, website);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Enrichment error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to enrich company" },
            { status: 500 }
        );
    }
}
