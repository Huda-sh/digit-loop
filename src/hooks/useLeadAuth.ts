import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { checkIsLead } from "@/lib/api";
import { LEAD_PATH } from "@/lib/env";

interface LeadAuth {
  loading: boolean;
  session: Session | null;
  isLead: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useLeadAuth(): LeadAuth {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isLead, setIsLead] = useState(false);

  const refreshRole = useCallback(async (s: Session | null) => {
    if (!s) {
      setIsLead(false);
      return;
    }
    setIsLead(await checkIsLead());
  }, []);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      await refreshRole(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      await refreshRole(s);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [refreshRole]);

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}${LEAD_PATH}` },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { loading, session, isLead, signInWithEmail, signOut };
}
