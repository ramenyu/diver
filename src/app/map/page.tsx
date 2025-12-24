'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppBar } from '@/components/layout/app-bar'
import { MapWrapper } from '@/components/map/map-wrapper'
import { FilterSidebar } from '@/components/filters/filter-sidebar'
import { FilterSheet } from '@/components/filters/filter-sheet'
import { SiteDetailPanel } from '@/components/site/site-detail-panel'
import { SiteDetailSheet } from '@/components/site/site-detail-sheet'
import { RegionBrowser } from '@/components/site/region-browser'
import { useAppStore } from '@/lib/store'
import { useSites } from '@/lib/hooks/use-sites'

export default function MapPage() {
  const panelView = useAppStore((s) => s.panelView)
  const setFilterSheetOpen = useAppStore((s) => s.setFilterSheetOpen)
  const isLoading = useAppStore((s) => s.isLoading)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Load sites from Supabase
  useSites()

  return (
    // Rule 1: App root - h-screen overflow-hidden, text-sm leading-5 for consistent typography
    <div className="h-screen overflow-hidden flex flex-col text-sm leading-5">
      {/* Rule 2: Header with fixed height */}
      <AppBar />
      
      {/* Rule 3: Main content container - flex flex-1 min-h-0 */}
      <main className="flex flex-1 min-h-0">
        {/* Rule 4: Sidebar + map row */}
        
        {/* Desktop: Left Filter Sidebar */}
        <FilterSidebar 
          className="hidden lg:flex shrink-0 h-full overflow-y-auto" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Rule 4 & 5: Map column - flex-1 min-h-0 h-full */}
        <div className="flex-1 min-h-0 min-w-0 h-full relative">
          {/* Map container takes full size of parent */}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <div className="text-muted-foreground text-sm">Loading sites...</div>
            </div>
          ) : (
            <div className="w-full h-full">
              <MapWrapper />
            </div>
          )}

          {/* Mobile: Filter Button */}
          <div className="lg:hidden absolute top-4 left-4 z-20">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilterSheetOpen(true)}
              className="shadow-md bg-card/95 backdrop-blur-sm border border-border/50"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Desktop: Right Panel - switches between Region Browser and Site Detail */}
        <div className="hidden lg:flex shrink-0 h-full">
          {panelView === 'region-browser' && (
            <RegionBrowser />
          )}
          {panelView === 'site-detail' && (
            <SiteDetailPanel />
          )}
        </div>

        {/* Mobile: Filter Bottom Sheet */}
        <FilterSheet />

        {/* Mobile: Site Detail / Region Browser Bottom Sheet */}
        <div className="lg:hidden">
          <SiteDetailSheet />
        </div>
      </main>
    </div>
  )
}
