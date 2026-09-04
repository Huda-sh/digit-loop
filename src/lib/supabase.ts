import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_CONFIGURED, SUPABASE_URL } from "./env";

/**
 * A single browser client. Anonymous visitors use the anon key directly;
 * the lead signs in with a magic link and the session is persisted here.
 */
export const supabase = createClient(
  SUPABASE_URL || "http://localhost.invalid",
  SUPABASE_ANON_KEY || "public-anon-key-not-set",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export { SUPABASE_CONFIGURED };
