/**
 * Seed Script for Dive Atlas Sites
 * 
 * Usage:
 * 1. Set your Supabase credentials in .env.local
 * 2. Run: npx tsx scripts/seed-sites.ts
 * 
 * Or manually copy the JSON contents and insert via Supabase SQL Editor:
 * 
 * INSERT INTO sites (name, destination, country, lat, lng, difficulty, depth_min, depth_max, best_season, tags)
 * VALUES 
 *   ('Blue Corner', 'Palau, Micronesia', 'Palau', 7.2704, 134.3736, 'intermediate', 15, 40, 'Nov - Apr', ARRAY['wall', 'sharks', 'manta rays']),
 *   ... etc
 */

import { createClient } from '@supabase/supabase-js'
import sites from '../seed_sites.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for seeding

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Seeding sites...')
  
  const { data, error } = await supabase
    .from('sites')
    .upsert(sites, { onConflict: 'name' })
    .select()

  if (error) {
    console.error('Error seeding sites:', error)
    process.exit(1)
  }

  console.log(`Successfully seeded ${data?.length || 0} sites`)
}

seed()

