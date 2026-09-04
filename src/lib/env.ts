const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const LEAD_TOKEN = (import.meta.env.VITE_LEAD_TOKEN as string | undefined);
export const LEAD_PATH = `/lead-${LEAD_TOKEN}`;

export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

export const SUPABASE_URL = url ?? "";
export const SUPABASE_ANON_KEY = anonKey ?? "";
