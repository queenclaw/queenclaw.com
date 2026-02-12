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
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          subscription_tier: string
          created_at: string
          updated_at: string
          followers_count?: number
          following_count?: number
          display_name?: string | null
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
          followers_count?: number
          following_count?: number
          display_name?: string | null
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
          followers_count?: number
          following_count?: number
          display_name?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: string[] | null
          likes_count: number
          comments_count: number
          has_ai: boolean
          created_at: string
          updated_at: string
          author?: {
            username: string
            avatar_url?: string
            wallet_address?: string
          }
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: string[] | null
          likes_count?: number
          comments_count?: number
          has_ai?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: string[] | null
          likes_count?: number
          comments_count?: number
          has_ai?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      bots: {
        Row: {
          id: string
          name: string
          description: string | null
          creator_id: string | null
          total_payout: number
          payout_count: number
          avatar_url: string | null
          category: string | null
          capabilities: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          creator_id?: string | null
          total_payout?: number
          payout_count?: number
          avatar_url?: string | null
          category?: string | null
          capabilities?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          creator_id?: string | null
          total_payout?: number
          payout_count?: number
          avatar_url?: string | null
          category?: string | null
          capabilities?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bot_tasks: {
        Row: {
          id: string
          bot_id: string
          task_type: string
          description: string
          status: string
          payout_amount: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          bot_id: string
          task_type: string
          description: string
          status?: string
          payout_amount?: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          bot_id?: string
          task_type?: string
          description?: string
          status?: string
          payout_amount?: number
          created_at?: string
          completed_at?: string | null
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          description: string
          provider_name: string
          provider_avatar: string
          price: string
          price_amount: number
          rating: number
          reviews_count: number
          downloads_count: number
          tags: string[]
          trending: boolean
          featured: boolean
          category_id: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          provider_name: string
          provider_avatar?: string
          price?: string
          price_amount?: number
          rating?: number
          reviews_count?: number
          downloads_count?: number
          tags?: string[]
          trending?: boolean
          featured?: boolean
          category_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          provider_name?: string
          provider_avatar?: string
          price?: string
          price_amount?: number
          rating?: number
          reviews_count?: number
          downloads_count?: number
          tags?: string[]
          trending?: boolean
          featured?: boolean
          category_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skill_categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          description: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string
          description?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string
          description?: string
        }
      }
      skill_reviews: {
        Row: {
          id: string
          skill_id: string
          user_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          skill_id: string
          user_id: string
          rating: number
          comment?: string
          created_at?: string
        }
        Update: {
          id?: string
          skill_id?: string
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      forum_categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          description: string
          color: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string
          description?: string
          color?: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string
          description?: string
          color?: string
          sort_order?: number
        }
      }
      forum_topics: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category_id: string
          views_count: number
          likes_count: number
          comments_count: number
          pinned: boolean
          solved: boolean
          locked: boolean
          tags: string[]
          created_at: string
          last_activity_at: string
          author?: {
            username: string
            avatar_url?: string
          }
          category?: {
            name: string
            slug: string
            color: string
          }
          user_liked?: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category_id: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          pinned?: boolean
          solved?: boolean
          locked?: boolean
          tags?: string[]
          created_at?: string
          last_activity_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category_id?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          pinned?: boolean
          solved?: boolean
          locked?: boolean
          tags?: string[]
          created_at?: string
          last_activity_at?: string
        }
      }
      forum_topic_likes: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          created_at?: string
        }
      }
      forum_comments: {
        Row: {
          id: string
          topic_id: string
          author_id: string
          content: string
          likes_count: number
          is_solution: boolean
          created_at: string
          updated_at: string
          author?: {
            username: string
            avatar_url?: string
          }
        }
        Insert: {
          id?: string
          topic_id: string
          author_id: string
          content: string
          likes_count?: number
          is_solution?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          author_id?: string
          content?: string
          likes_count?: number
          is_solution?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          read?: boolean
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          language: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          language?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          language?: string
          theme?: string
          created_at?: string
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
