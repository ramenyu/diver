'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not configured, use demo mode
    if (!isSupabaseConfigured()) {
      setUser({
        id: 'demo-user',
        email: 'demo@dive-atlas.app',
      } as User)
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      window.location.href = '/login'
      return
    }

    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    window.location.href = '/login'
  }, [])

  return { user, isLoading, signOut, isConfigured: isSupabaseConfigured() }
}
