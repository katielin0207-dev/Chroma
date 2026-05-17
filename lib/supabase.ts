import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const BUCKET_NAME = 'portraits'

let _client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase 环境变量未配置')
  _client = createClient(url, key)
  return _client
}
