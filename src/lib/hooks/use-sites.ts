'use client'

import { useEffect, useCallback } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import type { UserSiteStatus, SiteWithStatus } from '@/lib/types/database'
import seedSites from '../../../seed_sites.json'

// Local storage key for demo mode status persistence
const DEMO_STATUS_KEY = 'joy-the-diver-demo-statuses'

// Get statuses from localStorage for demo mode
function getDemoStatuses(): Record<string, Partial<UserSiteStatus>> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(DEMO_STATUS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Save statuses to localStorage for demo mode
function saveDemoStatuses(statuses: Record<string, Partial<UserSiteStatus>>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DEMO_STATUS_KEY, JSON.stringify(statuses))
  } catch {
    // Ignore storage errors
  }
}

export function useSites() {
  const setSites = useAppStore((s) => s.setSites)
  const setLoading = useAppStore((s) => s.setLoading)

  const fetchSites = useCallback(async () => {
    setLoading(true)

    // If Supabase is not configured, use seed data for demo
    if (!isSupabaseConfigured()) {
      const demoStatuses = getDemoStatuses()
      const demoSites: SiteWithStatus[] = seedSites.map((site, index) => {
        const siteId = `demo-${index}`
        const savedStatus = demoStatuses[siteId]
        return {
          id: siteId,
          name: site.name,
          destination: site.destination,
          country: site.country,
          lat: site.lat,
          lng: site.lng,
          difficulty: site.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
          depth_min: site.depth_min,
          depth_max: site.depth_max,
          best_season: site.best_season,
          tags: site.tags,
          created_at: new Date().toISOString(),
          status: savedStatus ? {
            user_id: 'demo',
            site_id: siteId,
            want: false,
            dived: savedStatus.dived ?? false,
            favorite: savedStatus.favorite ?? false,
            notes: savedStatus.notes ?? null,
            date_dived: savedStatus.date_dived ?? null,
            updated_at: new Date().toISOString(),
          } as UserSiteStatus : null,
        }
      })
      setSites(demoSites)
      setLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch all sites
      const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .order('name')

      if (sitesError) throw sitesError

      let sitesWithStatus: SiteWithStatus[] = sites || []

      // If user is logged in, fetch their statuses
      if (user) {
        const { data: statuses, error: statusError } = await supabase
          .from('user_site_status')
          .select('*')
          .eq('user_id', user.id)

        if (statusError) throw statusError

        // Merge statuses with sites
        const statusMap = new Map<string, UserSiteStatus>()
        statuses?.forEach((status) => {
          statusMap.set(status.site_id, status)
        })

        sitesWithStatus = sites?.map((site) => ({
          ...site,
          status: statusMap.get(site.id) || null,
        })) || []
      }

      setSites(sitesWithStatus)
    } catch (error) {
      console.error('Error fetching sites:', error)
      // Fallback to seed data on error
      const demoSites: SiteWithStatus[] = seedSites.map((site, index) => ({
        id: `demo-${index}`,
        name: site.name,
        destination: site.destination,
        country: site.country,
        lat: site.lat,
        lng: site.lng,
        difficulty: site.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        depth_min: site.depth_min,
        depth_max: site.depth_max,
        best_season: site.best_season,
        tags: site.tags,
        created_at: new Date().toISOString(),
        status: null,
      }))
      setSites(demoSites)
    } finally {
      setLoading(false)
    }
  }, [setSites, setLoading])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  return { refetch: fetchSites }
}

export function useSiteStatus() {
  const updateSiteStatus = useAppStore((s) => s.updateSiteStatus)
  const sites = useAppStore((s) => s.sites)

  const toggleStatus = useCallback(async (
    siteId: string,
    field: 'dived' | 'favorite',
    currentValue: boolean
  ) => {
    const newValue = !currentValue
    
    // Optimistic update
    updateSiteStatus(siteId, { [field]: newValue })

    // If Supabase is not configured, save to localStorage for demo persistence
    if (!isSupabaseConfigured()) {
      console.log('[Demo Mode] Saving to localStorage:', { siteId, field, newValue })
      const demoStatuses = getDemoStatuses()
      const currentSite = sites.find(s => s.id === siteId)
      demoStatuses[siteId] = {
        ...demoStatuses[siteId],
        dived: field === 'dived' ? newValue : (currentSite?.status?.dived ?? demoStatuses[siteId]?.dived ?? false),
        favorite: field === 'favorite' ? newValue : (currentSite?.status?.favorite ?? demoStatuses[siteId]?.favorite ?? false),
        notes: currentSite?.status?.notes ?? demoStatuses[siteId]?.notes ?? null,
      }
      saveDemoStatuses(demoStatuses)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      console.error('[Supabase] Client not available')
      return
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('[Auth] Error getting user:', authError)
      updateSiteStatus(siteId, { [field]: currentValue })
      return
    }
    
    if (!user) {
      console.warn('[Auth] No user logged in - status not saved to database')
      // Revert optimistic update since we can't save
      updateSiteStatus(siteId, { [field]: currentValue })
      // Show alert to user
      alert('Please log in to save your dive sites. Your changes will not be saved.')
      return
    }

    console.log('[Supabase] Saving status for user:', user.id, { siteId, field, newValue })

    // First, fetch current status to preserve other fields
    const { data: existingStatus, error: fetchError } = await supabase
      .from('user_site_status')
      .select('*')
      .eq('user_id', user.id)
      .eq('site_id', siteId)
      .single()

    // PGRST116 means no rows found, which is fine for new entries
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[Supabase] Error fetching existing status:', fetchError)
    }

    // Upsert to database with all fields preserved
    const { error } = await supabase
      .from('user_site_status')
      .upsert({
        user_id: user.id,
        site_id: siteId,
        want: existingStatus?.want ?? false,
        dived: field === 'dived' ? newValue : (existingStatus?.dived ?? false),
        favorite: field === 'favorite' ? newValue : (existingStatus?.favorite ?? false),
        notes: existingStatus?.notes ?? null,
        date_dived: existingStatus?.date_dived ?? null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,site_id',
      })

    if (error) {
      console.error('[Supabase] Error upserting status:', error)
      // Revert on error
      updateSiteStatus(siteId, { [field]: currentValue })
    } else {
      console.log('[Supabase] Status saved successfully:', { siteId, field, newValue })
    }
  }, [updateSiteStatus, sites])

  const updateNotes = useCallback(async (siteId: string, notes: string) => {
    // Optimistic update
    updateSiteStatus(siteId, { notes })

    // If Supabase is not configured, save to localStorage for demo persistence
    if (!isSupabaseConfigured()) {
      console.log('[Demo Mode] Saving notes to localStorage:', { siteId, notes: notes.substring(0, 50) })
      const demoStatuses = getDemoStatuses()
      const currentSite = sites.find(s => s.id === siteId)
      demoStatuses[siteId] = {
        ...demoStatuses[siteId],
        dived: currentSite?.status?.dived ?? demoStatuses[siteId]?.dived ?? false,
        favorite: currentSite?.status?.favorite ?? demoStatuses[siteId]?.favorite ?? false,
        notes,
      }
      saveDemoStatuses(demoStatuses)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      console.error('[Supabase] Client not available')
      return
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('[Auth] Error getting user:', authError)
      return
    }
    
    if (!user) {
      console.warn('[Auth] No user logged in - notes not saved to database')
      alert('Please log in to save your notes. Your changes will not be saved.')
      return
    }

    // First, fetch current status to preserve other fields
    const { data: existingStatus, error: fetchError } = await supabase
      .from('user_site_status')
      .select('*')
      .eq('user_id', user.id)
      .eq('site_id', siteId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[Supabase] Error fetching existing status:', fetchError)
    }

    // Upsert to database with all fields preserved
    const { error } = await supabase
      .from('user_site_status')
      .upsert({
        user_id: user.id,
        site_id: siteId,
        want: existingStatus?.want ?? false,
        dived: existingStatus?.dived ?? false,
        favorite: existingStatus?.favorite ?? false,
        notes,
        date_dived: existingStatus?.date_dived ?? null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,site_id',
      })

    if (error) {
      console.error('[Supabase] Error updating notes:', error)
    } else {
      console.log('[Supabase] Notes saved successfully:', { siteId })
    }
  }, [updateSiteStatus, sites])

  return { toggleStatus, updateNotes }
}
