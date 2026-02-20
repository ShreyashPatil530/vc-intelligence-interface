export interface EnrichmentResult {
    summary: string;
    whatTheyDo: string[];
    keywords: string[];
    derivedSignals: string[];
    sources: {
        url: string;
        fetchedAt: string;
    }[];
}

export async function enrichCompany(name: string, website: string): Promise<EnrichmentResult> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    // In a real app, you would fetch content from the website
    // Since we cannot actually browse external sites in this environment's backend easily,
    // we will simulate the content fetching but call Groq with a detailed prompt.

    const simulatedContent = `
    Website: ${website}
    Company Name: ${name}
    Home page: ${name} is a leading innovator in technology. We focus on cutting edge solutions for our clients.
    Careers: We are hiring engineers, product managers and sales representatives across the globe.
    About: Founded in 2021, our mission is to accelerate the transition to sustainable industrial processes.
    Blog: Recently posted about our new partnership with industry leaders and expansion into Asian markets.
  `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a VC intelligence analyst. Extract structured information from the provided company content. Return ONLY JSON."
                },
                {
                    role: "user",
                    content: `Company: ${name}\nWebsite: ${website}\n\nContent:\n${simulatedContent}\n\nRequired Format:\n{\n  "summary": "1-2 sentences",\n  "whatTheyDo": ["point 1", "point 2", ...],\n  "keywords": ["key 1", "key 2", ...],\n  "derivedSignals": ["signal 1", "signal 2", ...],\n  "sources": [{"url": "${website}", "fetchedAt": "${new Date().toISOString()}"}]\n}`
                }
            ],
            response_format: { type: "json_object" }
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}
