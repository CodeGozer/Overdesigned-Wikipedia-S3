import { NextResponse } from 'next/server';

// TODO: Plak hier je OpenRouter API Key!
const OPENROUTER_API_KEY = "PLAK_HIER_JE_OPENROUTER_KEY";

export async function POST(request: Request) {
    try {
        const { terms } = await request.json();

        if (!terms || !Array.isArray(terms) || terms.length < 2) {
            return NextResponse.json({ error: 'Provide at least two terms to blend' }, { status: 400 });
        }

        const prompt = `
You are an "Interest Discovery Engine" designed to find quirky, fascinating intersections between seemingly unrelated topics that will send the user down a Wikipedia rabbit hole.
The user will provide an array of topics. You must find the deepest cultural, historical, fictional, or scientific bridge that connects them.
Do not just mash the words together. 
For example: 
[Apple, Orange] -> Smoothie
[South Africa, Malaysia] -> Cape Malays
[Batman, Vampire] -> Batman & Dracula: Red Rain
[Nuclear Physics, Art] -> Trinity (nuclear test) glass (Trinitite)

Only return a valid JSON array of strings containing exactly 3 highly specific Wikipedia article titles that represent this quirky synthesis, ordered by how mind-blowing they are.
Do not include markdown or code block syntax like \`\`\`json. Just the raw JSON array.

Topics: [${terms.join(', ')}]
        `;

        // Directe Fetch naar OpenRouter (geen zware SDK nodig!)
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Je kunt hier elk model op OpenRouter kiezen! 
                // Zelfs de "free" versies als je key geen tegoed heeft.
                model: "google/gemini-2.5-flash", 
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("OpenRouter Error:", data);
            return NextResponse.json({ error: 'Failed to process blend' }, { status: 500 });
        }

        let text = data.choices[0].message.content;
        
        // Log the raw output to your terminal so you can see wat het doet!
        console.log("\n[OPENROUTER RAW OUTPUT]:\n", text, "\n");
        
        // Clean markdown backticks if AI ignores instruction
        text = text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
        
        try {
            const blendedTitles = JSON.parse(text);
            return NextResponse.json({ titles: blendedTitles });
        } catch (e) {
            console.error("Failed to parse AI response:", text);
            // Fallback
            return NextResponse.json({ titles: [terms.join(' ')] });
        }
        
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Failed to process blend' }, { status: 500 });
    }
}
