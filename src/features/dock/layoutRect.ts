/**
 * Where an element is in the page, for placing the compositor's live window pictures
 * (see thumbnails.rs), which are drawn over the page and have to be given pixels.
 */

/** An element's box in the page, from layout offsets so that ancestors'
 *  transforms (the entrance animation) do not move or shrink it. */
export function layoutRect(el: HTMLElement) {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    left += node.offsetLeft;
    top += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    // offsets are measured from the parent's padding edge, inside its border
    if (parent) {
      left += parent.clientLeft;
      top += parent.clientTop;
    }
    node = parent;
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

