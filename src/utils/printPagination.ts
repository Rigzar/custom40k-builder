import type { PaperSize } from '../components/PaperSize';

/**
 * Explicit pagination for Print View.
 *
 * WHY THIS EXISTS: every unit card already asks not to be split (`break-inside: avoid`). Blink
 * honours that. WebKit does not — reported from iOS Safari (Discord, 2026-09-08) with a Tactical
 * Squad whose header sat at the foot of page 6 and its stats on page 7, and confirmed still broken
 * after a `display: table` workaround shipped on 2026-09-08. The same document prints correctly in
 * Chrome on a PC, so it is the engine, not the layout.
 *
 * So stop asking. Instead of a hint the browser may ignore, this measures the cards and writes an
 * explicit `page-break-after` where a page is full. That property is CSS2, universally supported
 * for decades, and this codebase already relies on it for the cover page — so the fix does not
 * depend on the thing WebKit gets wrong.
 *
 * Measuring has one trap worth naming: on screen the printable column is ~736px wide, on A4 paper
 * it is ~703px. Cards reflow and get TALLER on paper, so measuring at screen width would under-
 * estimate and still overflow. `paginate` therefore forces the container to the real paper width,
 * measures, and restores it — synchronously, inside a layout effect, so nothing flickers.
 */

const PX_PER_MM = 96 / 25.4;

/** Printable box of a sheet, after the 12mm @page margin on each side (see PaperSize.tsx). */
export function pageBox(size: PaperSize): { width: number; height: number } {
  const [w, h] = size === 'Letter' ? [215.9, 279.4] : [210, 297];
  return { width: (w - 24) * PX_PER_MM, height: (h - 24) * PX_PER_MM };
}

/** Elements that already start or end a page of their own; pagination must not fight them. */
function forcesOwnBreak(el: HTMLElement): boolean {
  const cs = getComputedStyle(el);
  return cs.breakAfter === 'page' || cs.pageBreakAfter === 'always'
    || cs.breakBefore === 'page' || cs.pageBreakBefore === 'always';
}

/**
 * Walk the printable container's top-level blocks and mark where each page ends.
 *
 * Returns the number of breaks written, so a caller (or a test) can assert it did something.
 */
export function paginate(container: HTMLElement, size: PaperSize): number {
  const marked = container.querySelectorAll<HTMLElement>('[data-pv-break]');
  marked.forEach(el => { el.style.breakAfter = ''; el.style.pageBreakAfter = ''; el.removeAttribute('data-pv-break'); });

  const children = Array.from(container.children) as HTMLElement[];
  if (children.length === 0) return 0;

  const { width, height } = pageBox(size);
  const prevWidth = container.style.width;
  const prevMax = container.style.maxWidth;
  const prevPad = container.style.padding;
  // Measure at PAPER width, not screen width -- see the doc comment above.
  container.style.width = `${width}px`;
  container.style.maxWidth = 'none';
  container.style.padding = '0';

  let used = 0;
  let breaks = 0;
  let lastOnPage: HTMLElement | null = null;
  for (const el of children) {
    if (el.offsetParent === null && el.offsetHeight === 0) continue;   // hidden (print:hidden etc.)
    const h = el.offsetHeight;
    if (forcesOwnBreak(el)) { used = 0; lastOnPage = null; continue; }
    // A block taller than a whole page cannot be helped; give it the page it starts and carry on
    // rather than emitting a break before every one of them.
    if (used > 0 && used + h > height) {
      if (lastOnPage) {
        lastOnPage.style.breakAfter = 'page';
        lastOnPage.style.pageBreakAfter = 'always';
        lastOnPage.setAttribute('data-pv-break', '');
        breaks++;
      }
      used = h;
    } else {
      used += h;
    }
    lastOnPage = el;
  }

  container.style.width = prevWidth;
  container.style.maxWidth = prevMax;
  container.style.padding = prevPad;
  return breaks;
}
