import { supabase } from "./supabase";
import type { AdminPost, FeedPost, NewPost } from "./types";
import { getVoterId } from "./voter";

export async function fetchFeed(): Promise<FeedPost[]> {
  const { data, error } = await supabase
    .from("feed_posts")
    .select("id,category,visibility,author_name,body,votes,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FeedPost[];
}

export async function fetchMyVotes(): Promise<Set<string>> {
  const { data, error } = await supabase.rpc("my_votes", { p_voter_id: getVoterId() });
  if (error) throw error;
  return new Set((data ?? []) as string[]);
}

/** Returns the post's new vote count. */
export async function toggleVote(postId: string): Promise<number> {
  const { data, error } = await supabase.rpc("toggle_vote", {
    p_post_id: postId,
    p_voter_id: getVoterId(),
  });
  if (error) throw error;
  return data as number;
}

export async function createPost(post: NewPost): Promise<void> {
  const { error } = await supabase.from("posts").insert({
    author_name: post.author_name.trim(),
    category: post.category,
    visibility: post.visibility,
    body: post.body,
  });
  if (error) throw error;
}

// ---- Lead-only ----------------------------------------------------------------

export async function fetchAllPosts(): Promise<AdminPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminPost[];
}

export async function markOpened(postId: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ opened_at: new Date().toISOString(), status: "read" })
    .eq("id", postId)
    .eq("status", "new");
  if (error) throw error;
}

export async function saveLeadNote(postId: string, note: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ lead_note: note })
    .eq("id", postId);
  if (error) throw error;
}

export async function setFollowedUp(postId: string, followedUp: boolean): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({
      status: followedUp ? "followed_up" : "read",
      followed_up_at: followedUp ? new Date().toISOString() : null,
    })
    .eq("id", postId);
  if (error) throw error;
}

/** Lead-only. Permanently removes notes (and their votes, via FK cascade). */
export async function deletePosts(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase.from("posts").delete().in("id", ids);
  if (error) throw error;
}

export async function checkIsLead(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_lead");
  if (error) return false;
  return Boolean(data);
}
