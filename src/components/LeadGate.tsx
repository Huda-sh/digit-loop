import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useLeadAuth } from "@/hooks/useLeadAuth";
import { LeadLoginPage } from "@/pages/LeadLoginPage";

export function LeadGate({ children }: { children: (ctx: { session: Session; onSignOut: () => void }) => ReactNode }) {
  const { loading, session, isLead, signInWithEmail, signOut } = useLeadAuth();

  if (loading) {
    return (
      <div className="lp-ink" style={{ minHeight: "100vh", background: "var(--ink-900)", display: "grid", placeItems: "center", color: "rgba(255,255,255,.5)", fontFamily: "var(--font-body)" }}>
        Checking access…
      </div>
    );
  }

  if (!session || !isLead) {
    return (
      <LeadLoginPage
        signInWithEmail={signInWithEmail}
        signedInNotLead={Boolean(session) && !isLead}
        onSignOut={() => void signOut()}
      />
    );
  }

  return <>{children({ session, onSignOut: () => void signOut() })}</>;
}
