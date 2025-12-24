import { create } from 'zustand'
import type { Site, SiteWithStatus, UserSiteStatus, Difficulty } from '@/lib/types/database'

export interface Filters {
  region: string | null
  difficulty: Difficulty | null
  type: string | null
}

// Panel view modes
export type PanelView = 'none' | 'region-browser' | 'site-detail'

// Destination group structure
export interface DestinationGroup {
  destination: string
  country: string
  spots: SiteWithStatus[]
  bounds: [[number, number], [number, number]] // [[minLat, minLng], [maxLat, maxLng]]
}

interface AppState {
  // Sites data
  sites: SiteWithStatus[]
  isLoading: boolean
  
  // Selected site
  selectedSiteId: string | null
  isPanelCollapsed: boolean
  
  // Panel view state
  panelView: PanelView
  expandedDestination: string | null
  
  // Filters
  filters: Filters
  
  // UI state
  isFilterSheetOpen: boolean
  isSiteDetailOpen: boolean
  
  // Map control
  fitBoundsTarget: [[number, number], [number, number]] | null
  
  // Actions
  setSites: (sites: SiteWithStatus[]) => void
  setLoading: (loading: boolean) => void
  setSelectedSite: (siteId: string | null) => void
  togglePanelCollapsed: () => void
  setFilters: (filters: Partial<Filters>) => void
  clearFilters: () => void
  setFilterSheetOpen: (open: boolean) => void
  setSiteDetailOpen: (open: boolean) => void
  updateSiteStatus: (siteId: string, status: Partial<UserSiteStatus>) => void
  
  // New actions
  setPanelView: (view: PanelView) => void
  setExpandedDestination: (destination: string | null) => void
  setFitBoundsTarget: (bounds: [[number, number], [number, number]] | null) => void
  selectDestination: (destination: string) => void
}

const defaultFilters: Filters = {
  region: null,
  difficulty: null,
  type: null,
}

export const useAppStore = create<AppState>((set, get) => ({
  sites: [],
  isLoading: true,
  selectedSiteId: null,
  isPanelCollapsed: false,
  panelView: 'none',
  expandedDestination: null,
  filters: defaultFilters,
  isFilterSheetOpen: false,
  isSiteDetailOpen: false,
  fitBoundsTarget: null,

  setSites: (sites) => set({ sites }),
  setLoading: (isLoading) => set({ isLoading }),
  
  setSelectedSite: (siteId) => {
    set({ 
      selectedSiteId: siteId, 
      isSiteDetailOpen: siteId !== null,
      isPanelCollapsed: false,
      panelView: siteId ? 'site-detail' : get().filters.region ? 'region-browser' : 'none'
    })
  },

  togglePanelCollapsed: () => {
    set((state) => ({ isPanelCollapsed: !state.isPanelCollapsed }))
  },

  setFilters: (newFilters) => {
    const current = get()
    const updatedFilters = { ...current.filters, ...newFilters }
    
    // When region is selected, show region browser
    const hasRegion = updatedFilters.region !== null
    const newPanelView: PanelView = hasRegion ? 'region-browser' : 'none'
    
    // Calculate bounds for filtered sites
    const sites = current.sites
    const filteredSites = sites.filter((site) => {
      if (updatedFilters.region && site.country !== updatedFilters.region) return false
      if (updatedFilters.difficulty && site.difficulty !== updatedFilters.difficulty) return false
      if (updatedFilters.type && !site.tags?.includes(updatedFilters.type)) return false
      return true
    })
    
    // Only auto-fit bounds if we have filtered sites and at least one filter is active
    const hasActiveFilter = updatedFilters.region || updatedFilters.difficulty || updatedFilters.type
    let fitBoundsTarget: [[number, number], [number, number]] | null = null
    
    if (hasActiveFilter && filteredSites.length > 0) {
      const lats = filteredSites.map(s => s.lat)
      const lngs = filteredSites.map(s => s.lng)
      const padding = filteredSites.length === 1 ? 2 : 0.5
      fitBoundsTarget = [
        [Math.min(...lats) - padding, Math.min(...lngs) - padding],
        [Math.max(...lats) + padding, Math.max(...lngs) + padding]
      ]
    }
    
    set({
      filters: updatedFilters,
      panelView: current.selectedSiteId ? 'site-detail' : newPanelView,
      expandedDestination: null,
      selectedSiteId: hasRegion ? null : current.selectedSiteId,
      fitBoundsTarget,
    })
  },

  clearFilters: () => {
    set({ 
      filters: defaultFilters,
      panelView: 'none',
      expandedDestination: null,
    })
  },

  setFilterSheetOpen: (open) => {
    set({ isFilterSheetOpen: open })
  },

  setSiteDetailOpen: (open) => {
    const current = get()
    set({ 
      isSiteDetailOpen: open,
      selectedSiteId: open ? current.selectedSiteId : null,
      panelView: open ? 'site-detail' : (current.filters.region ? 'region-browser' : 'none'),
    })
  },

  updateSiteStatus: (siteId, statusUpdate) => {
    set((state) => ({
      sites: state.sites.map((site) => {
        if (site.id !== siteId) return site
        return {
          ...site,
          status: site.status
            ? { ...site.status, ...statusUpdate }
            : {
                user_id: '',
                site_id: siteId,
                want: false,
                dived: false,
                favorite: false,
                notes: null,
                date_dived: null,
                updated_at: new Date().toISOString(),
                ...statusUpdate,
              },
        }
      }),
    }))
  },

  setPanelView: (view) => {
    set({ panelView: view })
  },

  setExpandedDestination: (destination) => {
    set({ expandedDestination: destination })
  },

  setFitBoundsTarget: (bounds) => {
    set({ fitBoundsTarget: bounds })
  },

  selectDestination: (destination) => {
    const sites = get().sites
    const filters = get().filters
    
    // Find spots for this destination
    const destinationSpots = sites.filter(s => {
      if (filters.region && s.country !== filters.region) return false
      return s.destination === destination
    })
    
    if (destinationSpots.length === 0) return
    
    // Calculate bounds
    const lats = destinationSpots.map(s => s.lat)
    const lngs = destinationSpots.map(s => s.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats) - 0.5, Math.min(...lngs) - 0.5],
      [Math.max(...lats) + 0.5, Math.max(...lngs) + 0.5]
    ]
    
    set({
      expandedDestination: destination,
      fitBoundsTarget: bounds,
    })
  },
}))

// Selectors
export const useFilteredSites = () => {
  const sites = useAppStore((s) => s.sites)
  const filters = useAppStore((s) => s.filters)

  return sites.filter((site) => {
    if (filters.region && site.country !== filters.region) return false
    if (filters.difficulty && site.difficulty !== filters.difficulty) return false
    if (filters.type && !site.tags?.includes(filters.type)) return false
    return true
  })
}

export const useSelectedSite = () => {
  const sites = useAppStore((s) => s.sites)
  const selectedSiteId = useAppStore((s) => s.selectedSiteId)
  return sites.find((s) => s.id === selectedSiteId) || null
}

export const useDivedSites = () => {
  const sites = useAppStore((s) => s.sites)
  return sites.filter((s) => s.status?.dived)
}

export const useFavoriteSites = () => {
  const sites = useAppStore((s) => s.sites)
  return sites.filter((s) => s.status?.favorite)
}

// Get destinations grouped by destination field
export const useDestinationGroups = (): DestinationGroup[] => {
  const filteredSites = useFilteredSites()
  
  // Group by destination
  const groups = new Map<string, SiteWithStatus[]>()
  
  for (const site of filteredSites) {
    const dest = site.destination || site.country || 'Unknown'
    const existing = groups.get(dest) || []
    existing.push(site)
    groups.set(dest, existing)
  }
  
  // Convert to array and add bounds
  return Array.from(groups.entries())
    .map(([destination, spots]) => {
      const lats = spots.map(s => s.lat)
      const lngs = spots.map(s => s.lng)
      
      return {
        destination,
        country: spots[0]?.country || '',
        spots,
        bounds: [
          [Math.min(...lats) - 0.2, Math.min(...lngs) - 0.2],
          [Math.max(...lats) + 0.2, Math.max(...lngs) + 0.2]
        ] as [[number, number], [number, number]]
      }
    })
    .sort((a, b) => b.spots.length - a.spots.length)
}
