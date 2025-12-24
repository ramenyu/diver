-- Batch 2: Additional dive sites from around the world
-- Run this in Supabase SQL Editor

INSERT INTO public.sites (name, destination, country, lat, lng, difficulty, depth_min, depth_max, best_season, tags) VALUES
-- Mediterranean & Europe
('Zenobia Wreck', 'Larnaca, Cyprus', 'Cyprus', 34.9167, 33.6500, 'intermediate', 18, 42, 'Apr-Nov', ARRAY['wreck', 'ferry', 'artificial reef']),
('MS Zenobia', 'Larnaca, Cyprus', 'Cyprus', 34.9180, 33.6510, 'advanced', 18, 42, 'Apr-Nov', ARRAY['wreck', 'technical', 'penetration']),
('HMHS Britannic', 'Kea Island, Greece', 'Greece', 37.7167, 24.2833, 'expert', 60, 120, 'May-Oct', ARRAY['wreck', 'titanic sister', 'technical']),
('Santorini Caldera', 'Santorini, Greece', 'Greece', 36.4167, 25.4333, 'beginner', 5, 30, 'May-Oct', ARRAY['volcanic', 'reef', 'scenic']),
('Marathonisi', 'Zakynthos, Greece', 'Greece', 37.7167, 20.8667, 'beginner', 5, 25, 'May-Oct', ARRAY['turtles', 'reef', 'marine park']),
('Blue Grotto', 'Gozo, Malta', 'Malta', 35.8167, 14.4333, 'beginner', 5, 30, 'Year-round', ARRAY['cave', 'blue water', 'scenic']),
('HMS Maori', 'Valletta, Malta', 'Malta', 35.8972, 14.5167, 'intermediate', 14, 14, 'Year-round', ARRAY['wreck', 'WWII', 'destroyer']),
('Um El Faroud', 'Wied iz-Zurrieq, Malta', 'Malta', 35.8167, 14.4500, 'intermediate', 18, 36, 'Year-round', ARRAY['wreck', 'artificial reef', 'oil tanker']),
('Cirkewwa Arch', 'Mellieha, Malta', 'Malta', 35.9833, 14.3333, 'beginner', 5, 20, 'Year-round', ARRAY['arch', 'reef', 'scenic']),
('El Toro', 'Mallorca, Spain', 'Spain', 39.4500, 2.4667, 'intermediate', 10, 40, 'May-Oct', ARRAY['marine reserve', 'grouper', 'barracuda']),
('Medes Islands', 'Costa Brava, Spain', 'Spain', 42.0500, 3.2167, 'beginner', 5, 40, 'May-Oct', ARRAY['marine reserve', 'grouper', 'coral']),
('Sardinia Caves', 'Alghero, Sardinia', 'Italy', 40.5333, 8.3167, 'intermediate', 10, 35, 'May-Oct', ARRAY['cave', 'grotto', 'red coral']),
('Portofino Marine Park', 'Liguria, Italy', 'Italy', 44.3000, 9.2167, 'beginner', 5, 40, 'May-Oct', ARRAY['marine park', 'reef', 'gorgonian']),
('Elba Island', 'Tuscany, Italy', 'Italy', 42.7667, 10.2667, 'intermediate', 10, 50, 'May-Oct', ARRAY['wreck', 'reef', 'octopus']),
('Kas', 'Antalya, Turkey', 'Turkey', 36.2000, 29.6500, 'intermediate', 10, 40, 'May-Nov', ARRAY['canyon', 'reef', 'amphora']),
('Fethiye', 'Mugla, Turkey', 'Turkey', 36.6500, 29.1167, 'beginner', 5, 30, 'May-Nov', ARRAY['reef', 'wreck', 'beginner friendly']),

-- Atlantic Islands
('El Hierro', 'Canary Islands, Spain', 'Spain', 27.7500, -18.0000, 'beginner', 5, 40, 'Year-round', ARRAY['marine reserve', 'volcanic', 'grouper']),
('Lanzarote', 'Canary Islands, Spain', 'Spain', 29.0333, -13.6333, 'beginner', 5, 35, 'Year-round', ARRAY['volcanic', 'reef', 'angel sharks']),
('Tenerife', 'Canary Islands, Spain', 'Spain', 28.2667, -16.6000, 'beginner', 5, 30, 'Year-round', ARRAY['turtles', 'rays', 'volcanic']),
('Azores Islands', 'Azores, Portugal', 'Portugal', 37.7833, -25.5000, 'intermediate', 10, 40, 'Jun-Oct', ARRAY['pelagics', 'manta rays', 'blue sharks']),
('Princess Alice Bank', 'Azores, Portugal', 'Portugal', 37.8333, -29.2167, 'advanced', 30, 40, 'Jul-Sep', ARRAY['mobula rays', 'pelagics', 'open ocean']),
('Madeira Island', 'Madeira, Portugal', 'Portugal', 32.6500, -16.9167, 'intermediate', 10, 40, 'Year-round', ARRAY['volcanic', 'grouper', 'moray']),
('Garajau Marine Reserve', 'Madeira, Portugal', 'Portugal', 32.6333, -16.8500, 'beginner', 5, 30, 'Year-round', ARRAY['marine reserve', 'grouper', 'rays']),
('Sal Island', 'Cape Verde', 'Cape Verde', 16.7500, -22.9333, 'intermediate', 10, 35, 'Year-round', ARRAY['sharks', 'turtles', 'volcanic']),
('Buracona', 'Sal, Cape Verde', 'Cape Verde', 16.7667, -22.9500, 'intermediate', 10, 30, 'Year-round', ARRAY['cave', 'blue eye', 'volcanic']),
('Santa Maria', 'Sal, Cape Verde', 'Cape Verde', 16.6000, -22.9167, 'beginner', 5, 25, 'Year-round', ARRAY['reef', 'lemon sharks', 'nurse sharks']),

-- Brazil & South America
('Fernando de Noronha', 'Pernambuco, Brazil', 'Brazil', -3.8547, -32.4244, 'intermediate', 10, 40, 'Sep-Mar', ARRAY['dolphins', 'sharks', 'UNESCO', 'spinner dolphins']),
('Pedras Secas', 'Fernando de Noronha, Brazil', 'Brazil', -3.8667, -32.4333, 'intermediate', 15, 35, 'Sep-Mar', ARRAY['reef', 'sharks', 'visibility']),
('Laje de Santos', 'Santos, Brazil', 'Brazil', -24.3167, -46.1833, 'advanced', 15, 40, 'Nov-Mar', ARRAY['hammerhead', 'marine park', 'pelagics']),
('Abrolhos', 'Bahia, Brazil', 'Brazil', -17.9667, -38.7000, 'intermediate', 10, 25, 'Jul-Nov', ARRAY['humpback whales', 'coral', 'marine park']),
('Arraial do Cabo', 'Rio de Janeiro, Brazil', 'Brazil', -22.9667, -42.0333, 'beginner', 5, 30, 'Year-round', ARRAY['blue water', 'reef', 'beginner']),
('Recife Shipwrecks', 'Recife, Brazil', 'Brazil', -8.0500, -34.8833, 'intermediate', 15, 30, 'Year-round', ARRAY['wreck', 'artificial reef', 'multiple wrecks']),
('Bonito', 'Mato Grosso do Sul, Brazil', 'Brazil', -21.1333, -56.4833, 'beginner', 2, 8, 'Year-round', ARRAY['freshwater', 'crystal clear', 'river snorkel']),
('Malpelo Island', 'Pacific Ocean, Colombia', 'Colombia', 4.0000, -81.6000, 'expert', 20, 40, 'Jan-May', ARRAY['hammerhead', 'silky sharks', 'UNESCO']),
('Gorgona Island', 'Pacific Ocean, Colombia', 'Colombia', 2.9667, -78.1833, 'intermediate', 10, 30, 'Jul-Sep', ARRAY['humpback whales', 'sharks', 'marine park']),
('Taganga', 'Santa Marta, Colombia', 'Colombia', 11.2667, -74.1833, 'beginner', 5, 25, 'Dec-Apr', ARRAY['reef', 'seahorse', 'beginner']),

-- More Caribbean
('Bloody Bay Marine Park', 'Little Cayman', 'Cayman Islands', 19.7000, -80.0667, 'intermediate', 10, 60, 'Year-round', ARRAY['wall', 'deep', 'sponges']),
('Grand Turk Wall', 'Grand Turk', 'Turks and Caicos', 21.4667, -71.1333, 'intermediate', 10, 60, 'Year-round', ARRAY['wall', 'whales', 'pelagics']),
('Salt Cay', 'Turks and Caicos', 'Turks and Caicos', 21.3333, -71.2000, 'intermediate', 10, 40, 'Jan-Apr', ARRAY['humpback whales', 'wall', 'pristine']),
('Saba Marine Park', 'Saba', 'Netherlands', 17.6300, -63.2500, 'intermediate', 10, 40, 'Year-round', ARRAY['pinnacles', 'sharks', 'pristine']),
('Statia', 'St. Eustatius', 'Netherlands', 17.4833, -62.9833, 'intermediate', 10, 35, 'Year-round', ARRAY['volcanic', 'reef', 'seahorse']),
('Champagne Reef', 'Dominica', 'Dominica', 15.2333, -61.3667, 'beginner', 5, 15, 'Year-round', ARRAY['volcanic bubbles', 'unique', 'snorkel']),
('Soufriere Scott Head', 'Dominica', 'Dominica', 15.2167, -61.3667, 'intermediate', 10, 40, 'Year-round', ARRAY['pinnacles', 'reef', 'marine reserve']),
('Pigeon Island', 'St. Lucia', 'Saint Lucia', 14.0833, -60.9500, 'beginner', 5, 25, 'Year-round', ARRAY['reef', 'turtles', 'marine reserve']),
('Anse Chastanet', 'St. Lucia', 'Saint Lucia', 13.8667, -61.0667, 'beginner', 5, 40, 'Year-round', ARRAY['reef', 'wall', 'colorful']),
('Bianca C Wreck', 'Grenada', 'Grenada', 12.0333, -61.7500, 'advanced', 30, 50, 'Year-round', ARRAY['wreck', 'titanic of caribbean', 'cruise ship']),
('Molinere Bay', 'Grenada', 'Grenada', 12.1167, -61.7667, 'beginner', 5, 15, 'Year-round', ARRAY['underwater sculpture', 'art', 'snorkel']),
('Tobago Cays', 'Grenadines', 'Saint Vincent', 12.6333, -61.3500, 'beginner', 5, 20, 'Year-round', ARRAY['marine park', 'turtles', 'pristine']),
('Speyside', 'Tobago', 'Trinidad and Tobago', 11.3000, -60.5167, 'intermediate', 10, 35, 'Year-round', ARRAY['manta rays', 'brain coral', 'reef']),
('Klein Bonaire', 'Bonaire', 'Netherlands', 12.1667, -68.3167, 'beginner', 5, 30, 'Year-round', ARRAY['reef', 'shore dive', 'pristine']),
('1000 Steps', 'Bonaire', 'Netherlands', 12.2333, -68.3500, 'beginner', 5, 30, 'Year-round', ARRAY['shore dive', 'reef', 'elkhorn coral']),
('Hilma Hooker', 'Bonaire', 'Netherlands', 12.1500, -68.2833, 'intermediate', 18, 30, 'Year-round', ARRAY['wreck', 'drug smuggler', 'artificial reef']),
('Mushroom Forest', 'Curaçao', 'Netherlands', 12.0833, -68.9667, 'intermediate', 10, 35, 'Year-round', ARRAY['reef', 'coral formations', 'unique']),
('Blue Room', 'Curaçao', 'Netherlands', 12.3667, -69.1500, 'beginner', 5, 15, 'Year-round', ARRAY['cave', 'blue light', 'snorkel']),
('Aruba Antilla Wreck', 'Aruba', 'Netherlands', 12.6000, -70.0500, 'intermediate', 18, 27, 'Year-round', ARRAY['wreck', 'WWII', 'german freighter']),

-- More Red Sea & Middle East
('Tiran Island', 'Sharm El Sheikh, Egypt', 'Egypt', 28.0000, 34.4667, 'intermediate', 10, 40, 'Mar-Nov', ARRAY['reef', 'sharks', 'strait']),
('Shark Reef', 'Ras Mohammed, Egypt', 'Egypt', 27.7333, 34.2500, 'intermediate', 10, 40, 'Mar-Nov', ARRAY['sharks', 'wall', 'pelagics']),
('Jolanda Reef', 'Ras Mohammed, Egypt', 'Egypt', 27.7300, 34.2500, 'intermediate', 10, 40, 'Mar-Nov', ARRAY['wreck', 'toilet bowls', 'reef']),
('Dunraven Wreck', 'Ras Mohammed, Egypt', 'Egypt', 27.9333, 34.0333, 'intermediate', 15, 30, 'Mar-Nov', ARRAY['wreck', 'steam ship', 'coral encrusted']),
('Salem Express', 'Safaga, Egypt', 'Egypt', 26.7167, 34.0333, 'intermediate', 12, 30, 'Mar-Nov', ARRAY['wreck', 'ferry', 'memorial']),
('Marsa Shagra', 'Marsa Alam, Egypt', 'Egypt', 24.9833, 34.9167, 'beginner', 5, 30, 'Year-round', ARRAY['house reef', 'dugong', 'dolphins']),
('Dolphin House', 'Marsa Alam, Egypt', 'Egypt', 25.0500, 34.9333, 'beginner', 5, 20, 'Year-round', ARRAY['dolphins', 'spinner dolphins', 'reef']),
('Musandam', 'Oman', 'Oman', 26.2000, 56.2500, 'intermediate', 10, 30, 'Oct-May', ARRAY['fjords', 'sharks', 'pristine']),
('Daymaniyat Islands', 'Oman', 'Oman', 23.8333, 57.8333, 'beginner', 5, 25, 'Oct-May', ARRAY['turtles', 'reef', 'marine reserve']),
('Fujairah', 'UAE', 'UAE', 25.1333, 56.3500, 'beginner', 5, 20, 'Oct-May', ARRAY['reef', 'sharks', 'beginner']),

-- More Africa
('Ponta do Ouro', 'Mozambique', 'Mozambique', -26.8333, 32.8833, 'intermediate', 10, 30, 'Year-round', ARRAY['dolphins', 'reef', 'sharks']),
('Bazaruto Archipelago', 'Mozambique', 'Mozambique', -21.6667, 35.4167, 'intermediate', 10, 30, 'Year-round', ARRAY['dugong', 'reef', 'pristine']),
('Pemba', 'Mozambique', 'Mozambique', -12.9667, 40.5167, 'intermediate', 10, 35, 'Year-round', ARRAY['pristine', 'sharks', 'remote']),
('Quirimbas Archipelago', 'Mozambique', 'Mozambique', -12.4167, 40.5833, 'intermediate', 10, 30, 'Year-round', ARRAY['pristine', 'reef', 'remote']),
('Diani Beach', 'Kenya', 'Kenya', -4.3167, 39.5833, 'beginner', 5, 25, 'Oct-Mar', ARRAY['reef', 'whale sharks', 'dolphins']),
('Watamu Marine Park', 'Kenya', 'Kenya', -3.3500, 40.0167, 'beginner', 5, 20, 'Oct-Mar', ARRAY['marine park', 'turtles', 'reef']),
('Nosy Be', 'Madagascar', 'Madagascar', -13.3333, 48.2667, 'intermediate', 10, 35, 'Apr-Dec', ARRAY['whale sharks', 'reef', 'pristine']),
('Ile Sainte-Marie', 'Madagascar', 'Madagascar', -17.0000, 49.8500, 'intermediate', 10, 30, 'Jul-Sep', ARRAY['humpback whales', 'reef', 'seasonal']),

-- More Asia Pacific
('Tulamben', 'Bali, Indonesia', 'Indonesia', -8.2750, 115.5917, 'beginner', 5, 30, 'Year-round', ARRAY['wreck', 'liberty wreck', 'macro']),
('Amed', 'Bali, Indonesia', 'Indonesia', -8.3500, 115.6333, 'beginner', 5, 30, 'Year-round', ARRAY['reef', 'macro', 'japanese wreck']),
('Nusa Lembongan', 'Bali, Indonesia', 'Indonesia', -8.6833, 115.4500, 'intermediate', 10, 30, 'Apr-Oct', ARRAY['manta rays', 'mola mola', 'current']),
('Derawan Islands', 'Kalimantan, Indonesia', 'Indonesia', 2.2833, 118.2500, 'intermediate', 10, 30, 'Mar-Oct', ARRAY['jellyfish lake', 'manta rays', 'turtles']),
('Banda Islands', 'Maluku, Indonesia', 'Indonesia', -4.5333, 129.9000, 'intermediate', 10, 40, 'Sep-May', ARRAY['hammerhead', 'pristine', 'history']),
('Alor', 'East Nusa Tenggara, Indonesia', 'Indonesia', -8.2500, 124.7500, 'intermediate', 10, 40, 'Apr-Nov', ARRAY['macro', 'pristine', 'remote']),
('Triton Bay', 'West Papua, Indonesia', 'Indonesia', -3.9167, 134.1000, 'intermediate', 10, 35, 'Oct-Apr', ARRAY['whale sharks', 'soft coral', 'remote']),
('Cenderawasih Bay', 'West Papua, Indonesia', 'Indonesia', -2.9167, 134.9167, 'beginner', 5, 20, 'Year-round', ARRAY['whale sharks', 'bagan', 'unique']),
('Balicasag Island', 'Bohol, Philippines', 'Philippines', 9.5167, 123.6833, 'beginner', 5, 40, 'Year-round', ARRAY['wall', 'turtles', 'sardines']),
('Dauin', 'Negros, Philippines', 'Philippines', 9.1833, 123.2667, 'beginner', 5, 25, 'Year-round', ARRAY['muck', 'macro', 'critters']),
('Puerto Galera', 'Mindoro, Philippines', 'Philippines', 13.5167, 120.9500, 'beginner', 5, 30, 'Year-round', ARRAY['reef', 'macro', 'training']),
('Donsol', 'Sorsogon, Philippines', 'Philippines', 12.9000, 123.5833, 'beginner', 5, 15, 'Nov-Jun', ARRAY['whale sharks', 'snorkel', 'seasonal']),
('Shark Point', 'Phuket, Thailand', 'Thailand', 7.7500, 98.3833, 'intermediate', 15, 25, 'Nov-Apr', ARRAY['leopard sharks', 'reef', 'anemone']),
('Phi Phi Islands', 'Krabi, Thailand', 'Thailand', 7.7333, 98.7667, 'beginner', 5, 25, 'Nov-Apr', ARRAY['reef', 'leopard sharks', 'scenic']),
('Chumphon Pinnacle', 'Koh Tao, Thailand', 'Thailand', 10.1333, 99.7500, 'intermediate', 15, 35, 'Mar-Oct', ARRAY['whale sharks', 'barracuda', 'batfish']),
('Havelock Island', 'Andaman, India', 'India', 11.9833, 92.9833, 'beginner', 5, 25, 'Nov-Apr', ARRAY['reef', 'pristine', 'colorful']),
('Neil Island', 'Andaman, India', 'India', 11.8333, 93.0500, 'beginner', 5, 25, 'Nov-Apr', ARRAY['reef', 'turtles', 'coral']),

-- Japan & Korea
('Yonaguni Monument', 'Yonaguni, Japan', 'Japan', 24.4350, 123.0117, 'advanced', 15, 30, 'Nov-Jun', ARRAY['mystery', 'monument', 'hammerhead']),
('Kerama Islands', 'Okinawa, Japan', 'Japan', 26.2000, 127.3167, 'beginner', 5, 30, 'Year-round', ARRAY['turtles', 'reef', 'visibility']),
('Iriomote Island', 'Okinawa, Japan', 'Japan', 24.2833, 123.8333, 'intermediate', 10, 30, 'Year-round', ARRAY['manta rays', 'pristine', 'remote']),
('Osezaki', 'Shizuoka, Japan', 'Japan', 35.0333, 138.7833, 'intermediate', 10, 30, 'Year-round', ARRAY['macro', 'frogfish', 'cold water']),
('Izu Peninsula', 'Shizuoka, Japan', 'Japan', 34.9000, 138.9500, 'intermediate', 10, 30, 'Year-round', ARRAY['macro', 'nudibranchs', 'seasonal']),
('Chichi-jima', 'Ogasawara, Japan', 'Japan', 27.0833, 142.2000, 'intermediate', 10, 35, 'Year-round', ARRAY['dolphins', 'sharks', 'remote']),
('Jeju Island', 'South Korea', 'South Korea', 33.4500, 126.5500, 'intermediate', 10, 25, 'May-Oct', ARRAY['soft coral', 'haenyeo', 'cold water']),
('Ulleungdo', 'South Korea', 'South Korea', 37.5000, 130.8667, 'intermediate', 10, 30, 'Jun-Sep', ARRAY['kelp forest', 'cold water', 'visibility']),

-- More Pacific
('Vanuatu', 'Port Vila', 'Vanuatu', -17.7333, 168.3167, 'intermediate', 10, 40, 'Apr-Oct', ARRAY['wreck', 'coral', 'SS President Coolidge']),
('SS President Coolidge', 'Espiritu Santo, Vanuatu', 'Vanuatu', -15.5167, 167.1667, 'intermediate', 20, 70, 'Apr-Oct', ARRAY['wreck', 'WWII', 'luxury liner']),
('Million Dollar Point', 'Espiritu Santo, Vanuatu', 'Vanuatu', -15.4833, 167.1833, 'beginner', 5, 30, 'Apr-Oct', ARRAY['wreck', 'WWII', 'military equipment']),
('Tonga', 'Vavau', 'Tonga', -18.6500, -174.0000, 'beginner', 5, 25, 'Jul-Oct', ARRAY['humpback whales', 'swim with whales', 'seasonal']),
('Samoa', 'Apia', 'Samoa', -13.8333, -171.7500, 'beginner', 5, 25, 'May-Oct', ARRAY['reef', 'pristine', 'turtles']),
('Cook Islands', 'Rarotonga', 'Cook Islands', -21.2333, -159.7833, 'beginner', 5, 30, 'Apr-Nov', ARRAY['reef', 'humpback whales', 'pristine']),
('Tahiti', 'French Polynesia', 'France', -17.5333, -149.5667, 'intermediate', 10, 35, 'Year-round', ARRAY['sharks', 'rays', 'lagoon']),
('Moorea', 'French Polynesia', 'France', -17.5333, -149.8333, 'beginner', 5, 30, 'Year-round', ARRAY['sharks', 'rays', 'feeding']),
('Bora Bora', 'French Polynesia', 'France', -16.5000, -151.7500, 'beginner', 5, 30, 'Year-round', ARRAY['manta rays', 'sharks', 'lagoon']),
('Rangiroa', 'Tuamotu, French Polynesia', 'France', -15.1333, -147.6667, 'intermediate', 10, 40, 'Year-round', ARRAY['sharks', 'dolphins', 'drift dive']),
('Fakarava', 'Tuamotu, French Polynesia', 'France', -16.0500, -145.6500, 'intermediate', 10, 35, 'Year-round', ARRAY['sharks', 'wall of sharks', 'pristine']),
('Tikehau', 'Tuamotu, French Polynesia', 'France', -15.0000, -148.1667, 'beginner', 5, 30, 'Year-round', ARRAY['manta rays', 'sharks', 'pristine']),
('Manihi', 'Tuamotu, French Polynesia', 'France', -14.4333, -146.0667, 'intermediate', 10, 35, 'Year-round', ARRAY['sharks', 'drift dive', 'pass']),

-- Hawaii specific sites  
('Molokini Crater', 'Maui, Hawaii', 'USA', 20.6333, -156.4967, 'beginner', 5, 40, 'Year-round', ARRAY['crater', 'reef', 'visibility']),
('Kona Manta Night Dive', 'Big Island, Hawaii', 'USA', 19.8167, -155.9833, 'beginner', 10, 15, 'Year-round', ARRAY['manta rays', 'night dive', 'unique']),
('Oahu Wrecks', 'Oahu, Hawaii', 'USA', 21.2833, -157.8500, 'intermediate', 20, 35, 'Year-round', ARRAY['wreck', 'plane', 'artificial reef']),
('Kauai Tunnels', 'Kauai, Hawaii', 'USA', 22.2167, -159.5000, 'intermediate', 10, 35, 'May-Sep', ARRAY['tunnels', 'reef', 'turtles']),
('Lanai Cathedrals', 'Lanai, Hawaii', 'USA', 20.7500, -156.9333, 'intermediate', 15, 25, 'Year-round', ARRAY['cave', 'light beams', 'cathedral'])

ON CONFLICT (name) DO NOTHING;

-- Show updated count
SELECT COUNT(*) as total_sites FROM public.sites;

