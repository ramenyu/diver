-- Additional dive sites fetched via Exa API
-- Run this in Supabase SQL Editor
-- Generated: 2025-12-24

-- First, add unique constraint on name if it doesn't exist
-- (This prevents duplicate site names)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sites_name_unique'
    ) THEN
        ALTER TABLE public.sites ADD CONSTRAINT sites_name_unique UNIQUE (name);
    END IF;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Insert new sites, skip if name already exists
INSERT INTO public.sites (name, destination, country, lat, lng, difficulty, depth_min, depth_max, best_season, tags) VALUES
  ('Fiji', 'Fiji', 'Fiji', -17.7134, 178.0650, 'intermediate', 10, 30, 'Year-round', ARRAY['soft coral', 'sharks', 'reef']),
  ('Palau', 'Palau', 'Palau', 7.5150, 134.5825, 'intermediate', 10, 30, 'Year-round', ARRAY['jellyfish lake', 'sharks', 'manta rays']),
  ('Galapagos', 'Galápagos, Ecuador', 'Ecuador', -0.9538, -90.9656, 'advanced', 15, 40, 'Jun-Nov', ARRAY['hammerhead sharks', 'marine iguana', 'pelagics']),
  ('Sipadan', 'Sabah, Malaysia', 'Malaysia', 4.1147, 118.6292, 'intermediate', 15, 40, 'Apr-Oct', ARRAY['barracuda', 'turtles', 'wall']),
  ('Bahamas', 'Bahamas', 'Bahamas', 24.2500, -76.0000, 'intermediate', 10, 30, 'Year-round', ARRAY['sharks', 'tiger sharks', 'dolphins']),
  ('Truk Lagoon', 'Chuuk, Micronesia', 'Micronesia', 7.4167, 151.7833, 'advanced', 15, 50, 'Dec-Apr', ARRAY['wreck', 'WWII', 'ghost fleet']),
  ('Red Sea', 'Red Sea, Egypt', 'Egypt', 27.5000, 34.0000, 'intermediate', 10, 40, 'Mar-Nov', ARRAY['reef', 'wreck', 'sharks']),
  ('Zanzibar', 'Zanzibar, Tanzania', 'Tanzania', -6.1639, 39.1989, 'beginner', 8, 25, 'Oct-Mar', ARRAY['reef', 'dolphins', 'whale sharks']),
  ('Darwin Island', 'Galápagos, Ecuador', 'Ecuador', 1.6778, -91.9833, 'expert', 15, 35, 'Jun-Nov', ARRAY['whale sharks', 'hammerhead', 'dolphins']),
  ('Cozumel', 'Quintana Roo, Mexico', 'Mexico', 20.4333, -86.9167, 'beginner', 10, 35, 'Year-round', ARRAY['reef', 'drift dive', 'wall']),
  ('Bonaire', 'Caribbean Netherlands', 'Netherlands', 12.2000, -68.2667, 'beginner', 5, 30, 'Year-round', ARRAY['shore dive', 'reef', 'macro']),
  ('Great Barrier Reef', 'Queensland, Australia', 'Australia', -18.2861, 147.7000, 'beginner', 5, 40, 'Jun-Oct', ARRAY['reef', 'coral', 'UNESCO']),
  ('Maldives', 'Maldives', 'Maldives', 3.2028, 73.2207, 'intermediate', 10, 30, 'Nov-Apr', ARRAY['manta rays', 'whale sharks', 'reef']),
  ('Maaya Thila', 'Ari Atoll, Maldives', 'Maldives', 4.1167, 72.9500, 'intermediate', 12, 30, 'Nov-Apr', ARRAY['reef', 'sharks', 'night dive']),
  ('Thailand', 'Andaman Sea, Thailand', 'Thailand', 8.8333, 98.3833, 'beginner', 10, 30, 'Nov-Apr', ARRAY['reef', 'whale sharks', 'manta rays']),
  ('Apo Island', 'Negros, Philippines', 'Philippines', 9.0833, 123.2667, 'beginner', 5, 25, 'Nov-May', ARRAY['turtles', 'reef', 'coral']),
  ('Roatan', 'Bay Islands, Honduras', 'Honduras', 16.3333, -86.5000, 'beginner', 10, 40, 'Mar-Sep', ARRAY['reef', 'wall', 'whale sharks']),
  ('Koh Tao', 'Gulf of Thailand', 'Thailand', 10.1000, 99.8333, 'beginner', 5, 20, 'Mar-Oct', ARRAY['beginner', 'reef', 'training']),
  ('Socorro Island', 'Revillagigedo, Mexico', 'Mexico', 18.7833, -110.9500, 'advanced', 15, 35, 'Nov-May', ARRAY['giant manta', 'dolphins', 'sharks']),
  ('Revillagigedo', 'Pacific Ocean, Mexico', 'Mexico', 18.8000, -110.9667, 'advanced', 15, 40, 'Nov-May', ARRAY['giant manta', 'dolphins', 'sharks']),
  ('Curacao', 'Caribbean Netherlands', 'Netherlands', 12.1696, -68.9900, 'beginner', 5, 30, 'Year-round', ARRAY['reef', 'wall', 'wreck']),
  ('Jardines De La Reina', 'Cuba', 'Cuba', 21.4000, -78.9333, 'intermediate', 10, 30, 'Dec-Apr', ARRAY['sharks', 'crocodiles', 'marine park']),
  ('Dominica', 'Caribbean', 'Dominica', 15.4167, -61.3500, 'beginner', 5, 30, 'Nov-Jun', ARRAY['sperm whales', 'champagne reef', 'bubbles']),
  ('Turks And Caicos', 'Caribbean', 'Turks and Caicos', 21.6940, -71.7979, 'beginner', 10, 40, 'Jan-Apr', ARRAY['wall', 'humpback whales', 'reef']),
  ('Cenote Angelita', 'Tulum, Mexico', 'Mexico', 20.1833, -87.4667, 'advanced', 30, 60, 'Year-round', ARRAY['cenote', 'cave', 'freshwater', 'hydrogen sulfide']),
  ('Cabo Pulmo', 'Baja California Sur, Mexico', 'Mexico', 23.4333, -109.4167, 'beginner', 5, 25, 'Year-round', ARRAY['marine park', 'schooling fish', 'recovery']),
  ('Grenada', 'Caribbean', 'Grenada', 12.1165, -61.6790, 'intermediate', 10, 40, 'Year-round', ARRAY['wreck', 'underwater sculpture', 'bianca c']),
  ('Hanifaru Bay', 'Baa Atoll, Maldives', 'Maldives', 5.2833, 73.0167, 'beginner', 5, 15, 'Jun-Nov', ARRAY['manta rays', 'aggregation', 'snorkel']),
  ('Yap', 'Micronesia', 'Micronesia', 9.5144, 138.1292, 'intermediate', 10, 30, 'Dec-Apr', ARRAY['manta rays', 'resident mantas']),
  ('Ishigaki', 'Okinawa, Japan', 'Japan', 24.3333, 124.1667, 'beginner', 10, 25, 'Jun-Oct', ARRAY['manta rays', 'reef']),
  ('Komodo Island', 'Flores Sea, Indonesia', 'Indonesia', -8.5500, 119.4500, 'intermediate', 10, 35, 'Apr-Nov', ARRAY['manta rays', 'current', 'reef']),
  ('Malapascua', 'Cebu, Philippines', 'Philippines', 11.3333, 124.1167, 'intermediate', 20, 30, 'Year-round', ARRAY['thresher sharks', 'reef']),
  ('Monad Shoal', 'Cebu, Philippines', 'Philippines', 11.3500, 124.1333, 'advanced', 20, 35, 'Year-round', ARRAY['thresher sharks', 'deep dive']),
  ('Elphinstone Reef', 'Marsa Alam, Egypt', 'Egypt', 25.4667, 34.8833, 'intermediate', 10, 40, 'Mar-Nov', ARRAY['wall', 'oceanic whitetip', 'sharks']),
  ('Beqa Lagoon', 'Viti Levu, Fiji', 'Fiji', -18.3833, 177.9833, 'advanced', 15, 30, 'Year-round', ARRAY['shark dive', 'bull sharks', 'tiger sharks']),
  ('Gordon Rocks', 'Santa Cruz, Ecuador', 'Ecuador', -0.7667, -90.3000, 'advanced', 15, 35, 'Year-round', ARRAY['hammerhead', 'current', 'advanced']),
  ('Bajo Alcyone', 'Cocos Island, Costa Rica', 'Costa Rica', 5.5333, -87.0500, 'expert', 25, 40, 'Jun-Dec', ARRAY['hammerhead', 'schooling sharks']),
  ('Aliwal Shoal', 'KwaZulu-Natal, South Africa', 'South Africa', -30.2667, 30.8333, 'intermediate', 10, 27, 'Mar-Jul', ARRAY['sharks', 'ragged tooth', 'reef']),
  ('Protea Banks', 'KwaZulu-Natal, South Africa', 'South Africa', -30.6667, 30.5333, 'advanced', 27, 40, 'Mar-Jul', ARRAY['sharks', 'bull sharks', 'tiger sharks']),
  ('Jellyfish Lake', 'Rock Islands, Palau', 'Palau', 7.1667, 134.3667, 'beginner', 0, 10, 'Year-round', ARRAY['jellyfish', 'snorkel', 'unique']),
  ('Layang Layang', 'South China Sea, Malaysia', 'Malaysia', 7.3833, 113.8417, 'intermediate', 15, 40, 'Mar-Aug', ARRAY['hammerhead', 'wall', 'pelagics']),
  ('Bimini', 'Bahamas', 'Bahamas', 25.7333, -79.2833, 'intermediate', 10, 25, 'Dec-Mar', ARRAY['hammerhead', 'dolphins', 'atlantic spotted']),
  ('Wakatobi', 'Sulawesi, Indonesia', 'Indonesia', -5.5000, 123.7500, 'beginner', 5, 30, 'Year-round', ARRAY['reef', 'macro', 'pristine coral']),
  ('Similan Islands', 'Andaman Sea, Thailand', 'Thailand', 8.6500, 97.6500, 'intermediate', 10, 40, 'Nov-Apr', ARRAY['reef', 'granite boulders', 'manta rays']),
  ('Hin Daeng', 'Andaman Sea, Thailand', 'Thailand', 7.1833, 98.9833, 'intermediate', 10, 60, 'Nov-Apr', ARRAY['wall', 'manta rays', 'whale sharks']),
  ('Hin Muang', 'Andaman Sea, Thailand', 'Thailand', 7.2000, 98.9833, 'advanced', 15, 70, 'Nov-Apr', ARRAY['wall', 'deep dive', 'purple coral']),
  ('Saba', 'Caribbean Netherlands', 'Netherlands', 17.6333, -63.2500, 'intermediate', 10, 40, 'Year-round', ARRAY['pinnacles', 'sharks', 'marine park']),
  ('Mergui Archipelago', 'Myanmar', 'Myanmar', 11.5000, 98.0000, 'intermediate', 10, 35, 'Nov-Apr', ARRAY['pristine', 'sharks', 'remote']),
  ('Andaman Islands', 'India', 'India', 11.7401, 92.6586, 'intermediate', 10, 40, 'Dec-Apr', ARRAY['reef', 'pristine', 'dugong']),
  ('Castle Rock', 'Komodo, Indonesia', 'Indonesia', -8.5833, 119.5333, 'advanced', 15, 40, 'Apr-Nov', ARRAY['sharks', 'current', 'pelagics']),
  ('Batu Bolong', 'Komodo, Indonesia', 'Indonesia', -8.5333, 119.5500, 'intermediate', 5, 40, 'Apr-Nov', ARRAY['reef', 'current', 'coral']),
  ('Bunaken', 'North Sulawesi, Indonesia', 'Indonesia', 1.6167, 124.7667, 'beginner', 5, 40, 'Year-round', ARRAY['wall', 'reef', 'turtles']),
  ('Gili Islands', 'Lombok, Indonesia', 'Indonesia', -8.3500, 116.0500, 'beginner', 5, 25, 'Year-round', ARRAY['turtles', 'reef', 'beginner']),
  ('Anilao', 'Batangas, Philippines', 'Philippines', 13.7667, 120.9333, 'beginner', 5, 30, 'Nov-May', ARRAY['macro', 'nudibranch', 'reef']),
  ('Mabul', 'Sabah, Malaysia', 'Malaysia', 4.2453, 118.6294, 'beginner', 5, 25, 'Year-round', ARRAY['macro', 'muck', 'critters']),
  ('Kapalai', 'Sabah, Malaysia', 'Malaysia', 4.2333, 118.6500, 'beginner', 5, 20, 'Year-round', ARRAY['macro', 'seahorse', 'mandarin fish']),
  ('Perhentian Islands', 'Terengganu, Malaysia', 'Malaysia', 5.9000, 102.7500, 'beginner', 5, 20, 'Mar-Oct', ARRAY['reef', 'turtles', 'beginner']),
  ('Tioman Island', 'Pahang, Malaysia', 'Malaysia', 2.8167, 104.1667, 'beginner', 5, 25, 'Mar-Oct', ARRAY['reef', 'sharks', 'marine park'])
ON CONFLICT (name) DO NOTHING;

-- Show count after insert
SELECT COUNT(*) as total_sites FROM public.sites;
