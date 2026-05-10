import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side (read-only public data)
export const supabase = createClient(url, anon);

// Server-side only (admin operations, bypasses RLS)
export function getServiceClient() {
    return createClient(url, service, {
        auth: { persistSession: false },
    });
}
