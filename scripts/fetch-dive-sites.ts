/**
 * Fetch dive sites using Exa API and generate SQL for Supabase
 * 
 * Usage: EXA_API_KEY=xxx npx tsx scripts/fetch-dive-sites.ts
 */

import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY!);

// More specific search queries targeting dive site lists
const SEARCH_QUERIES = [
  "list of famous scuba diving sites names and locations",
  "top 20 dive sites worldwide with coordinates",
  "PADI best dive sites list names",
  "scuba diving bucket list sites Caribbean Mexico",
  "famous wreck dive sites names locations",
  "manta ray diving sites names worldwide",
  "shark diving sites locations list",
  "cave diving cenotes names Mexico",
  "coral reef dive sites names Pacific",
  "Indonesia dive sites Komodo Bunaken names",
];

interface DiveSite {
  name: string;
  destination: string;
  country: string;
  lat: number;
  lng: number;
  difficulty: string;
  depth_min: number;
  depth_max: number;
  best_season: string;
  tags: string[];
}

// Known dive site patterns with approximate coordinates
const KNOWN_SITES: Record<string, Partial<DiveSite>> = {
  "cenote angelita": { country: "Mexico", lat: 20.1833, lng: -87.4667, tags: ["cenote", "cave", "freshwater"] },
  "cenote dos ojos": { country: "Mexico", lat: 20.3284, lng: -87.3905, tags: ["cenote", "cave", "freshwater", "light beams"] },
  "cenote the pit": { country: "Mexico", lat: 20.2167, lng: -87.4333, tags: ["cenote", "deep dive", "freshwater"] },
  "cozumel": { country: "Mexico", lat: 20.4333, lng: -86.9167, tags: ["reef", "drift dive", "wall"] },
  "palancar reef": { country: "Mexico", lat: 20.3167, lng: -87.0333, tags: ["reef", "wall", "coral"] },
  "socorro island": { country: "Mexico", lat: 18.7833, lng: -110.95, tags: ["manta rays", "dolphins", "sharks"] },
  "great blue hole": { country: "Belize", lat: 17.3163, lng: -87.5349, tags: ["cave", "stalactites", "sharks"] },
  "half moon caye": { country: "Belize", lat: 17.2, lng: -87.5333, tags: ["wall", "reef", "sharks"] },
  "bonaire": { country: "Netherlands", lat: 12.2, lng: -68.2667, tags: ["shore dive", "reef", "macro"] },
  "salt pier": { country: "Netherlands", lat: 12.15, lng: -68.2833, tags: ["pier", "macro", "seahorse"] },
  "curacao": { country: "Netherlands", lat: 12.1696, lng: -68.99, tags: ["reef", "wall", "wreck"] },
  "grand cayman": { country: "Cayman Islands", lat: 19.3133, lng: -81.2546, tags: ["wall", "stingrays", "wreck"] },
  "bloody bay wall": { country: "Cayman Islands", lat: 19.7, lng: -80.0667, tags: ["wall", "deep dive", "coral"] },
  "kittiwake wreck": { country: "Cayman Islands", lat: 19.3667, lng: -81.3667, tags: ["wreck", "artificial reef"] },
  "stingray city": { country: "Cayman Islands", lat: 19.3667, lng: -81.3, tags: ["stingrays", "snorkel", "beginner"] },
  "roatan": { country: "Honduras", lat: 16.3333, lng: -86.5, tags: ["reef", "wall", "whale sharks"] },
  "utila": { country: "Honduras", lat: 16.1, lng: -86.9, tags: ["whale sharks", "reef"] },
  "komodo island": { country: "Indonesia", lat: -8.55, lng: 119.45, tags: ["manta rays", "current", "reef"] },
  "castle rock": { country: "Indonesia", lat: -8.5833, lng: 119.5333, tags: ["sharks", "current", "pelagics"] },
  "batu bolong": { country: "Indonesia", lat: -8.5333, lng: 119.55, tags: ["reef", "current", "coral"] },
  "manta alley": { country: "Indonesia", lat: -8.6333, lng: 119.4833, tags: ["manta rays", "cleaning station"] },
  "bunaken": { country: "Indonesia", lat: 1.6167, lng: 124.7667, tags: ["wall", "reef", "turtles"] },
  "wakatobi": { country: "Indonesia", lat: -5.5, lng: 123.75, tags: ["reef", "macro", "pristine coral"] },
  "gili islands": { country: "Indonesia", lat: -8.35, lng: 116.05, tags: ["turtles", "reef", "beginner"] },
  "liberty wreck": { country: "Indonesia", lat: -8.2667, lng: 115.6, tags: ["wreck", "WWII", "shore dive"] },
  "crystal bay": { country: "Indonesia", lat: -8.7, lng: 115.4667, tags: ["mola mola", "reef", "sunfish"] },
  "malapascua": { country: "Philippines", lat: 11.3333, lng: 124.1167, tags: ["thresher sharks", "reef"] },
  "monad shoal": { country: "Philippines", lat: 11.35, lng: 124.1333, tags: ["thresher sharks", "deep dive"] },
  "anilao": { country: "Philippines", lat: 13.7667, lng: 120.9333, tags: ["macro", "nudibranch", "reef"] },
  "coron bay": { country: "Philippines", lat: 11.9833, lng: 120.2, tags: ["wreck", "WWII", "japanese ships"] },
  "apo island": { country: "Philippines", lat: 9.0833, lng: 123.2667, tags: ["turtles", "reef", "coral"] },
  "verde island": { country: "Philippines", lat: 13.5333, lng: 121.0667, tags: ["biodiversity", "reef", "current"] },
  "great barrier reef": { country: "Australia", lat: -18.2861, lng: 147.7, tags: ["reef", "coral", "UNESCO"] },
  "cod hole": { country: "Australia", lat: -14.7, lng: 145.65, tags: ["potato cod", "reef"] },
  "ribbon reefs": { country: "Australia", lat: -15.5, lng: 145.8, tags: ["reef", "sharks", "minke whales"] },
  "ningaloo reef": { country: "Australia", lat: -22.5, lng: 113.8, tags: ["whale sharks", "reef", "manta rays"] },
  "julian rocks": { country: "Australia", lat: -28.6333, lng: 153.6167, tags: ["grey nurse sharks", "manta rays"] },
  "fish rock cave": { country: "Australia", lat: -30.8833, lng: 153.0833, tags: ["grey nurse sharks", "cave"] },
  "maldives": { country: "Maldives", lat: 3.2028, lng: 73.2207, tags: ["manta rays", "whale sharks", "reef"] },
  "hanifaru bay": { country: "Maldives", lat: 5.2833, lng: 73.0167, tags: ["manta rays", "aggregation", "snorkel"] },
  "maaya thila": { country: "Maldives", lat: 4.1167, lng: 72.95, tags: ["reef", "sharks", "night dive"] },
  "fish head": { country: "Maldives", lat: 4.15, lng: 72.9, tags: ["sharks", "reef", "current"] },
  "kuredu express": { country: "Maldives", lat: 5.55, lng: 73.45, tags: ["manta rays", "sharks", "current"] },
  "red sea": { country: "Egypt", lat: 27.5, lng: 34, tags: ["reef", "wreck", "sharks"] },
  "brothers islands": { country: "Egypt", lat: 26.3167, lng: 34.85, tags: ["wall", "sharks", "hammerhead"] },
  "elphinstone reef": { country: "Egypt", lat: 25.4667, lng: 34.8833, tags: ["wall", "oceanic whitetip", "sharks"] },
  "jackson reef": { country: "Egypt", lat: 27.9667, lng: 34.4667, tags: ["reef", "sharks", "wreck"] },
  "abu nuhas": { country: "Egypt", lat: 27.5833, lng: 33.9167, tags: ["wreck", "multiple wrecks", "history"] },
  "sodwana bay": { country: "South Africa", lat: -27.5333, lng: 32.6833, tags: ["reef", "ragged tooth sharks"] },
  "aliwal shoal": { country: "South Africa", lat: -30.2667, lng: 30.8333, tags: ["sharks", "ragged tooth", "reef"] },
  "protea banks": { country: "South Africa", lat: -30.6667, lng: 30.5333, tags: ["sharks", "bull sharks", "tiger sharks"] },
  "tofo beach": { country: "Mozambique", lat: -23.85, lng: 35.5333, tags: ["whale sharks", "manta rays", "megafauna"] },
  "ponta do ouro": { country: "Mozambique", lat: -26.8333, lng: 32.8833, tags: ["dolphins", "reef", "sharks"] },
  "bazaruto archipelago": { country: "Mozambique", lat: -21.6667, lng: 35.4167, tags: ["reef", "dugong", "turtles"] },
  "zanzibar": { country: "Tanzania", lat: -6.1639, lng: 39.1989, tags: ["reef", "dolphins", "whale sharks"] },
  "mafia island": { country: "Tanzania", lat: -7.85, lng: 39.7833, tags: ["whale sharks", "reef", "marine park"] },
  "pemba island": { country: "Tanzania", lat: -5.05, lng: 39.75, tags: ["reef", "wall", "pristine"] },
  "aldabra atoll": { country: "Seychelles", lat: -9.4167, lng: 46.3333, tags: ["UNESCO", "turtles", "sharks"] },
  "shark bank": { country: "Seychelles", lat: -4.5833, lng: 55.3167, tags: ["whale sharks", "grey reef sharks"] },
  "fiji": { country: "Fiji", lat: -17.7134, lng: 178.065, tags: ["soft coral", "sharks", "reef"] },
  "beqa lagoon": { country: "Fiji", lat: -18.3833, lng: 177.9833, tags: ["shark dive", "bull sharks", "tiger sharks"] },
  "great white wall": { country: "Fiji", lat: -16.8167, lng: 179.9333, tags: ["soft coral", "wall", "white coral"] },
  "namena marine reserve": { country: "Fiji", lat: -17.1333, lng: 179.1, tags: ["reef", "marine reserve", "biodiversity"] },
  "yap": { country: "Micronesia", lat: 9.5144, lng: 138.1292, tags: ["manta rays", "resident mantas"] },
  "truk lagoon": { country: "Micronesia", lat: 7.4167, lng: 151.7833, tags: ["wreck", "WWII", "ghost fleet"] },
  "pohnpei": { country: "Micronesia", lat: 6.8874, lng: 158.2115, tags: ["reef", "drop offs", "sharks"] },
  "palau": { country: "Palau", lat: 7.515, lng: 134.5825, tags: ["jellyfish lake", "sharks", "manta rays"] },
  "blue corner": { country: "Palau", lat: 7.1333, lng: 134.2167, tags: ["sharks", "wall", "current"] },
  "german channel": { country: "Palau", lat: 7.1, lng: 134.2333, tags: ["manta rays", "cleaning station"] },
  "jellyfish lake": { country: "Palau", lat: 7.1667, lng: 134.3667, tags: ["jellyfish", "snorkel", "unique"] },
  "ulong channel": { country: "Palau", lat: 7.2833, lng: 134.25, tags: ["drift dive", "sharks", "reef"] },
  "thailand": { country: "Thailand", lat: 8.8333, lng: 98.3833, tags: ["reef", "whale sharks", "manta rays"] },
  "similan islands": { country: "Thailand", lat: 8.65, lng: 97.65, tags: ["reef", "granite boulders", "manta rays"] },
  "elephant head rock": { country: "Thailand", lat: 8.6, lng: 97.6333, tags: ["rock formations", "current", "swim-throughs"] },
  "hin daeng": { country: "Thailand", lat: 7.1833, lng: 98.9833, tags: ["wall", "manta rays", "whale sharks"] },
  "hin muang": { country: "Thailand", lat: 7.2, lng: 98.9833, tags: ["wall", "deep dive", "purple coral"] },
  "sail rock": { country: "Thailand", lat: 10.05, lng: 99.45, tags: ["chimney", "whale sharks", "barracuda"] },
  "koh tao": { country: "Thailand", lat: 10.1, lng: 99.8333, tags: ["beginner", "reef", "training"] },
  "galapagos": { country: "Ecuador", lat: -0.9538, lng: -90.9656, tags: ["hammerhead sharks", "marine iguana", "pelagics"] },
  "darwin island": { country: "Ecuador", lat: 1.6778, lng: -91.9833, tags: ["whale sharks", "hammerhead", "dolphins"] },
  "wolf island": { country: "Ecuador", lat: 1.3833, lng: -91.8167, tags: ["hammerhead", "galapagos sharks"] },
  "gordon rocks": { country: "Ecuador", lat: -0.7667, lng: -90.3, tags: ["hammerhead", "current", "advanced"] },
  "cocos island": { country: "Costa Rica", lat: 5.5269, lng: -87.0587, tags: ["hammerhead", "whale sharks", "pelagics"] },
  "bajo alcyone": { country: "Costa Rica", lat: 5.5333, lng: -87.05, tags: ["hammerhead", "schooling sharks"] },
  "dirty rock": { country: "Costa Rica", lat: 5.55, lng: -87.0667, tags: ["sharks", "marble rays"] },
  "catalina islands": { country: "Costa Rica", lat: 10.4833, lng: -85.7333, tags: ["bull sharks", "manta rays"] },
  "cabo pulmo": { country: "Mexico", lat: 23.4333, lng: -109.4167, tags: ["marine park", "schooling fish", "recovery"] },
  "revillagigedo": { country: "Mexico", lat: 18.8, lng: -110.9667, tags: ["giant manta", "dolphins", "sharks"] },
  "malpelo island": { country: "Colombia", lat: 4.0, lng: -81.6, tags: ["hammerhead", "silky sharks", "advanced"] },
  "fernando de noronha": { country: "Brazil", lat: -3.8547, lng: -32.4244, tags: ["dolphins", "sharks", "turtles"] },
  "abrolhos": { country: "Brazil", lat: -17.9667, lng: -38.7, tags: ["humpback whales", "reef"] },
  "bay of pigs": { country: "Cuba", lat: 22.05, lng: -81.2, tags: ["cenote", "wall", "pristine"] },
  "jardines de la reina": { country: "Cuba", lat: 21.4, lng: -78.9333, tags: ["sharks", "crocodiles", "marine park"] },
  "dominica": { country: "Dominica", lat: 15.4167, lng: -61.35, tags: ["sperm whales", "champagne reef", "bubbles"] },
  "saba": { country: "Netherlands", lat: 17.6333, lng: -63.25, tags: ["pinnacles", "sharks", "marine park"] },
  "st. lucia": { country: "Saint Lucia", lat: 13.9094, lng: -60.9789, tags: ["reef", "wall", "seahorse"] },
  "grenada": { country: "Grenada", lat: 12.1165, lng: -61.679, tags: ["wreck", "underwater sculpture", "bianca c"] },
  "turks and caicos": { country: "Turks and Caicos", lat: 21.6940, lng: -71.7979, tags: ["wall", "humpback whales", "reef"] },
  "bahamas": { country: "Bahamas", lat: 24.25, lng: -76.0, tags: ["sharks", "tiger sharks", "dolphins"] },
  "tiger beach": { country: "Bahamas", lat: 26.86, lng: -79.04, tags: ["tiger sharks", "lemon sharks"] },
  "bimini": { country: "Bahamas", lat: 25.7333, lng: -79.2833, tags: ["hammerhead", "dolphins", "atlantic spotted"] },
  "exuma cays": { country: "Bahamas", lat: 24.0, lng: -76.5, tags: ["swimming pigs", "sharks", "nurse sharks"] },
  "okinawa": { country: "Japan", lat: 26.5013, lng: 127.9454, tags: ["manta rays", "reef", "caves"] },
  "yonaguni": { country: "Japan", lat: 24.4667, lng: 123.0, tags: ["hammerhead", "monument", "mystery"] },
  "ishigaki": { country: "Japan", lat: 24.3333, lng: 124.1667, tags: ["manta rays", "reef"] },
  "osezaki": { country: "Japan", lat: 35.0333, lng: 138.7833, tags: ["macro", "frogfish", "cold water"] },
  "izu peninsula": { country: "Japan", lat: 34.9, lng: 138.95, tags: ["macro", "seasonal", "nudibranchs"] },
  "ogasawara": { country: "Japan", lat: 27.0833, lng: 142.2, tags: ["dolphins", "sharks", "humpback whales"] },
  "jeju island": { country: "South Korea", lat: 33.4996, lng: 126.5312, tags: ["soft coral", "haenyeo", "cold water"] },
  "sipadan": { country: "Malaysia", lat: 4.1147, lng: 118.6292, tags: ["barracuda", "turtles", "wall"] },
  "layang layang": { country: "Malaysia", lat: 7.3833, lng: 113.8417, tags: ["hammerhead", "wall", "pelagics"] },
  "mabul": { country: "Malaysia", lat: 4.2453, lng: 118.6294, tags: ["macro", "muck", "critters"] },
  "kapalai": { country: "Malaysia", lat: 4.2333, lng: 118.65, tags: ["macro", "seahorse", "mandarin fish"] },
  "perhentian islands": { country: "Malaysia", lat: 5.9, lng: 102.75, tags: ["reef", "turtles", "beginner"] },
  "tioman island": { country: "Malaysia", lat: 2.8167, lng: 104.1667, tags: ["reef", "sharks", "marine park"] },
  "mergui archipelago": { country: "Myanmar", lat: 11.5, lng: 98.0, tags: ["pristine", "sharks", "remote"] },
  "black rock": { country: "Myanmar", lat: 9.3, lng: 97.9167, tags: ["manta rays", "whale sharks"] },
  "western rocky": { country: "Myanmar", lat: 9.2667, lng: 97.8667, tags: ["sharks", "swim-throughs"] },
  "andaman islands": { country: "India", lat: 11.7401, lng: 92.6586, tags: ["reef", "pristine", "dugong"] },
  "netrani island": { country: "India", lat: 14.0167, lng: 74.3333, tags: ["reef", "sharks", "whale sharks"] },
  "lakshadweep": { country: "India", lat: 10.5667, lng: 72.6333, tags: ["reef", "manta rays", "pristine"] },
};

async function fetchDiveSites(): Promise<DiveSite[]> {
  console.log("🤿 Dive Atlas - Fetching dive sites with Exa API\n");
  console.log("=".repeat(50));

  const foundSites = new Map<string, DiveSite>();

  for (const query of SEARCH_QUERIES) {
    console.log(`\n🔍 Searching: "${query}"`);
    
    try {
      const result = await exa.searchAndContents(query, {
        type: "auto",
        numResults: 8,
        text: { maxCharacters: 3000 },
      });

      for (const item of result.results) {
        if (!item.text) continue;
        
        const text = item.text.toLowerCase();
        
        // Match against known sites
        for (const [siteName, siteData] of Object.entries(KNOWN_SITES)) {
          if (text.includes(siteName) && !foundSites.has(siteName)) {
            // Determine difficulty from context
            let difficulty = "intermediate";
            const contextMatch = text.match(new RegExp(`.{0,100}${siteName}.{0,100}`, 'i'));
            const context = contextMatch ? contextMatch[0] : "";
            
            if (/beginner|easy|novice|introductory|calm|shallow/.test(context)) {
              difficulty = "beginner";
            } else if (/advanced|challenging|strong current|deep|experienced/.test(context)) {
              difficulty = "advanced";
            } else if (/expert|technical|extreme|dangerous|very strong/.test(context)) {
              difficulty = "expert";
            }

            // Extract depth if mentioned
            const depthMatch = context.match(/(\d+)\s*[-–]\s*(\d+)\s*m/);
            const depth_min = depthMatch ? parseInt(depthMatch[1]) : 10;
            const depth_max = depthMatch ? parseInt(depthMatch[2]) : 30;

            // Format name properly
            const formattedName = siteName
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            foundSites.set(siteName, {
              name: formattedName,
              destination: siteData.country || "Unknown",
              country: siteData.country || "Unknown",
              lat: siteData.lat || 0,
              lng: siteData.lng || 0,
              difficulty,
              depth_min,
              depth_max,
              best_season: "Year-round",
              tags: siteData.tags || ["reef"],
            });

            console.log(`  ✅ Found: ${formattedName} (${siteData.country})`);
          }
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error:`, error);
    }
  }

  return Array.from(foundSites.values());
}

function generateSQL(sites: DiveSite[]): string {
  const values = sites.map(site => {
    const name = site.name.replace(/'/g, "''");
    const destination = site.destination.replace(/'/g, "''");
    const country = site.country.replace(/'/g, "''");
    const tags = `ARRAY[${site.tags.map(t => `'${t}'`).join(', ')}]`;

    return `  ('${name}', '${destination}', '${country}', ${site.lat.toFixed(4)}, ${site.lng.toFixed(4)}, '${site.difficulty}', ${site.depth_min}, ${site.depth_max}, '${site.best_season}', ${tags})`;
  });

  return `-- Additional dive sites fetched via Exa API
-- Run this in Supabase SQL Editor
-- Generated: ${new Date().toISOString()}

INSERT INTO public.sites (name, destination, country, lat, lng, difficulty, depth_min, depth_max, best_season, tags) VALUES
${values.join(',\n')}
ON CONFLICT DO NOTHING;
`;
}

async function main() {
  const sites = await fetchDiveSites();

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Total sites found: ${sites.length}`);

  if (sites.length > 0) {
    const sql = generateSQL(sites);
    
    // Write to file
    const fs = await import('fs');
    fs.writeFileSync('exa_sites.sql', sql);
    
    console.log("\n✅ SQL saved to exa_sites.sql");
    console.log("\n📝 Preview (first 30 lines):\n");
    console.log(sql.split('\n').slice(0, 35).join('\n'));
  } else {
    console.log("\n⚠️ No sites found. Check API key and queries.");
  }
}

main().catch(console.error);
