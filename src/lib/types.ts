export type Category = "kudos" | "idea" | "blocker" | "process" | "culture";
export type Visibility = "public" | "anonymous" | "private";
export type PostStatus = "new" | "read" | "followed_up";

/** A row from the public `feed_posts` view — author_name is null unless visibility is 'public'. */
export interface FeedPost {
  id: string;
  category: Category;
  visibility: Extract<Visibility, "public" | "anonymous">;
  author_name: string | null;
  body: string;
  votes: number;
  created_at: string;
}

/** A full row from `posts` — only the lead can read these. */
export interface AdminPost {
  id: string;
  author_name: string;
  category: Category;
  visibility: Visibility;
  body: string;
  votes: number;
  status: PostStatus;
  lead_note: string | null;
  followed_up_at: string | null;
  opened_at: string | null;
  created_at: string;
}

export interface NewPost {
  author_name: string;
  category: Category;
  visibility: Visibility;
  body: string;
}
