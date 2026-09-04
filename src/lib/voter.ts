const KEY = "loop.voter_id";

/** A stable per-browser id so a visitor can toggle their own upvotes without an account. */
export function getVoterId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage blocked — fall back to an ephemeral id for this tab.
    return "ephemeral-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

const NAME_KEY = "loop.name";

export function getSavedName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name.trim());
  } catch {
    /* ignore */
  }
}
