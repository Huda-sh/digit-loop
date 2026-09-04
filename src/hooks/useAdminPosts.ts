import { useCallback, useEffect, useState } from "react";
import { fetchAllPosts } from "@/lib/api";
import type { AdminPost } from "@/lib/types";

export function useAdminPosts(enabled: boolean) {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await fetchAllPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void reload();
  }, [enabled, reload]);

  const patch = useCallback((id: string, fields: Partial<AdminPost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  }, []);

  const remove = useCallback((ids: string[]) => {
    const gone = new Set(ids);
    setPosts((prev) => prev.filter((p) => !gone.has(p.id)));
  }, []);

  return { posts, loading, error, reload, patch, remove };
}
