'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, MapPin, Calendar, ArrowDown, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore, useSelectedSite } from '@/lib/store'
import { useSiteStatus } from '@/lib/hooks/use-sites'
import { useDebouncedCallback } from '@/lib/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface SiteDetailPanelProps {
  className?: string
}

export function SiteDetailPanel({ className }: SiteDetailPanelProps) {
  const site = useSelectedSite()
  const isPanelCollapsed = useAppStore((s) => s.isPanelCollapsed)
  const togglePanelCollapsed = useAppStore((s) => s.togglePanelCollapsed)
  const setSiteDetailOpen = useAppStore((s) => s.setSiteDetailOpen)
  const { toggleStatus, updateNotes } = useSiteStatus()
  
  const [localNotes, setLocalNotes] = useState('')

  // Sync local notes with site status
  useEffect(() => {
    setLocalNotes(site?.status?.notes || '')
  }, [site?.id, site?.status?.notes])

  // Debounced notes update
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

  const handleNotesBlur = () => {
    if (site && localNotes !== site.status?.notes) {
      updateNotes(site.id, localNotes)
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
            className="text-xs font-medium text-foreground writing-mode-vertical"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {site.name}
          </span>
        </button>
      </aside>
    )
  }

  return (
    <aside className={cn('w-[380px] flex flex-col bg-card border-l border-border', className)}>
      {/* Header */}
      <div className="p-3 flex items-start justify-between border-b border-border/50">
        <div className="flex-1 min-w-0 pr-2">
          <h2 className="font-semibold text-sm truncate">{site.name}</h2>
          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] truncate">{site.destination || site.country}</span>
          </div>
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
            onClick={() => setSiteDetailOpen(false)} 
            className="h-7 w-7"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {site.difficulty && (
              <Badge variant="secondary" className={cn(difficultyColors[site.difficulty], "text-[10px] h-[18px] px-1.5 font-medium")}>
                {site.difficulty}
              </Badge>
            )}
            {site.tags?.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize text-[10px] h-[18px] px-1.5 font-medium">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {site.best_season && (
              <InfoCard
                icon={<Calendar className="w-3.5 h-3.5 text-muted-foreground" />}
                label="Best Season"
                value={site.best_season}
              />
            )}
            {(site.depth_min || site.depth_max) && (
              <InfoCard
                icon={<ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />}
                label="Depth Range"
                value={`${site.depth_min || '?'}-${site.depth_max || '?'}m`}
              />
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <ActionButton
              icon={<Check className="w-3.5 h-3.5" />}
              label="Dived"
              active={status?.dived || false}
              onClick={() => toggleStatus(site.id, 'dived', status?.dived || false)}
              activeClass="bg-emerald-600 text-white border-emerald-600"
            />
            <ActionButton
              icon={<Heart className="w-3.5 h-3.5" />}
              label="Favorite"
              active={status?.favorite || false}
              onClick={() => toggleStatus(site.id, 'favorite', status?.favorite || false)}
              activeClass="bg-rose-500 text-white border-rose-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Notes
            </label>
            <Textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add your notes about this dive site..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>
        </div>
      </ScrollArea>
    </aside>
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
    <div className="p-2 rounded-lg bg-secondary/40 border border-border/50">
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xs font-medium">{value}</p>
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
        'flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg border transition-all',
        active ? activeClass : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

