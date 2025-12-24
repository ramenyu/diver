'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Calendar, ArrowDown, Heart, Check, ChevronDown, ChevronRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAppStore, useSelectedSite, useDestinationGroups, type DestinationGroup } from '@/lib/store'
import { useSiteStatus } from '@/lib/hooks/use-sites'
import { useDebouncedCallback } from '@/lib/hooks/use-debounce'
import type { SiteWithStatus } from '@/lib/types/database'
import { cn } from '@/lib/utils'

// Extract highlight tags from spots
function getHighlightTags(spots: SiteWithStatus[] | string[]): string[] {
  const tagCounts = new Map<string, number>()
  const priorityTags = ['sharks', 'manta rays', 'whale sharks', 'turtles', 'wreck', 'cave', 'macro', 'reef', 'wall', 'cenote']
  
  // Handle both spot arrays and tag arrays
  const allTags = Array.isArray(spots) && typeof spots[0] === 'string' 
    ? spots as string[]
    : (spots as SiteWithStatus[]).flatMap(s => s.tags || [])
  
  for (const tag of allTags) {
    const lower = tag.toLowerCase()
    tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1)
  }
  
  // Sort by priority, then by count
  const sorted = Array.from(tagCounts.entries())
    .sort((a, b) => {
      const aPriority = priorityTags.indexOf(a[0])
      const bPriority = priorityTags.indexOf(b[0])
      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority
      if (aPriority !== -1) return -1
      if (bPriority !== -1) return 1
      return b[1] - a[1]
    })
    .map(([tag]) => tag)
  
  return sorted.slice(0, 3)
}

// Hook to detect if we're on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export function SiteDetailSheet() {
  const panelView = useAppStore((s) => s.panelView)
  const filters = useAppStore((s) => s.filters)
  const isMobile = useIsMobile()

  // Only render on mobile
  if (!isMobile) return null

  // Show region browser sheet when region is selected
  if (panelView === 'region-browser' && filters.region) {
    return <RegionBrowserSheet />
  }

  // Show site detail sheet when a site is selected
  if (panelView === 'site-detail') {
    return <SiteDetailSheetContent />
  }

  return null
}

// Region Browser Sheet for mobile
function RegionBrowserSheet() {
  const filters = useAppStore((s) => s.filters)
  const clearFilters = useAppStore((s) => s.clearFilters)
  const destinationGroups = useDestinationGroups()
  const expandedDestination = useAppStore((s) => s.expandedDestination)
  const setExpandedDestination = useAppStore((s) => s.setExpandedDestination)
  const selectDestination = useAppStore((s) => s.selectDestination)
  
  const isOpen = filters.region !== null
  const totalSites = destinationGroups.reduce((acc, g) => acc + g.spots.length, 0)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) clearFilters() }}>
      <SheetContent side="bottom" className="h-[70vh] p-0 rounded-t-2xl" aria-describedby={undefined}>
        <SheetHeader className="px-5 pt-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-left text-base">{filters.region}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalSites} dive site{totalSites !== 1 ? 's' : ''} · {destinationGroups.length} destination{destinationGroups.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFilters} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="p-3 space-y-1 pb-8">
            {destinationGroups.map((group) => (
              <MobileDestinationCard
                key={group.destination}
                group={group}
                isExpanded={expandedDestination === group.destination}
                onToggle={() => {
                  if (expandedDestination === group.destination) {
                    setExpandedDestination(null)
                  } else {
                    selectDestination(group.destination)
                  }
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileDestinationCardProps {
  group: DestinationGroup
  isExpanded: boolean
  onToggle: () => void
}

function MobileDestinationCard({ group, isExpanded, onToggle }: MobileDestinationCardProps) {
  const highlights = getHighlightTags(group.spots)
  const previewSpots = group.spots.slice(0, 2)
  const remainingCount = group.spots.length - 2

  return (
    <div className={cn(
      'rounded-lg border transition-all duration-150',
      isExpanded 
        ? 'border-border bg-secondary/30' 
        : 'border-transparent hover:border-border'
    )}>
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-start gap-3 text-left"
      >
        {/* Placeholder */}
        <div className="w-10 h-10 rounded-md bg-secondary/60 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{group.destination}</span>
            <span className="text-xs text-muted-foreground">{group.spots.length}</span>
          </div>
          
          {/* Spot preview */}
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {previewSpots.map(s => s.name).join(', ')}
            {remainingCount > 0 && ` +${remainingCount} more`}
          </p>
          
          {/* Highlight tags */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {highlights.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 h-4 font-normal capitalize bg-secondary/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 mt-0.5',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-0.5">
          {group.spots.map((spot) => (
            <MobileSpotRow key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  )
}

function MobileSpotRow({ spot }: { spot: SiteWithStatus }) {
  const setSelectedSite = useAppStore((s) => s.setSelectedSite)
  const { toggleStatus } = useSiteStatus()
  const status = spot.status

  return (
    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors">
      <button
        onClick={() => setSelectedSite(spot.id)}
        className="flex-1 min-w-0 text-left"
      >
        <span className="text-sm font-medium truncate block">{spot.name}</span>
        {spot.depth_max && (
          <span className="text-[10px] text-muted-foreground">{spot.depth_max}m</span>
        )}
      </button>

      <div className="flex items-center gap-0.5">
        <QuickActionButton
          icon={<Check className="w-3.5 h-3.5" />}
          active={status?.dived || false}
          onClick={() => toggleStatus(spot.id, 'dived', status?.dived || false)}
          activeClass="text-emerald-600"
        />
        <QuickActionButton
          icon={<Heart className="w-3.5 h-3.5" />}
          active={status?.favorite || false}
          onClick={() => toggleStatus(spot.id, 'favorite', status?.favorite || false)}
          activeClass="text-rose-500"
        />
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  activeClass: string
}

function QuickActionButton({ icon, active, onClick, activeClass }: QuickActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        active ? activeClass : 'text-muted-foreground/40'
      )}
    >
      {icon}
    </button>
  )
}

// Site Detail Sheet for mobile
function SiteDetailSheetContent() {
  const site = useSelectedSite()
  const isSiteDetailOpen = useAppStore((s) => s.isSiteDetailOpen)
  const setSiteDetailOpen = useAppStore((s) => s.setSiteDetailOpen)
  const { toggleStatus, updateNotes } = useSiteStatus()
  
  const [localNotes, setLocalNotes] = useState('')

  useEffect(() => {
    setLocalNotes(site?.status?.notes || '')
  }, [site?.id, site?.status?.notes])

  const debouncedUpdateNotes = useDebouncedCallback(
    useCallback((siteId: string, notes: string) => {
      updateNotes(siteId, notes)
    }, [updateNotes]),
    600
  )

  const handleNotesChange = (value: string) => {
    setLocalNotes(value)
    if (site) {
      debouncedUpdateNotes(site.id, value)
    }
  }

  if (!site) return null

  const status = site.status

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-orange-100 text-orange-700',
    expert: 'bg-red-100 text-red-700',
  }

  return (
    <Sheet open={isSiteDetailOpen} onOpenChange={setSiteDetailOpen}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl" aria-describedby={undefined}>
        <ScrollArea className="h-full">
          <div className="px-5 py-4 pb-8 space-y-4">
            {/* Header */}
            <div>
              <h2 className="font-semibold text-lg">{site.name}</h2>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm">{site.destination || site.country}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {site.difficulty && (
                <Badge variant="secondary" className={difficultyColors[site.difficulty]}>
                  {site.difficulty}
                </Badge>
              )}
              {site.tags?.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {site.best_season && (
                <InfoCard
                  icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                  label="Best Season"
                  value={site.best_season}
                />
              )}
              {(site.depth_min || site.depth_max) && (
                <InfoCard
                  icon={<ArrowDown className="w-4 h-4 text-muted-foreground" />}
                  label="Depth Range"
                  value={`${site.depth_min || '?'}-${site.depth_max || '?'}m`}
                />
              )}
            </div>

            <Separator className="opacity-50" />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={<Check className="w-4 h-4" />}
                label="Dived"
                active={status?.dived || false}
                onClick={() => toggleStatus(site.id, 'dived', status?.dived || false)}
                activeClass="bg-emerald-600 text-white border-emerald-600"
              />
              <ActionButton
                icon={<Heart className="w-4 h-4" />}
                label="Favorite"
                active={status?.favorite || false}
                onClick={() => toggleStatus(site.id, 'favorite', status?.favorite || false)}
                activeClass="bg-rose-500 text-white border-rose-500"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Notes
              </label>
              <Textarea
                value={localNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add your notes about this dive site..."
                className="min-h-[100px] resize-none text-sm"
              />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="p-3 rounded-lg bg-secondary/40 border border-border/50">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  activeClass?: string
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
  activeClass = 'bg-foreground text-background border-foreground',
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border transition-all',
        active ? activeClass : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
      )}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
