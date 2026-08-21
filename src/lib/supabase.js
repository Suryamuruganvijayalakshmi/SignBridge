import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co'
const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X'

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)