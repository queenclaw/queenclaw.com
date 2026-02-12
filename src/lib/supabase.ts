import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// 类型定义（向后兼容）
export type User = {
  id: string
  wallet_address: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  content: string
  image_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
  user?: User
}

export type Bot = {
  id: string
  name: string
  wallet: string
  avatar: string | null
  description: string | null
  skills: string[]
  total_payout: number
  countries: number
  rank: number
  rating: number
  active_users: number
  badges: string[]
  created_at: string
}
