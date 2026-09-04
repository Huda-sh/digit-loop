import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FeedPage } from "@/pages/FeedPage";
import { LeadPage } from "@/pages/LeadPage";
import { LeadNotePage } from "@/pages/LeadNotePage";
import { LeadGate } from "@/components/LeadGate";
import { LEAD_PATH } from "@/lib/env";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route
          path={LEAD_PATH}
          element={<LeadGate>{({ session, onSignOut }) => <LeadPage session={session} onSignOut={onSignOut} />}</LeadGate>}
        />
        <Route
          path={`${LEAD_PATH}/n/:id`}
          element={<LeadGate>{({ session, onSignOut }) => <LeadNotePage session={session} onSignOut={onSignOut} />}</LeadGate>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
