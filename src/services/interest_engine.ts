export interface InterestResult {
    title: string;
    type: 'USER_SELECTED' | 'AI_DISCOVERY';
    category?: string; // Optional category to help with styling or filtering
}

// 1. The Mapping Logic (The Database)
const KNOWLEDGE_GRAPH: Record<string, string[]> = {
    'Trains': ['Shinkansen', 'Maglev', 'The_Ghan', 'London_Underground_Mosquito'],
    'Minecraft': ['Redstone_circuits', 'Voxel', 'Markus_Persson', 'Procedural_generation'],
    'Space': ['Lagrange_point', 'Fermi_paradox', 'Dyson_sphere', 'Voyager_Golden_Record'],
    'History': ['Bronze_Age_collapse', 'Library_of_Alexandria', 'Defenestration_of_Prague'],
    'Coding': ['Esoteric_programming_language', 'Unix_philosophy', 'TempleOS'],
    'Vocaloid': ['Hatsune_Miku', 'Synthesizer_V', 'Kagerou_Project', 'MikuMikuDance'],
    'Mycology': ['Paul_Stamets', 'Mycelium', 'Cordyceps', 'Lichen'],
    'Brutalism': ['Barbican_Estate', 'Habitat_67', 'Concrete', 'Le_Corbusier'],
    'Speedrunning': ['TasBot', 'Sequence_breaking', 'Games_Done_Quick', 'Frame_perfect'],
    'Liminal Spaces': ['The_Backrooms', 'Dead_mall', 'Nostalgicore', 'Kenopsia'],
    'Cybernetics': ['Transhumanism', 'Neural_interface', 'Kevin_Warwick', 'Cyborg'],
    'Glitch Art': ['Datamoshing', 'Circuit_bending', 'Artifact_(error)', 'Scanimate'],
    'Keyboards': ['Mechanical_keyboard', 'Model_M_keyboard', 'Dvorak_keyboard_layout', 'Keycap'],
    'Typography': ['Helvetica', 'Kerning', 'Ligature_(writing)', 'Swiss_Style'],
    'Synthwave': ['Vaporwave', 'Outrun_(genre)', 'FM_synthesis', 'Blade_Runner'],
    'South Africa': ['Table_Mountain', 'Apartheid', 'Nelson_Mandela', 'Kruger_National_Park'],
    'Fallout': ['Vault-Tec', 'Brotherhood_of_Steel', 'Pip-Boy', 'Nuka-Cola'],
};

// Fallback for unknown topics
const RANDOM_DEEP_CUTS = [
    'Voynich_manuscript',
    'Antikythera_mechanism',
    'Göbekli_Tepe',
    'Tardigrade',
    'Bio-luminescence',
    'Demon_core',
    'Numbers_station'
];

// 2. The "Expander" Function
export function generateGrid(userInputs: string[]): InterestResult[] {
    const results: InterestResult[] = [];
    const usedTitles = new Set<string>();

    // Phase Logic:
    // Limit 2 inputs -> Total 4 (2 User + 2 AI)
    // Limit 5 inputs -> Total 10 (User + 3 AI per batch? No, prompt said "Total Output: 10 Items" for Phase 2)
    // The prompt says:
    // Phase 1 (Limit 2 inputs): Return 2 User + 2 Related. Total 4.
    // Phase 2 (Limit 5 inputs): Return (All User Inputs) + 3 Related (New?). Total 10? 
    // Wait, prompt says "Total Output: 10 Items". If user inputs 5, then 5 AI needed.
    // Let's implement a dynamic scaling: 
    // Always keep user inputs. Fill the rest of the target grid size with AI discoveries.

    // Target grid size based on input count
    let targetSize = 4;
    if (userInputs.length > 2) {
        targetSize = 10;
    }

    // 1. Add User Selections
    userInputs.forEach(input => {
        results.push({
            title: input,
            type: 'USER_SELECTED'
        });
        usedTitles.add(input);
    });

    // 2. Find Related "Deep Cuts"
    const relatedPool: string[] = [];

    userInputs.forEach(input => {
        // Simple case-insensitive match
        const key = Object.keys(KNOWLEDGE_GRAPH).find(k => k.toLowerCase() === input.toLowerCase());

        if (key) {
            // Add related items to pool
            KNOWLEDGE_GRAPH[key].forEach(related => {
                if (!usedTitles.has(related)) {
                    relatedPool.push(related);
                }
            });
        }
    });

    // Shuffle pool to get random deep cuts
    const shuffledPool = relatedPool.sort(() => 0.5 - Math.random());

    // 3. Fill the grid
    while (results.length < targetSize) {
        let nextTitle = shuffledPool.pop();

        // If run out of relevant matches, pick from global randoms
        if (!nextTitle) {
            const randomPick = RANDOM_DEEP_CUTS.filter(t => !usedTitles.has(t));
            if (randomPick.length > 0) {
                nextTitle = randomPick[Math.floor(Math.random() * randomPick.length)];
            }
        }

        if (nextTitle && !usedTitles.has(nextTitle)) {
            results.push({
                title: nextTitle,
                type: 'AI_DISCOVERY'
            });
            usedTitles.add(nextTitle);
        } else {
            // Hard break if we really can't find anything to avoid infinite loop
            break;
        }
    }

    return results;
}
