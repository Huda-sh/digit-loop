import type { FilterState } from "@/components/LeadFilters";
import type { AdminPost } from "./types";

export function filterPosts(posts: AdminPost[], f: FilterState): AdminPost[] {
  const q = f.q.trim().toLowerCase();
  const cutoff =
    f.range === "all" ? 0 : Date.now() - Number(f.range) * 24 * 60 * 60 * 1000;
  return posts.filter((p) => {
    if (f.category !== "all" && p.category !== f.category) return false;
    if (f.visibility !== "all" && p.visibility !== f.visibility) return false;
    if (cutoff && new Date(p.created_at).getTime() < cutoff) return false;
    if (q && !(p.body.toLowerCase().includes(q) || p.author_name.toLowerCase().includes(q))) return false;
    return true;
  });
}
