import { NextResponse } from 'next/server';

// TODO: Plak hier je OpenRouter API Key!
const OPENROUTER_API_KEY = "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";

export async function POST(request: Request) {
    try {
        const { terms } = await request.json();

        if (!terms || !Array.isArray(terms) || terms.length < 2) {
            return NextResponse.json({ error: 'Provide at least two terms to blend' }, { status: 400 });
        }

        const prompt = `
You are Nicopedia's "Concept Blender", an AI designed to find universally fun, intriguing, and mind-blowing connections between unrelated topics.

Your goal is to find the cultural, pop-culture, historical, or aesthetic crossover between the provided terms to send the user down a fun Wikipedia rabbit hole.
CRITICAL RULES:
1. Avoid anything overly scientific (like raw biological taxonomy), controversial, or polarizing. Keep it accessible, lighthearted, and fun!
2. You MUST return exactly 3 real, accurate Wikipedia article titles.
3. Do not just mash the words together. Find the "smoothie" that blends their vibes.

Examples:
- [Apple, Orange] -> ["Fruit salad", "Fruitopia", "Citrus"]
- [Batman, Vampire] -> ["Batman & Dracula: Red Rain", "Vampire Noir", "Count Dracula in comics"]
- [Cowboy, Space] -> ["Space Western", "Cowboy Bebop", "Firefly (TV series)"]

Only return a valid JSON array of strings. Do not include markdown \`\`\`json blocks, formatting, or conversational text. Just the raw array.

Topics to blend: [${terms.join(', ')}]
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
                max_tokens: 500, // Voeg deze limiet toe: voorkomt de "65535 tokens maar kan maar 16000 betalen" error!
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
