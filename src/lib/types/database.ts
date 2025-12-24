export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string
          name: string
          destination: string | null
          country: string | null
          lat: number
          lng: number
          difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          depth_min: number | null
          depth_max: number | null
          best_season: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          destination?: string | null
          country?: string | null
          lat: number
          lng: number
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          depth_min?: number | null
          depth_max?: number | null
          best_season?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          destination?: string | null
          country?: string | null
          lat?: number
          lng?: number
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          depth_min?: number | null
          depth_max?: number | null
          best_season?: string | null
          tags?: string[]
          created_at?: string
        }
      }
      user_site_status: {
        Row: {
          user_id: string
          site_id: string
          want: boolean
          dived: boolean
          favorite: boolean
          notes: string | null
          date_dived: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          site_id: string
          want?: boolean
          dived?: boolean
          favorite?: boolean
          notes?: string | null
          date_dived?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          site_id?: string
          want?: boolean
          dived?: boolean
          favorite?: boolean
          notes?: string | null
          date_dived?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Site = Database['public']['Tables']['sites']['Row']
export type SiteInsert = Database['public']['Tables']['sites']['Insert']
export type UserSiteStatus = Database['public']['Tables']['user_site_status']['Row']
export type UserSiteStatusInsert = Database['public']['Tables']['user_site_status']['Insert']
export type UserSiteStatusUpdate = Database['public']['Tables']['user_site_status']['Update']

// Combined type for UI
export interface SiteWithStatus extends Site {
  status?: UserSiteStatus | null
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

