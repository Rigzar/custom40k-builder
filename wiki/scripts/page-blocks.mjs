/**
 * Shared by extract-page-strings.mjs and translate-pages.mjs: finds the translatable "leaf blocks"
 * of a built HTML page (a p / li / td / th / h* / div … that holds text but no other block inside it;
 * inline tags such as <strong> stay in the string; SVG <text> captions count too).
 */
import { parse } from 'parse5';

const BLOCK = new Set(['p', 'li', 'td', 'th', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'thead',
  'tbody', 'tr', 'nav', 'section', 'details', 'summary', 'button', 'figure', 'figcaption', 'blockquote', 'main', 'header',
  'footer', 'svg']);
const SKIP = new Set(['script', 'style', 'head', 'title']);

/** The scoped-style attribute Astro adds to every tag — identical on the whole page, noise to a translator. */
export const CID = / data-astro-cid-[a-z0-9]+/g;
export const norm = s => s.replace(CID, '').trim();

function containsBlock(node) {
  for (const ch of node.childNodes ?? []) {
    if (BLOCK.has(ch.nodeName)) return true;
    if (!SKIP.has(ch.nodeName) && containsBlock(ch)) return true;
  }
  return false;
}

/** Returns [{ start, end, inner }] — offsets of each leaf block's inner HTML inside `html`. */
export function leafBlocks(html) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const out = [];
  const walk = node => {
    for (const ch of node.childNodes ?? []) {
      if (ch.nodeName === '#text' || ch.nodeName === '#comment' || SKIP.has(ch.nodeName)) continue;
      const loc = ch.sourceCodeLocation;
      const isLeaf = (BLOCK.has(ch.nodeName) && ch.nodeName !== 'svg' || ch.nodeName === 'text') && !containsBlock(ch);
      if (isLeaf && loc?.startTag && loc?.endTag) {
        const inner = html.slice(loc.startTag.endOffset, loc.endTag.startOffset);
        const plain = inner.replace(/<[^>]*>/g, '').replace(/[<>]/g, ''); // only used to ask "is there any text here"
        if (/[A-Za-z]{2,}/.test(plain)) out.push({ start: loc.startTag.endOffset, end: loc.endTag.startOffset, inner });
        continue;
      }
      walk(ch);
    }
  };
  walk(doc);
  return out;
}
