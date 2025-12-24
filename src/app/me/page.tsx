'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Heart, MapPin, ChevronRight, Compass, LayoutGrid, List, Calendar, ArrowDown, Map } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { AppBar } from '@/components/layout/app-bar'
import { useAppStore, useDivedSites, useFavoriteSites } from '@/lib/store'
import { useSites } from '@/lib/hooks/use-sites'
import type { SiteWithStatus } from '@/lib/types/database'
import { cn } from '@/lib/utils'

export default function MePage() {
  const router = useRouter()
  const sites = useAppStore((s) => s.sites)
  const setSelectedSite = useAppStore((s) => s.setSelectedSite)
  const divedSites = useDivedSites()
  const favoriteSites = useFavoriteSites()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Load sites from Supabase
  useSites()

  const handleSiteClick = (siteId: string) => {
    setSelectedSite(siteId)
    router.push('/map')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppBar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold">My Dive Journal</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your underwater adventures
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <StatCard
                icon={<Check className="w-4 h-4" />}
                value={divedSites.length}
                label="Logged Dives"
                accent="emerald"
              />
              <StatCard
                icon={<Heart className="w-4 h-4" />}
                value={favoriteSites.length}
                label="Favorites"
                accent="rose"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <Tabs defaultValue="dived" className="flex-1 flex flex-col">
            <div className="border-b border-border px-4 md:px-6 lg:px-8 flex items-center justify-between">
              <TabsList className="bg-transparent h-11 p-0 gap-6 border-none">
                <TabsTrigger
                  value="dived"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 pt-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent data-[state=active]:focus-visible:border-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Dived ({divedSites.length})
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 pt-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent data-[state=active]:focus-visible:border-foreground"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites ({favoriteSites.length})
                </TabsTrigger>
              </TabsList>

              {/* View Toggle */}
              <div className="flex items-center gap-0.5 bg-secondary/50 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="dived" className="mt-0 p-4 md:p-6 lg:p-8">
                <SiteCollection 
                  sites={divedSites} 
                  emptyMessage="No logged dives yet"
                  onSiteClick={handleSiteClick}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="favorites" className="mt-0 p-4 md:p-6 lg:p-8">
                <SiteCollection 
                  sites={favoriteSites} 
                  emptyMessage="No favorite sites yet"
                  onSiteClick={handleSiteClick}
                  viewMode={viewMode}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  accent?: 'emerald' | 'rose'
}

function StatCard({ icon, value, label, accent }: StatCardProps) {
  const accentClasses = {
    emerald: 'text-emerald-600',
    rose: 'text-rose-500',
  }

  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className={cn(
          'w-8 h-8 rounded-md bg-secondary/60 flex items-center justify-center mb-3',
          accent && accentClasses[accent]
        )}>
          {icon}
        </div>
        <div className={cn(
          'text-2xl font-semibold tabular-nums',
          accent && accentClasses[accent]
        )}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  )
}

interface SiteCollectionProps {
  sites: SiteWithStatus[]
  emptyMessage: string
  onSiteClick: (siteId: string) => void
  viewMode: 'list' | 'grid'
}

function SiteCollection({ sites, emptyMessage, onSiteClick, viewMode }: SiteCollectionProps) {
  if (sites.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">{emptyMessage}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/map">
            Explore dive sites
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} onClick={() => onSiteClick(site.id)} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sites.map((site) => (
        <SiteRow key={site.id} site={site} onClick={() => onSiteClick(site.id)} />
      ))}
    </div>
  )
}

// Grid view card - minimal style
function SiteCard({ site, onClick }: { site: SiteWithStatus; onClick: () => void }) {
  const tags = site.tags || []

  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-shadow border-border/60"
      onClick={onClick}
    >
      {/* Subtle placeholder header */}
      <div className="h-20 bg-secondary/30 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-muted-foreground/30" />
        </div>
        
        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {site.status?.favorite && (
            <span className="w-5 h-5 rounded-full bg-background/90 flex items-center justify-center shadow-sm">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          )}
          {site.status?.dived && (
            <span className="w-5 h-5 rounded-full bg-background/90 flex items-center justify-center shadow-sm">
              <Check className="w-3 h-3 text-emerald-600" />
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
          {site.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs truncate">{site.destination || site.country}</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// List view row
function SiteRow({ site, onClick }: { site: SiteWithStatus; onClick: () => void }) {
  const tags = site.tags || []

  const difficultyColors: Record<string, string> = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-orange-600',
    expert: 'text-red-600',
  }

  return (
    <Card 
      className="hover:bg-secondary/30 transition-colors cursor-pointer border-border/60"
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center gap-3">
        {/* Icon placeholder */}
        <div className="w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-sm truncate">{site.name}</h3>
            {site.difficulty && (
              <span className={cn('text-[10px] capitalize', difficultyColors[site.difficulty])}>
                · {site.difficulty}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs truncate">{site.destination || site.country}</span>
            </div>
            {tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-1">
          {site.status?.dived && (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          )}
          {site.status?.favorite && (
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          )}
        </div>

        <Button variant="ghost" size="sm" className="h-8 px-2 flex-shrink-0">
          <Map className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
