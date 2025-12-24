'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

export function AppBar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="h-12 shrink-0 border-b border-border/60 bg-card/95 backdrop-blur-sm z-[9999]">
      <div className="h-full px-3 md:px-4 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/map" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Joy The Diver</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5">
          <Link
            href="/map"
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              pathname === '/map'
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
          >
            Explore
          </Link>
          <Link
            href="/me"
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              pathname === '/me'
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
          >
            My Dives
          </Link>
        </nav>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none">
              <Avatar className="w-7 h-7 border border-border cursor-pointer hover:border-muted-foreground transition-colors">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'diver'}`} />
                <AvatarFallback>
                  <User className="w-3.5 h-3.5" />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 z-[9999]">
            {user && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive text-xs">
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

