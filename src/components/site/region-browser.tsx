'use client'

import { MapPin, ChevronRight, ChevronLeft, X, Check, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore, useDestinationGroups, type DestinationGroup } from '@/lib/store'
import { useSiteStatus } from '@/lib/hooks/use-sites'
import type { SiteWithStatus } from '@/lib/types/database'
import { cn } from '@/lib/utils'

// Extract highlight tags from spots
function getHighlightTags(spots: SiteWithStatus[]): string[] {
  const tagCounts = new Map<string, number>()
  const priorityTags = ['sharks', 'manta rays', 'whale sharks', 'turtles', 'wreck', 'cave', 'macro', 'reef', 'wall', 'cenote']
  
  for (const spot of spots) {
    for (const tag of spot.tags || []) {
      const lower = tag.toLowerCase()
      tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1)
    }
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
  
  return sorted.slice(0, 4)
}

interface RegionBrowserProps {
  className?: string
}

export function RegionBrowser({ className }: RegionBrowserProps) {
  const destinationGroups = useDestinationGroups()
  const filters = useAppStore((s) => s.filters)
  const expandedDestination = useAppStore((s) => s.expandedDestination)
  const setExpandedDestination = useAppStore((s) => s.setExpandedDestination)
  const selectDestination = useAppStore((s) => s.selectDestination)
  const isPanelCollapsed = useAppStore((s) => s.isPanelCollapsed)
  const togglePanelCollapsed = useAppStore((s) => s.togglePanelCollapsed)
  const clearFilters = useAppStore((s) => s.clearFilters)

  if (!filters.region) return null

  const totalSites = destinationGroups.reduce((acc, g) => acc + g.spots.length, 0)

  // Collapsed state
  if (isPanelCollapsed) {
    return (
      <aside className={cn('w-10 flex flex-col bg-card border-l border-border', className)}>
        <button
          onClick={togglePanelCollapsed}
          className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span 
            className="text-xs font-medium text-foreground"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {filters.region}
          </span>
        </button>
      </aside>
    )
  }

  return (
    <aside className={cn('w-[380px] flex flex-col bg-card border-l border-border', className)}>
      {/* Header */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm">{filters.region}</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {totalSites} site{totalSites !== 1 ? 's' : ''} · {destinationGroups.length} destination{destinationGroups.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePanelCollapsed} 
              className="h-7 w-7"
              title="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearFilters} 
              className="h-7 w-7"
              title="Clear region filter"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {destinationGroups.map((group) => (
            <DestinationRow
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
    </aside>
  )
}

interface DestinationRowProps {
  group: DestinationGroup
  isExpanded: boolean
  onToggle: () => void
}

function DestinationRow({ group, isExpanded, onToggle }: DestinationRowProps) {
  const highlights = getHighlightTags(group.spots)
  const previewSpots = group.spots.slice(0, 3)
  const remainingCount = group.spots.length - 3

  return (
    <div className={cn(
      'rounded-lg border transition-all duration-150',
      isExpanded 
        ? 'border-border bg-secondary/30' 
        : 'border-transparent hover:border-border hover:bg-secondary/20'
    )}>
      {/* Destination Header */}
      <button
        onClick={onToggle}
        className="w-full p-2.5 flex items-start gap-2.5 text-left"
      >
        {/* Placeholder thumbnail */}
        <div className="w-9 h-9 rounded-md bg-secondary/60 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-xs">{group.destination}</span>
            <span className="text-[10px] text-muted-foreground">{group.spots.length}</span>
          </div>
          
          {/* Spot preview */}
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {previewSpots.map(s => s.name).join(', ')}
            {remainingCount > 0 && ` +${remainingCount} more`}
          </p>
          
          {/* Highlight tags */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {highlights.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[10px] leading-3 px-1.5 py-0 h-4 font-normal capitalize bg-secondary/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <ChevronRight className={cn(
          'w-3.5 h-3.5 text-muted-foreground transition-transform flex-shrink-0 mt-0.5',
          isExpanded && 'rotate-90'
        )} />
      </button>

      {/* Spots List */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-0.5">
          {group.spots.map((spot) => (
            <SpotRow key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  )
}

interface SpotRowProps {
  spot: SiteWithStatus
}

function SpotRow({ spot }: SpotRowProps) {
  const setSelectedSite = useAppStore((s) => s.setSelectedSite)
  const { toggleStatus } = useSiteStatus()

  const status = spot.status

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-background transition-colors group">
      {/* Spot name */}
      <button
        onClick={() => setSelectedSite(spot.id)}
        className="flex-1 min-w-0 text-left"
      >
        <span className="text-xs font-medium truncate block group-hover:text-primary transition-colors">
          {spot.name}
        </span>
        {spot.depth_max && (
          <span className="text-[10px] text-muted-foreground">{spot.depth_max}m</span>
        )}
      </button>

      {/* Quick Actions */}
      <div className="flex items-center gap-0 opacity-50 group-hover:opacity-100 transition-opacity">
        <QuickActionButton
          icon={<Check className="w-3 h-3" />}
          active={status?.dived || false}
          onClick={() => toggleStatus(spot.id, 'dived', status?.dived || false)}
          activeClass="text-emerald-600"
        />
        <QuickActionButton
          icon={<Heart className="w-3 h-3" />}
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
        active 
          ? activeClass 
          : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/50'
      )}
    >
      {icon}
    </button>
  )
}
