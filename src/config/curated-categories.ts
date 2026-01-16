export interface CategoryConfig {
    id: string;      // Display Name
    type: 'wiki_article' | 'wiki_category' | 'fandom';
    target: string;  // Slug or Title
    api_url?: string; // Fandom API URL
}

export const COOL_CATEGORIES: CategoryConfig[] = [
    // --- FANDOM (Pop Culture / Deep Lore) ---
    { id: 'Cyberpunk', type: 'fandom', target: 'Main_Page', api_url: 'https://cyberpunk.fandom.com/api.php' },
    { id: 'Fallout', type: 'fandom', target: 'Fallout_Wiki', api_url: 'https://fallout.fandom.com/api.php' },
    { id: 'The_Backrooms', type: 'fandom', target: 'The_Backrooms_Wiki', api_url: 'https://backrooms.fandom.com/api.php' },
    { id: 'SCP_Foundation', type: 'fandom', target: 'SCP_Foundation', api_url: 'https://scp.fandom.com/api.php' },
    { id: 'Star_Wars', type: 'fandom', target: 'Main_Page', api_url: 'https://starwars.fandom.com/api.php' },
    { id: 'Matrix', type: 'fandom', target: 'Main_Page', api_url: 'https://matrix.fandom.com/api.php' },
    { id: 'Dune', type: 'fandom', target: 'Main_Page', api_url: 'https://dune.fandom.com/api.php' },

    // --- WIKIPEDIA (Concepts / aesthetics) ---
    { id: 'Brutalist_architecture', type: 'wiki_article', target: 'Brutalist_architecture' },
    { id: 'Lost_media', type: 'wiki_article', target: 'Lost_media' },
    { id: 'Cryptids', type: 'wiki_article', target: 'List_of_cryptids' },
    { id: 'Megastructures', type: 'wiki_article', target: 'Megastructure' },
    { id: 'Liminal_spaces', type: 'wiki_article', target: 'Liminality' }, // Best match for aesthetic
    { id: 'Out-of-place_artifacts', type: 'wiki_article', target: 'Out-of-place_artifact' },
    { id: 'Glitch_art', type: 'wiki_article', target: 'Glitch_art' },
    { id: 'Hyperreality', type: 'wiki_article', target: 'Hyperreality' },
    { id: 'Vaporwave', type: 'wiki_article', target: 'Vaporwave' },
    { id: 'Nuclear_semiotics', type: 'wiki_article', target: 'Human_interference_task_force' }, // The actual cool article
    { id: 'Mega-projects', type: 'wiki_category', target: 'Megaprojects' },
    { id: 'Retro-futurism', type: 'wiki_article', target: 'Retrofuturism' },
    { id: 'Transhumanism', type: 'wiki_article', target: 'Transhumanism' },
    { id: 'Artificial_life', type: 'wiki_article', target: 'Artificial_life' },
    { id: 'Dystopias', type: 'wiki_category', target: 'Dystopias' },
    { id: 'Urban_legends', type: 'wiki_article', target: 'Urban_legend' },
    { id: 'Alternate_history', type: 'wiki_article', target: 'Alternate_history' },
    { id: 'Memetics', type: 'wiki_article', target: 'Memetics' },
    { id: 'Cognitive_biases', type: 'wiki_article', target: 'List_of_cognitive_biases' },
    { id: 'Paradoxes', type: 'wiki_article', target: 'List_of_paradoxes' },
    { id: 'Surrealism', type: 'wiki_article', target: 'Surrealism' },
    { id: 'Experimental_music', type: 'wiki_article', target: 'Experimental_music' },
    { id: 'Secret_societies', type: 'wiki_article', target: 'Secret_society' },
    { id: 'Espionage', type: 'wiki_article', target: 'Espionage' },
    { id: 'Hoaxes', type: 'wiki_category', target: 'Hoaxes' },
    { id: 'Dark_matter', type: 'wiki_article', target: 'Dark_matter' },
    { id: 'Quantum_mechanics', type: 'wiki_article', target: 'Quantum_mechanics' },
    { id: 'Time_travel', type: 'wiki_article', target: 'Time_travel' },
    { id: 'Cyberwarfare', type: 'wiki_article', target: 'Cyberwarfare' },
    { id: 'Hacktivism', type: 'wiki_article', target: 'Hacktivism' },
    { id: 'Nanotechnology', type: 'wiki_article', target: 'Nanotechnology' },
    { id: 'Artificial_intelligence', type: 'wiki_article', target: 'Artificial_intelligence' },
    { id: 'Post-apocalyptic', type: 'wiki_article', target: 'Post-apocalyptic_fiction' },
    { id: 'Steampunk', type: 'wiki_article', target: 'Steampunk' },
    { id: 'Solarpunk', type: 'wiki_article', target: 'Solarpunk' },
];
