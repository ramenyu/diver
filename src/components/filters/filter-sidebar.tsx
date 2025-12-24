'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, RotateCcw, Search, ChevronDown, ChevronRight,
  CheckCircle2, Heart, MapPin, PanelLeftClose, PanelLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useAppStore, useFilteredSites, useDivedSites, useFavoriteSites } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Difficulty } from '@/lib/types/database'

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']
const TYPES = ['reef', 'wreck', 'macro', 'cave', 'wall', 'cenote', 'muck diving']
const DEFAULT_VISIBLE_REGIONS = 12

interface FilterSidebarProps {
  className?: string
  onClose?: () => void
  showCloseButton?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function FilterSidebar({ 
  className, 
  onClose, 
  showCloseButton,
  collapsed = false,
  onToggleCollapse 
}: FilterSidebarProps) {
  const router = useRouter()
  const sites = useAppStore((s) => s.sites)
  const filters = useAppStore((s) => s.filters)
  const setFilters = useAppStore((s) => s.setFilters)
  const clearFilters = useAppStore((s) => s.clearFilters)
  const filteredSites = useFilteredSites()
  
  // User status counts
  const divedSites = useDivedSites()
  const favoriteSites = useFavoriteSites()

  const [regionSearch, setRegionSearch] = useState('')
  const [showAllRegions, setShowAllRegions] = useState(false)
  
  // Collapsible section states
  const [regionOpen, setRegionOpen] = useState(true)
  const [difficultyOpen, setDifficultyOpen] = useState(true)
  const [typeOpen, setTypeOpen] = useState(true)

  const hasActiveFilters = Object.values(filters).some((v) => v !== null)

  // Get regions sorted by site count
  const regionsByCount = useMemo(() => {
    const countMap = new Map<string, number>()
    for (const site of sites) {
      if (site.country) {
        countMap.set(site.country, (countMap.get(site.country) || 0) + 1)
      }
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([region, count]) => ({ region, count }))
  }, [sites])

  // Filter regions by search
  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return regionsByCount
    const search = regionSearch.toLowerCase()
    return regionsByCount.filter(({ region }) => 
      region.toLowerCase().includes(search)
    )
  }, [regionsByCount, regionSearch])

  // Determine which regions to show
  const visibleRegions = useMemo(() => {
    if (regionSearch.trim() || showAllRegions) {
      return filteredRegions
    }
    return filteredRegions.slice(0, DEFAULT_VISIBLE_REGIONS)
  }, [filteredRegions, showAllRegions, regionSearch])

  const hasMoreRegions = filteredRegions.length > DEFAULT_VISIBLE_REGIONS && !regionSearch.trim()

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  }

  // Collapsed sidebar - icon rail
  if (collapsed) {
    return (
      <aside className={cn('flex flex-col bg-card h-full w-14 border-r border-border/50', className)}>
        <div className="p-2 flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
            title="Expand sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        </div>
        <Separator className="opacity-50" />
        <div className="flex-1 p-2 flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={`${filteredSites.length} sites`}
          >
            <MapPin className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/me?tab=dived')}
            className="h-8 w-8 p-0 relative"
            title={`${divedSites.length} logged`}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {divedSites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {divedSites.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/me?tab=favorites')}
            className="h-8 w-8 p-0 relative"
            title={`${favoriteSites.length} favorites`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            {favoriteSites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-rose-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {favoriteSites.length}
              </span>
            )}
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn('flex flex-col bg-card h-full overflow-hidden', className)}>
      {/* Header with status counts */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Filters</h2>
            <span className="text-[11px] text-muted-foreground/70">
              {filteredSites.length} sites
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-1.5 text-[10px] text-muted-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-0.5" />
                Clear
              </Button>
            )}
            {onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleCollapse} 
                className="h-6 w-6 p-0"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </Button>
            )}
            {showCloseButton && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Status counts - clickable */}
        <div className="flex gap-1">
          <button
            onClick={() => router.push('/me?tab=dived')}
            className="flex-1 flex items-center gap-1 px-2 py-1.5 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
          >
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-[11px] font-medium text-green-700">{divedSites.length}</span>
          </button>
          <button
            onClick={() => router.push('/me?tab=favorites')}
            className="flex-1 flex items-center gap-1 px-2 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <Heart className="w-3 h-3 text-rose-500" />
            <span className="text-[11px] font-medium text-rose-700">{favoriteSites.length}</span>
          </button>
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="px-3 pb-2">
          <div className="flex flex-wrap gap-1">
            {filters.region && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive text-[10px] h-5 px-1.5"
                onClick={() => setFilters({ region: null })}
              >
                {filters.region}
                <X className="w-2.5 h-2.5 ml-0.5" />
              </Badge>
            )}
            {filters.difficulty && (
              <Badge 
                variant="secondary"
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive text-[10px] h-5 px-1.5"
                onClick={() => setFilters({ difficulty: null })}
              >
                {difficultyLabels[filters.difficulty]}
                <X className="w-2.5 h-2.5 ml-0.5" />
              </Badge>
            )}
            {filters.type && (
              <Badge 
                variant="secondary"
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive text-[10px] h-5 px-1.5"
                onClick={() => setFilters({ type: null })}
              >
                {filters.type}
                <X className="w-2.5 h-2.5 ml-0.5" />
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator className="opacity-40" />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-1">
          {/* Region Filter - Collapsible */}
          <Collapsible open={regionOpen} onOpenChange={setRegionOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 hover:bg-muted/50 rounded-md px-1 -mx-1">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Region
              </h3>
              {regionOpen ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1.5 space-y-2">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-7 pl-7 text-[10px]"
                />
              </div>
              
              {/* Region Chips - 2 column grid */}
              <div className="grid grid-cols-2 gap-1">
                {visibleRegions.map(({ region, count }) => (
                  <FilterChip
                    key={region}
                    label={region}
                    count={count}
                    active={filters.region === region}
                    onClick={() => setFilters({ region: filters.region === region ? null : region })}
                  />
                ))}
              </div>

              {/* Show More/Less Toggle */}
              {hasMoreRegions && (
                <button
                  onClick={() => setShowAllRegions(!showAllRegions)}
                  className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAllRegions ? (
                    <>
                      <ChevronDown className="w-3 h-3 rotate-180" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      {filteredRegions.length - DEFAULT_VISIBLE_REGIONS} more
                    </>
                  )}
                </button>
              )}

              {/* No results */}
              {filteredRegions.length === 0 && regionSearch.trim() && (
                <p className="text-[10px] text-muted-foreground">No regions found</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="opacity-40 my-2" />

          {/* Difficulty Filter - Collapsible */}
          <Collapsible open={difficultyOpen} onOpenChange={setDifficultyOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 hover:bg-muted/50 rounded-md px-1 -mx-1">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Difficulty
              </h3>
              {difficultyOpen ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1.5">
              <div className="flex flex-wrap gap-1">
                {DIFFICULTIES.map((difficulty) => (
                  <FilterChip
                    key={difficulty}
                    label={difficultyLabels[difficulty]}
                    active={filters.difficulty === difficulty}
                    onClick={() =>
                      setFilters({ difficulty: filters.difficulty === difficulty ? null : difficulty })
                    }
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="opacity-40 my-2" />

          {/* Type Filter - Collapsible */}
          <Collapsible open={typeOpen} onOpenChange={setTypeOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 hover:bg-muted/50 rounded-md px-1 -mx-1">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </h3>
              {typeOpen ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1.5">
              <div className="flex flex-wrap gap-1">
                {TYPES.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    active={filters.type === type}
                    onClick={() => setFilters({ type: filters.type === type ? null : type })}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  )
}

interface FilterChipProps {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}

function FilterChip({ label, count, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors',
        'border capitalize flex items-center gap-0.5 truncate',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground'
      )}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className={cn(
          'text-[9px] shrink-0',
          active ? 'text-background/70' : 'text-muted-foreground/60'
        )}>
          {count}
        </span>
      )}
    </button>
  )
}
