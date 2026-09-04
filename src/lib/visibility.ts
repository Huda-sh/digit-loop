import type { IconName } from "@/ds/Icon";
import type { Visibility } from "./types";

export interface VisibilityMeta {
  key: Visibility;
  title: string;
  icon: IconName;
  /** Short description shown on the selectable card. */
  desc: string;
  dark: boolean;
}

export const VISIBILITY_OPTIONS: VisibilityMeta[] = [
  {
    key: "public",
    title: "Public",
    icon: "globe",
    desc: "Your name and your note go on the team feed.",
    dark: false,
  },
  {
    key: "anonymous",
    title: "Anonymous",
    icon: "mask",
    desc: "The note goes on the feed with no name. The lead can still see it was you.",
    dark: false,
  },
  {
    key: "private",
    title: "Private",
    icon: "lock",
    desc: "Only the lead sees it. It never touches the feed.",
    dark: true,
  },
];

export interface StripStyle {
  bg: string;
  border: string;
  fg: string;
  icon: IconName;
  title: string;
  text: (who: string) => string;
  postLabel: string;
}

export const STRIP: Record<Visibility, StripStyle> = {
  public: {
    bg: "var(--surface-brand-subtle)",
    border: "var(--purple-200)",
    fg: "var(--purple-700)",
    icon: "globe",
    title: "Public",
    text: (who) => `this posts to the feed with ${who} on it. Anyone on the team can read it.`,
    postLabel: "Post to the feed",
  },
  anonymous: {
    bg: "var(--gold-50)",
    border: "var(--gold-300)",
    fg: "var(--gold-900)",
    icon: "mask",
    title: "Anonymous",
    text: (who) => `the feed shows no name. The lead can still see it came from ${who}.`,
    postLabel: "Post without my name",
  },
  private: {
    bg: "var(--surface-ink)",
    border: "var(--ink-700)",
    fg: "var(--white)",
    icon: "lock",
    title: "Private",
    text: () => "this goes to the lead alone. Nothing appears on the feed, now or later.",
    postLabel: "Send to the lead only",
  },
};

export interface SuccessMeta {
  el: number;
  title: string;
  body: string;
  pill: (name: string) => string;
  pillBg: string;
  pillBorder: string;
  pillFg: string;
}

export const SUCCESS: Record<Visibility, SuccessMeta> = {
  public: {
    el: 2,
    title: "Posted. It is on the feed.",
    body: "Top of the feed with your name on it. It cannot be edited or removed, which is what makes the feed worth reading.",
    pill: (name) => `Public · ${name}`,
    pillBg: "var(--surface-brand-subtle)",
    pillBorder: "var(--purple-200)",
    pillFg: "var(--purple-700)",
  },
  anonymous: {
    el: 13,
    title: "Posted without your name.",
    body: "The team sees the note and no author. The lead sees that it came from you, so they can follow up if it needs it.",
    pill: () => "Anonymous",
    pillBg: "var(--gold-50)",
    pillBorder: "var(--gold-300)",
    pillFg: "var(--gold-900)",
  },
  private: {
    el: 8,
    title: "Sent to the lead.",
    body: "Nothing appears on the feed. Median reply this month is under two days, and they will come to you directly.",
    pill: () => "Private",
    pillBg: "var(--surface-ink)",
    pillBorder: "var(--ink-700)",
    pillFg: "var(--white)",
  },
};

export const VIS_ROW_STYLE: Record<Visibility, { bg: string; fg: string; label: string }> = {
  public: { bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.75)", label: "Public" },
  anonymous: { bg: "rgba(155,22,232,.18)", fg: "#c886f6", label: "Anonymous" },
  private: { bg: "rgba(255,197,51,.14)", fg: "#ffc533", label: "Private" },
};
