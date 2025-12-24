# Dive Atlas - Setup Guide

## Prerequisites

- Node.js 18+
- pnpm
- A Supabase project

## 1. Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```bash
# Get these from your Supabase project settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase.sql` and run it
4. This will create:
   - `sites` table with RLS policies
   - `user_site_status` table with RLS policies
   - Triggers for updating timestamps

## 3. Seed Data

### Option A: Manual (Recommended)

1. Go to **SQL Editor** in Supabase
2. Run the following to insert seed data:

```sql
INSERT INTO sites (name, destination, country, lat, lng, difficulty, depth_min, depth_max, best_season, tags)
SELECT 
  (value->>'name')::text,
  (value->>'destination')::text,
  (value->>'country')::text,
  (value->>'lat')::double precision,
  (value->>'lng')::double precision,
  (value->>'difficulty')::text,
  (value->>'depth_min')::int,
  (value->>'depth_max')::int,
  (value->>'best_season')::text,
  ARRAY(SELECT jsonb_array_elements_text(value->'tags'))
FROM jsonb_array_elements('
[
  {"name": "Blue Corner", "destination": "Palau, Micronesia", "country": "Palau", "lat": 7.2704, "lng": 134.3736, "difficulty": "intermediate", "depth_min": 15, "depth_max": 40, "best_season": "Nov - Apr", "tags": ["wall", "sharks", "manta rays"]},
  {"name": "SS Thistlegorm", "destination": "Red Sea, Egypt", "country": "Egypt", "lat": 27.8136, "lng": 33.9231, "difficulty": "intermediate", "depth_min": 16, "depth_max": 32, "best_season": "Mar - Nov", "tags": ["wreck", "WWII", "history"]},
  {"name": "Manta Point", "destination": "Nusa Penida, Indonesia", "country": "Indonesia", "lat": -8.7427, "lng": 115.4483, "difficulty": "beginner", "depth_min": 5, "depth_max": 15, "best_season": "Apr - Oct", "tags": ["reef", "manta rays", "cleaning station"]},
  {"name": "Great Blue Hole", "destination": "Belize", "country": "Belize", "lat": 17.3163, "lng": -87.5349, "difficulty": "advanced", "depth_min": 30, "depth_max": 40, "best_season": "Apr - Jun", "tags": ["cave", "stalactites", "sharks"]},
  {"name": "Lembeh Strait", "destination": "Sulawesi, Indonesia", "country": "Indonesia", "lat": 1.4748, "lng": 125.2355, "difficulty": "intermediate", "depth_min": 5, "depth_max": 25, "best_season": "Jul - Nov", "tags": ["macro", "muck diving", "critters"]}
]'::jsonb);
```

Or copy/paste entries from `seed_sites.json`.

### Option B: Script

If you have the Supabase service role key:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-key npx tsx scripts/seed-sites.ts
```

## 4. Enable Email Auth

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Email Templates**, customize if desired
4. Under **URL Configuration**, set Site URL to your deployment URL

## 5. Run the App

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/callback/route.ts   # OAuth callback handler
│   ├── login/page.tsx           # Magic link login
│   ├── map/page.tsx             # Main map view
│   ├── me/page.tsx              # User's dive log
│   └── layout.tsx               # Root layout
├── components/
│   ├── filters/                 # Filter sidebar & sheet
│   ├── layout/                  # App bar
│   ├── map/                     # Leaflet map
│   ├── site/                    # Site detail panel & sheet
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── hooks/                   # Custom React hooks
│   ├── supabase/                # Supabase clients
│   ├── types/                   # TypeScript types
│   ├── store.ts                 # Zustand store
│   └── utils.ts                 # Utility functions
└── middleware.ts                # Route protection
```

## Features

- ✅ Supabase Auth with Magic Link
- ✅ Protected routes (/map, /me)
- ✅ Full-screen map with custom markers
- ✅ Filter sidebar (desktop) / bottom sheet (mobile)
- ✅ Site detail panel (desktop) / bottom sheet (mobile)
- ✅ Want / Dived / Favorite buttons with persistence
- ✅ Notes with debounced autosave
- ✅ My Dives page with real data
- ✅ Collapsible detail panel
- ✅ Active filter chips with clear button

