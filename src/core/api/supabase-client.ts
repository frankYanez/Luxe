import { createClient } from '@supabase/supabase-js';

export function getServiceClient() {
    const url     = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !service) throw new Error('Missing Supabase env vars');
    return createClient(url, service, { auth: { persistSession: false } });
}

export function getPublicClient() {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) throw new Error('Missing Supabase env vars');
    return createClient(url, anon);
}

// Named alias kept for any client-side usage
export const supabase = {
    get client() { return getPublicClient(); },
};
