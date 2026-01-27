import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage in Next.js, use ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side usage, you might want to use the service role key
// export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)