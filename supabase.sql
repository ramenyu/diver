-- Supabase SQL Migration for Dive Atlas
-- Run this in the Supabase SQL Editor

-- Create sites table (curated, shared)
CREATE TABLE IF NOT EXISTS public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text,
  country text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  depth_min int,
  depth_max int,
  best_season text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_site_status table (private, one row per user+site)
CREATE TABLE IF NOT EXISTS public.user_site_status (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  want boolean DEFAULT false,
  dived boolean DEFAULT false,
  favorite boolean DEFAULT false,
  notes text,
  date_dived date,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, site_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_site_status_user_id ON public.user_site_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_site_status_site_id ON public.user_site_status(site_id);
CREATE INDEX IF NOT EXISTS idx_sites_lat_lng ON public.sites(lat, lng);

-- Enable Row Level Security
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_site_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sites table
-- Authenticated users can read all sites
CREATE POLICY "Authenticated users can read sites"
  ON public.sites
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_site_status table
-- Users can only see their own status
CREATE POLICY "Users can read own site status"
  ON public.user_site_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own status
CREATE POLICY "Users can insert own site status"
  ON public.user_site_status
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own status
CREATE POLICY "Users can update own site status"
  ON public.user_site_status
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own status
CREATE POLICY "Users can delete own site status"
  ON public.user_site_status
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on user_site_status
DROP TRIGGER IF EXISTS update_user_site_status_updated_at ON public.user_site_status;
CREATE TRIGGER update_user_site_status_updated_at
  BEFORE UPDATE ON public.user_site_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

