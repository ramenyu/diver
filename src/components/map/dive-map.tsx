'use client'

import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import { Map, Waves, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore, useFilteredSites, useDivedSites } from '@/lib/store'
import type { SiteWithStatus } from '@/lib/types/database'

// Basemap options
type BasemapType = 'base' | 'ocean'

const BASEMAPS = {
  base: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com">CARTO</a>',
    bg: '#e8e8e8', // Matches CARTO Positron ocean/land blend at low zoom
  },
  ocean: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    bg: '#b8d4e8',
  },
}

// Marker colors - ring system for status
const COLORS = {
  default: '#475569',    // slate-600 - dark fill for contrast
  dived: '#22c55e',      // green-500 - logged dives ring
  favorite: '#f59e0b',   // amber-500 - favorite ring (gold)
  selected: '#0ea5e9',   // sky-500 - selected marker
}

// Check if site has any user status
function hasUserStatus(site: SiteWithStatus): boolean {
  const status = site.status
  return !!(status?.dived || status?.favorite)
}

// Get ring color based on status priority
function getStatusRingColor(site: SiteWithStatus): string | null {
  const status = site.status
  if (!status) return null
  
  // Priority: favorite > dived
  if (status.favorite) return COLORS.favorite
  if (status.dived) return COLORS.dived
  return null
}

// Custom marker icon - dark fill + white stroke + optional status ring
function createMarkerIcon(site: SiteWithStatus, isSelected: boolean) {
  const ringColor = getStatusRingColor(site)
  const hasStatus = hasUserStatus(site)
  // Larger sizes for better visibility
  const baseSize = hasStatus ? 16 : 14
  const size = isSelected ? 20 : baseSize
  
  // Ring styling for status markers
  const ringStyle = ringColor && !isSelected
    ? `box-shadow: 0 0 0 3px ${ringColor}, 0 0 0 5px white, 0 3px 8px rgba(0, 0, 0, 0.35);`
    : isSelected
    ? `
      box-shadow: 
        0 0 0 5px rgba(14, 165, 233, 0.5),
        0 0 0 10px rgba(14, 165, 233, 0.25),
        0 4px 12px rgba(0, 0, 0, 0.4);
      animation: marker-pulse 2s ease-in-out infinite;
    `
    : `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);`

  const fillColor = isSelected ? COLORS.selected : COLORS.default

  return L.divIcon({
    className: isSelected ? 'dive-marker dive-marker--selected' : 'dive-marker',
    html: `<div class="dive-marker-inner" style="
      width: ${size}px;
      height: ${size}px;
      background: ${fillColor};
      border: 2.5px solid white;
      border-radius: 50%;
      ${ringStyle}
    "></div>`,
    iconSize: [size + 14, size + 14],
    iconAnchor: [(size + 14) / 2, (size + 14) / 2],
  })
}

// Custom cluster icon - shows status dots if cluster contains user-marked sites
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount()
  let size = 32
  let fontSize = 11
  
  if (count >= 100) {
    size = 42
    fontSize = 13
  } else if (count >= 50) {
    size = 38
    fontSize = 12
  } else if (count >= 20) {
    size = 35
    fontSize = 11
  }
  
  return L.divIcon({
    html: `<div class="cluster-marker" style="
      width: ${size}px;
      height: ${size}px;
      background: #475569;
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: ${fontSize}px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    ">${count}</div>`,
    className: 'cluster-icon',
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  })
}

// Component to handle map centering, fitBounds, and resize
function MapController({ basemap }: { basemap: BasemapType }) {
  const map = useMap()
  const sites = useAppStore((s) => s.sites)
  const selectedSiteId = useAppStore((s) => s.selectedSiteId)
  const fitBoundsTarget = useAppStore((s) => s.fitBoundsTarget)
  const setFitBoundsTarget = useAppStore((s) => s.setFitBoundsTarget)
  const panelView = useAppStore((s) => s.panelView)
  const isPanelCollapsed = useAppStore((s) => s.isPanelCollapsed)
  const isFilterSheetOpen = useAppStore((s) => s.isFilterSheetOpen)


  // Invalidate map size when layout changes
  const invalidateSize = useCallback(() => {
    // Use requestAnimationFrame for smoother invalidation
    requestAnimationFrame(() => {
      setTimeout(() => {
        map.invalidateSize({ animate: false })
      }, 50)
    })
  }, [map])

  // Handle panel changes - invalidate size
  useEffect(() => {
    invalidateSize()
  }, [panelView, isPanelCollapsed, isFilterSheetOpen, invalidateSize])

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', invalidateSize)
    return () => window.removeEventListener('resize', invalidateSize)
  }, [invalidateSize])

  // Initial size invalidation after mount - critical for Leaflet sizing
  useEffect(() => {
    // Immediate invalidation
    map.invalidateSize()
    
    // Multiple delayed updates
    const timers = [
      setTimeout(() => { map.invalidateSize(); }, 0),
      setTimeout(() => { map.invalidateSize(); }, 100),
      setTimeout(() => { map.invalidateSize(); }, 300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [map])

  // Handle basemap change - update container background
  useEffect(() => {
    const container = map.getContainer()
    container.style.background = BASEMAPS[basemap].bg
  }, [map, basemap])

  // Handle selected site - fly to it
  useEffect(() => {
    if (selectedSiteId) {
      const site = sites.find((s) => s.id === selectedSiteId)
      if (site) {
        map.flyTo([site.lat, site.lng], Math.max(map.getZoom(), 8), {
          duration: 0.5,
        })
      }
    }
  }, [selectedSiteId, sites, map])

  // Handle fitBounds target (triggered by filter changes only)
  useEffect(() => {
    if (fitBoundsTarget) {
      map.fitBounds(fitBoundsTarget, {
        padding: [50, 50],
        maxZoom: 10,
        animate: true,
        duration: 0.5,
      })
      // Clear the target after fitting
      setFitBoundsTarget(null)
    }
  }, [fitBoundsTarget, map, setFitBoundsTarget])

  return null
}

export function DiveMap() {
  const filteredSites = useFilteredSites()
  const divedSites = useDivedSites()
  const selectedSiteId = useAppStore((s) => s.selectedSiteId)
  const setSelectedSite = useAppStore((s) => s.setSelectedSite)
  const mapRef = useRef<L.Map>(null)
  const [basemap, setBasemap] = useState<BasemapType>('base')

  // Find the selected site
  const selectedSite = useMemo(() => {
    return filteredSites.find((s) => s.id === selectedSiteId)
  }, [filteredSites, selectedSiteId])

  // Split sites into two groups:
  // 1. User-marked sites (dived/favorite) - NOT clustered, always visible
  // 2. Unmarked sites - clustered
  const { userMarkedSites, unmarkedSites } = useMemo(() => {
    const userMarked: SiteWithStatus[] = []
    const unmarked: SiteWithStatus[] = []
    
    for (const site of filteredSites) {
      // Skip selected site - rendered separately
      if (site.id === selectedSiteId) continue
      
      if (hasUserStatus(site)) {
        userMarked.push(site)
      } else {
        unmarked.push(site)
      }
    }
    
    return { userMarkedSites: userMarked, unmarkedSites: unmarked }
  }, [filteredSites, selectedSiteId])

  // Memoize clustered markers (only unmarked sites)
  const clusteredMarkers = useMemo(() => {
    return unmarkedSites.map((site) => (
      <Marker
        key={site.id}
        position={[site.lat, site.lng]}
        icon={createMarkerIcon(site, false)}
        eventHandlers={{
          click: () => setSelectedSite(site.id),
        }}
        zIndexOffset={0}
      />
    ))
  }, [unmarkedSites, setSelectedSite])

  // Memoize user-marked markers (NOT clustered, higher z-index)
  const userMarkedMarkers = useMemo(() => {
    return userMarkedSites.map((site) => (
      <Marker
        key={site.id}
        position={[site.lat, site.lng]}
        icon={createMarkerIcon(site, false)}
        eventHandlers={{
          click: () => setSelectedSite(site.id),
        }}
        zIndexOffset={500}
      />
    ))
  }, [userMarkedSites, setSelectedSite])

  return (
    <div className="relative w-full h-full" style={{ background: BASEMAPS[basemap].bg }}>
      {/* CSS for marker animations and Leaflet overrides */}
      <style jsx global>{`
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          font-family: inherit;
        }
        
        /* Override Leaflet default marker icon styles */
        .leaflet-marker-icon.dive-marker,
        .leaflet-marker-icon.cluster-icon {
          background: transparent !important;
          border: none !important;
        }
        
        .dive-marker,
        .cluster-icon {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        @keyframes marker-pulse {
          0%, 100% {
            box-shadow: 
              0 0 0 4px rgba(14, 165, 233, 0.4),
              0 0 0 8px rgba(14, 165, 233, 0.2),
              0 3px 10px rgba(0, 0, 0, 0.35);
            transform: scale(1);
          }
          50% {
            box-shadow: 
              0 0 0 6px rgba(14, 165, 233, 0.3),
              0 0 0 12px rgba(14, 165, 233, 0.15),
              0 3px 10px rgba(0, 0, 0, 0.35);
            transform: scale(1.15);
          }
        }
        
        .dive-marker--selected {
          z-index: 1000 !important;
        }
        
        .dive-marker-inner,
        .cluster-marker {
          transition: transform 0.15s ease-out;
          cursor: pointer;
        }
        
        .dive-marker:hover .dive-marker-inner,
        .cluster-icon:hover .cluster-marker {
          transform: scale(1.15);
        }
        
        .cluster-icon:hover .cluster-marker {
          transform: scale(1.1);
        }
        
        /* Cluster group styling */
        .marker-cluster-small,
        .marker-cluster-medium,
        .marker-cluster-large {
          background: transparent !important;
        }
        
        /* Hide Leaflet attribution on small screens */
        @media (max-width: 640px) {
          .leaflet-control-attribution {
            font-size: 8px;
            max-width: 150px;
          }
        }
      `}</style>
      
      <MapContainer
        ref={mapRef}
        center={[25, 10]}
        zoom={3}
        minZoom={3}
        maxZoom={18}
        className="w-full h-full"
        style={{ background: BASEMAPS[basemap].bg }}
        zoomControl={true}
        scrollWheelZoom={true}
        worldCopyJump={false}
        maxBounds={[[-70, -200], [80, 200]]}
        maxBoundsViscosity={1.0}
        boundsOptions={{ padding: [0, 0] }}
      >
        <TileLayer
          key={basemap}
          attribution={BASEMAPS[basemap].attribution}
          url={BASEMAPS[basemap].url}
          noWrap={false}
        />
        <MapController basemap={basemap} />
        
        {/* Layer 1: Clustered markers (unmarked sites only) */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={10}
        >
          {clusteredMarkers}
        </MarkerClusterGroup>
        
        {/* Layer 2: User-marked sites (NOT clustered, always visible) */}
        {userMarkedMarkers}
        
        {/* Layer 3: Selected marker (highest z-index) */}
        {selectedSite && (
          <Marker
            position={[selectedSite.lat, selectedSite.lng]}
            icon={createMarkerIcon(selectedSite, true)}
            zIndexOffset={1000}
          />
        )}
      </MapContainer>

      {/* Map HUD - Logged count pill */}
      {divedSites.length > 0 && (
        <div className="absolute bottom-5 left-3 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-md shadow-md px-2 py-1 border border-border/40">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          <span className="text-[11px] font-medium text-green-700">{divedSites.length} logged</span>
        </div>
      )}

      {/* Basemap Toggle */}
      <div className="absolute bottom-5 right-3 z-[1000] flex gap-0.5 bg-white/95 backdrop-blur-sm rounded-md shadow-md p-0.5 m-5 border border-border/40">
        <Button
          variant={basemap === 'base' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setBasemap('base')}
          className="h-7 px-2 gap-1"
        >
          <Map className="w-3 h-3" />
          <span className="text-[11px]">Base</span>
        </Button>
        <Button
          variant={basemap === 'ocean' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setBasemap('ocean')}
          className="h-7 px-2 gap-1"
        >
          <Waves className="w-3 h-3" />
          <span className="text-[11px]">Ocean</span>
        </Button>
      </div>
    </div>
  )
}
