const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

let clientInstance = null;

export async function getSupabase() {
    if (!clientInstance) {
        const { createClient } = await import('@supabase/supabase-js');
        clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return clientInstance;
}