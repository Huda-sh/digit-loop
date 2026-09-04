import type { Category, Visibility } from "./types";

export interface CategoryMeta {
  key: Category;
  label: string;
  /** Digit brand element index (assets/elements/element-NN.png) */
  el: number;
  /** Badge tone from the DS Badge component */
  tone: "gold" | "info" | "ink" | "plum" | "brand";
  /** dot / accent colour token */
  dot: string;
  tint: string;
  ink: string;
  /** Visibility this category falls back to when picked. */
  defaultVisibility: Visibility;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  kudos: {
    key: "kudos",
    label: "Kudos",
    el: 2,
    tone: "gold",
    dot: "var(--gold-500)",
    tint: "var(--gold-50)",
    ink: "var(--gold-900)",
    defaultVisibility: "public",
  },
  idea: {
    key: "idea",
    label: "Idea",
    el: 12,
    tone: "info",
    dot: "var(--blue-500)",
    tint: "var(--blue-50)",
    ink: "var(--blue-700)",
    defaultVisibility: "public",
  },
  blocker: {
    key: "blocker",
    label: "Blocker",
    el: 1,
    tone: "ink",
    dot: "var(--ink-500)",
    tint: "var(--gray-100)",
    ink: "var(--ink-800)",
    defaultVisibility: "private",
  },
  process: {
    key: "process",
    label: "Process",
    el: 10,
    tone: "plum",
    dot: "var(--plum-500)",
    tint: "var(--plum-50)",
    ink: "var(--plum-700)",
    defaultVisibility: "public",
  },
  culture: {
    key: "culture",
    label: "Culture",
    el: 4,
    tone: "brand",
    dot: "var(--purple-500)",
    tint: "var(--purple-50)",
    ink: "var(--purple-700)",
    defaultVisibility: "public",
  },
};

export const CATEGORY_ORDER: Category[] = ["kudos", "idea", "blocker", "process", "culture"];

export const CHAR_LIMIT = 600;
