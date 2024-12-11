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
      venues: {
        Row: {
          id: string
          created_at: string
          name: string
          branding: Json
          policies: Json
          email?: string
          address: Json
          website?: string
          social_media: Json
          contact_info: Json
          amenities: Json
          faq: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          branding?: Json
          policies?: Json
          email?: string
          address?: Json
          website?: string
          social_media?: Json
          contact_info?: Json
          amenities?: Json
          faq?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          branding?: Json
          policies?: Json
          email?: string
          address?: Json
          website?: string
          social_media?: Json
          contact_info?: Json
          amenities?: Json
          faq?: Json
        }
      }
      vendor_categories: {
        Row: {
          id: string
          created_at: string
          venue_id: string
          name: string
          description?: string
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          venue_id: string
          name: string
          description?: string
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          venue_id?: string
          name?: string
          description?: string
          sort_order?: number
        }
      }
      vendors: {
        Row: {
          id: string
          created_at: string
          venue_id: string
          category_id: string
          business_name: string
          contact_name?: string
          email?: string
          phone?: string
          website?: string
          description?: string
          social_media: Json
          featured: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          venue_id: string
          category_id: string
          business_name: string
          contact_name?: string
          email?: string
          phone?: string
          website?: string
          description?: string
          social_media?: Json
          featured?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          venue_id?: string
          category_id?: string
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string
          website?: string
          description?: string
          social_media?: Json
          featured?: boolean
          sort_order?: number
        }
      }
      gallery_images: {
        Row: {
          id: string
          created_at: string
          venue_id: string
          url: string
          caption?: string
          alt_text?: string
          category?: string
          featured: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          venue_id: string
          url: string
          caption?: string
          alt_text?: string
          category?: string
          featured?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          venue_id?: string
          url?: string
          caption?: string
          alt_text?: string
          category?: string
          featured?: boolean
          sort_order?: number
        }
      }
    }
  }
}