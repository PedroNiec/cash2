// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Pegue esses valores no seu projeto Supabase (Settings → API)
const NEXT_PUBLIC_SUPABASE_URL=  'https://ytiyrfliszifyuhghiqg.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY=  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'


export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
