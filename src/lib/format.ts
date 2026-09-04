import type { AdminPost } from "./types";

/** "2 hours ago", "Yesterday", "3 days ago", "4 Sep 2026" */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;

  if (diff < min) return "Just now";
  if (diff < hour) {
    const n = Math.round(diff / min);
    return `${n} minute${n === 1 ? "" : "s"} ago`;
  }
  if (diff < day) {
    const n = Math.round(diff / hour);
    return `${n} hour${n === 1 ? "" : "s"} ago`;
  }
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) {
    const n = Math.round(diff / day);
    return `${n} days ago`;
  }
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "4 Sep 2026, 09:14" */
export function fullTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Median of (followed_up_at - created_at) across replied notes, in days. */
export function medianReplyDays(posts: AdminPost[]): number | null {
  const spans = posts
    .filter((p) => p.followed_up_at)
    .map((p) => new Date(p.followed_up_at!).getTime() - new Date(p.created_at).getTime())
    .filter((ms) => ms >= 0)
    .sort((a, b) => a - b);
  if (spans.length === 0) return null;
  const mid = Math.floor(spans.length / 2);
  const ms = spans.length % 2 ? spans[mid] : (spans[mid - 1] + spans[mid]) / 2;
  return ms / (1000 * 60 * 60 * 24);
}

export function initialOf(name: string | null | undefined): string {
  const t = (name ?? "").trim();
  return t ? t.charAt(0).toUpperCase() : "?";
}

const CSV_HEADERS = [
  "id",
  "created_at",
  "author_name",
  "category",
  "visibility",
  "status",
  "votes",
  "followed_up_at",
  "body",
] as const;

export function postsToCsv(posts: AdminPost[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [CSV_HEADERS.join(",")];
  for (const p of posts) {
    lines.push(CSV_HEADERS.map((h) => escape((p as unknown as Record<string, unknown>)[h])).join(","));
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
