'use client'

import dynamic from 'next/dynamic'

// Dynamically import DiveMap with no SSR to avoid Leaflet issues
const DiveMap = dynamic(
  () => import('./dive-map').then((mod) => mod.DiveMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    ),
  }
)

export function MapWrapper() {
  // Wrapper must have explicit w-full h-full for Leaflet
  return (
    <div className="w-full h-full">
      <DiveMap />
    </div>
  )
}
