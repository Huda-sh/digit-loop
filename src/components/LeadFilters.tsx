import { Icon } from "@/ds";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";

export interface FilterState {
  q: string;
  category: string; // "all" | Category
  visibility: string; // "all" | Visibility
  range: string; // "7" | "30" | "90" | "all"
}

export const DEFAULT_FILTERS: FilterState = { q: "", category: "all", visibility: "all", range: "30" };

const selStyle: React.CSSProperties = {
  appearance: "none",
  height: 44,
  padding: "0 34px 0 14px",
  borderRadius: "var(--radius-md)",
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.16)",
  color: "rgba(255,255,255,.82)",
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  cursor: "pointer",
  outline: "none",
};

function Select({
  value,
  onChange,
  children,
  active,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...selStyle,
          ...(active
            ? { background: "rgba(255,197,51,.12)", border: "1px solid rgba(255,197,51,.5)", color: "var(--gold-500)" }
            : null),
        }}
      >
        {children}
      </select>
      <Icon
        name="chevronDown"
        size={15}
        strokeWidth={2}
        style={{ position: "absolute", right: 12, pointerEvents: "none", color: "currentColor", opacity: 0.7 }}
      />
    </span>
  );
}

export function LeadFilters({
  value,
  onChange,
  onExport,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onExport: () => void;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          height: 44,
          padding: "0 14px",
          borderRadius: "var(--radius-md)",
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(255,255,255,.16)",
          minWidth: 260,
          flex: "1 1 260px",
          color: "rgba(255,255,255,.5)",
        }}
      >
        <Icon name="search" size={17} />
        <input
          value={value.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search all feedback"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            fontSize: 14.5,
            color: "var(--white)",
          }}
        />
      </span>

      <Select value={value.category} onChange={(v) => set({ category: v })}>
        <option value="all">All categories</option>
        {CATEGORY_ORDER.map((k) => (
          <option key={k} value={k}>
            {CATEGORIES[k].label}
          </option>
        ))}
      </Select>

      <Select value={value.visibility} onChange={(v) => set({ visibility: v })} active={value.visibility === "private"}>
        <option value="all">All visibility</option>
        <option value="public">Public only</option>
        <option value="anonymous">Anonymous only</option>
        <option value="private">Private only</option>
      </Select>

      <Select value={value.range} onChange={(v) => set({ range: v })}>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="all">All time</option>
      </Select>

      <div style={{ flex: 1 }} />
      <button
        onClick={onExport}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 44,
          padding: "0 18px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid transparent",
          background: "var(--white)",
          color: "var(--ink-900)",
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Icon name="download" size={17} strokeWidth={2} />
        Export CSV
      </button>
    </div>
  );
}
