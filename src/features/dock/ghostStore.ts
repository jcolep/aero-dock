/**
 * Where the focus mark's ghost is: under one app at a time, for the whole dock.
 *
 * The ghost used to be under whichever icon had the pointer on it, so a quick sweep across the dock made one for each icon
 * passed and carried it from each to the next: it was all over the place. Now the dock has one place for it, which moves
 * to an icon only once the pointer has rested there for a moment (Settings > Dock > Ghost delay). Crossing icons faster
 * than that leaves it where it was, and it glides to wherever the pointer comes to rest; and leaving the dock, or an icon
 * for the gap between two, leaves it for a moment longer than it takes to land on the next, so it can travel instead of
 * going and coming back.
 */

import { create } from "zustand";

/** The app (its item id) the ghost is under, or null. */
export const useGhost = create<{ target: string | null }>(() => ({ target: null }));

let enterTimer: ReturnType<typeof setTimeout> | undefined;
let leaveTimer: ReturnType<typeof setTimeout> | undefined;
/** The icon the pointer is on, waiting out the delay. */
let pending: string | null = null;

/** After the pointer has left the icon the ghost is under, how long it stays for the next one to take it over. */
const grace = (delayMs: number) => delayMs + 140;

/** The pointer (or the keyboard) came onto an icon. */
export function ghostEnter(id: string, delayMs: number) {
  clearTimeout(leaveTimer);
  clearTimeout(enterTimer);
  if (useGhost.getState().target === id) {
    pending = null;
    return;
  }
  if (delayMs <= 0) {
    pending = null;
    useGhost.setState({ target: id });
    return;
  }
  pending = id;
  enterTimer = setTimeout(() => {
    if (pending === id) useGhost.setState({ target: id });
    pending = null;
  }, delayMs);
}

/** The pointer (or the keyboard) went off an icon. */
export function ghostLeave(id: string, delayMs: number) {
  if (pending === id) {
    clearTimeout(enterTimer);
    pending = null;
  }
  if (useGhost.getState().target !== id) return;
  clearTimeout(leaveTimer);
  if (delayMs <= 0) {
    useGhost.setState({ target: null });
    return;
  }
  leaveTimer = setTimeout(() => {
    if (useGhost.getState().target === id) useGhost.setState({ target: null });
  }, grace(delayMs));
}
