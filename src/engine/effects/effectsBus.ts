/**
 * Tiny event bus decoupling UI components from the effects layer.
 * Components fire fire-and-forget visual events; the effects layer
 * (if mounted and enabled) renders them.
 */

export interface RippleEvent {
  x: number;
  y: number;
  /** window inner size at emit time — the dock window resizes for
   * flyouts, so the layer re-anchors coordinates to the dock edge */
  winW: number;
  winH: number;
  /** The icon's own live bounds (window space), read fresh every frame by whichever click effect clips itself to
   *  the icon rather than drawing behind it — so a still-swollen or shrinking magnified icon carries the effect
   *  with it. `null` once the icon is gone. */
  track: () => { x: number; y: number; w: number; h: number } | null;
  /** The icon's own drawn image, read fresh each frame, for an effect that masks itself to the icon's actual
   *  pixels rather than its rounded-square tile. `null` for a stack or the no-icon-found glyph (neither is a
   *  plain image) or before a real icon has finished loading. */
  iconSource: () => CanvasImageSource | null;
  /** Where inside the icon the click landed, as a fraction of its width/height (0..1), not a pixel offset — so
   *  an icon-surface effect anchored to the click point stays there as the icon's live size changes. */
  clickX: number;
  clickY: number;
}

export interface BurstEvent {
  x: number;
  y: number;
  winW: number;
  winH: number;
}

/** One of the click effects, played on something that is not an app's icon (the Liquidock button, on hover), with
 *  the effect and its tuning given rather than read from the click setting. */
export interface GlintEvent {
  effect: string;
  tune: { speed?: number; opacity?: number; size?: number; color?: string } | undefined;
  winW: number;
  winH: number;
  track: RippleEvent["track"];
  iconSource: RippleEvent["iconSource"];
}

type EffectEvents = {
  ripple: RippleEvent;
  burst: BurstEvent;
  glint: GlintEvent;
};

type Handler<T> = (payload: T) => void;

const handlers: { [K in keyof EffectEvents]: Set<Handler<EffectEvents[K]>> } = {
  ripple: new Set(),
  burst: new Set(),
  glint: new Set(),
};

export const effectsBus = {
  emit<K extends keyof EffectEvents>(kind: K, payload: EffectEvents[K]): void {
    for (const h of handlers[kind]) h(payload);
  },
  on<K extends keyof EffectEvents>(kind: K, handler: Handler<EffectEvents[K]>): () => void {
    handlers[kind].add(handler);
    return () => handlers[kind].delete(handler);
  },
};
