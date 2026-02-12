export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          wallet_address: string;
          followers_count: number;
          following_count: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          wallet_address: string;
          followers_count?: number;
          following_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          wallet_address?: string;
          followers_count?: number;
          following_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          likes_count: number;
          comments_count: number;
          has_ai: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          likes_count?: number;
          comments_count?: number;
          has_ai?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          author_id?: string;
          likes_count?: number;
          comments_count?: number;
          has_ai?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bots: {
        Row: {
          id: string;
          name: string;
          description: string;
          owner_id: string;
          avatar: string;
          total_payout: number;
          payout_count: number;
          tasks_completed: number;
          uptime_percentage: number;
          efficiency_score: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          owner_id: string;
          avatar?: string;
          total_payout?: number;
          payout_count?: number;
          tasks_completed?: number;
          uptime_percentage?: number;
          efficiency_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          owner_id?: string;
          avatar?: string;
          total_payout?: number;
          payout_count?: number;
          tasks_completed?: number;
          uptime_percentage?: number;
          efficiency_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          description: string;
          provider_name: string;
          provider_avatar: string;
          provider_id: string;
          price: string;
          price_amount: number;
          rating: number;
          reviews_count: number;
          downloads_count: number;
          tags: string[];
          trending: boolean;
          featured: boolean;
          category_id: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          provider_name: string;
          provider_avatar?: string;
          provider_id: string;
          price?: string;
          price_amount?: number;
          rating?: number;
          reviews_count?: number;
          downloads_count?: number;
          tags?: string[];
          trending?: boolean;
          featured?: boolean;
          category_id: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          provider_name?: string;
          provider_avatar?: string;
          provider_id?: string;
          price?: string;
          price_amount?: number;
          rating?: number;
          reviews_count?: number;
          downloads_count?: number;
          tags?: string[];
          trending?: boolean;
          featured?: boolean;
          category_id?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skill_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string;
          description?: string;
          created_at?: string;
        };
      };
      forum_topics: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          category: string;
          views_count: number;
          replies_count: number;
          likes_count: number;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          category: string;
          views_count?: number;
          replies_count?: number;
          likes_count?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          category?: string;
          views_count?: number;
          replies_count?: number;
          likes_count?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          topic_id: string;
          content: string;
          author_id: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          content: string;
          author_id: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          content?: string;
          author_id?: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
      };
      ecosystem_stats: {
        Row: {
          id: string;
          stat_name: string;
          stat_value: number;
          stat_label: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stat_name: string;
          stat_value: number;
          stat_label: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stat_name?: string;
          stat_value?: number;
          stat_label?: string;
          updated_at?: string;
        };
      };
      agent_stats: {
        Row: {
          id: string;
          agent_id: string;
          tasks_completed: number;
          uptime_percentage: number;
          efficiency_score: number;
          earnings_total: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          tasks_completed?: number;
          uptime_percentage?: number;
          efficiency_score?: number;
          earnings_total?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          tasks_completed?: number;
          uptime_percentage?: number;
          efficiency_score?: number;
          earnings_total?: number;
          updated_at?: string;
        };
      };
      skill_usage_stats: {
        Row: {
          id: string;
          skill_id: string;
          usage_count: number;
          trend_direction: 'up' | 'down' | 'stable';
          trend_percentage: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          usage_count?: number;
          trend_direction?: 'up' | 'down' | 'stable';
          trend_percentage?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          usage_count?: number;
          trend_direction?: 'up' | 'down' | 'stable';
          trend_percentage?: number;
          updated_at?: string;
        };
      };
      network_status: {
        Row: {
          id: string;
          region: string;
          region_code: string;
          status: 'online' | 'maintenance' | 'offline';
          latency_ms: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region: string;
          region_code: string;
          status: 'online' | 'maintenance' | 'offline';
          latency_ms?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          region?: string;
          region_code?: string;
          status?: 'online' | 'maintenance' | 'offline';
          latency_ms?: number;
          updated_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          activity_type: string;
          actor_name: string;
          actor_avatar: string;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_type: string;
          actor_name: string;
          actor_avatar?: string;
          description: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_type?: string;
          actor_name?: string;
          actor_avatar?: string;
          description?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
