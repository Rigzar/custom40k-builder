/**
 * Draws the order and Battleshock tokens used by the Tabletop Simulator table mod (public/tts/tokens/*.png).
 * They are our own artwork: nothing here depends on someone else's Workshop item.
 *
 *   npm i --no-save sharp          (only needed to redraw them; the PNGs are committed)
 *   node tts/build_tokens.cjs
 *
 * The file names are the contract with tts/Custom40kTable.lua (TOKEN_FILES): change both together.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'public', 'tts', 'tokens');
fs.mkdirSync(OUT, { recursive: true });

// file, ring colour, lines of text, optional small caption under the text, glyph
const TOKENS = [
  { file: 'advance.png', color: '#4CAF50', lines: ['ADVANCE'], sub: 'move + D6"', glyph: 'chevrons' },
  { file: 'charge.png', color: '#E53935', lines: ['CHARGE'], sub: 'move + 6"', glyph: 'bolt' },
  { file: 'escape.png', color: '#FBC02D', lines: ['ESCAPE'], sub: 'leave melee', glyph: 'arrowout' },
  { file: 'fight.png', color: '#B71C1C', lines: ['FIGHT'], sub: 'melee', glyph: 'cross' },
  { file: 'move-shoot.png', color: '#1E88E5', lines: ['MOVE &', 'SHOOT'], sub: 'no Heavy', glyph: 'target' },
  { file: 'stand-shoot.png', color: '#00ACC1', lines: ['STAND &', 'SHOOT'], sub: 'no move', glyph: 'target' },
  { file: 'hidden.png', color: '#757575', lines: ['ORDER'], sub: 'face down', glyph: 'question' },
  { file: 'pinned.png', color: '#FF9800', lines: ['PINNED'], sub: '-1 to hit, half move', glyph: 'pin' },
  { file: 'fleeing.png', color: '#D50000', lines: ['FLEEING'], sub: '2 tokens', glyph: 'arrowout' },
];

function glyph(kind, color) {
  const c = `fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"`;
  switch (kind) {
    case 'chevrons': return `<polyline points="190,150 256,205 322,150" ${c}/><polyline points="190,200 256,255 322,200" ${c}/>`;
    case 'bolt': return `<polygon points="270,130 205,225 250,225 235,300 305,200 258,200" fill="${color}" stroke="none"/>`;
    case 'arrowout': return `<line x1="256" y1="215" x2="256" y2="140" ${c}/><polyline points="220,172 256,136 292,172" ${c}/><line x1="190" y1="250" x2="322" y2="250" ${c}/>`;
    case 'cross': return `<line x1="200" y1="140" x2="312" y2="252" ${c}/><line x1="312" y1="140" x2="200" y2="252" ${c}/>`;
    case 'target': return `<circle cx="256" cy="198" r="52" ${c}/><circle cx="256" cy="198" r="16" fill="${color}" stroke="none"/><line x1="256" y1="130" x2="256" y2="148" ${c}/><line x1="256" y1="248" x2="256" y2="266" ${c}/>`;
    case 'question': return `<text x="256" y="250" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="130" text-anchor="middle" fill="${color}">?</text>`;
    case 'pin': return `<circle cx="256" cy="165" r="26" fill="${color}" stroke="none"/><line x1="256" y1="190" x2="256" y2="262" ${c}/>`;
    default: return '';
  }
}

function svg(t) {
  const text = t.lines.map((l, i) => {
    const size = l.length > 7 ? 54 : 64;
    const y = (t.lines.length === 1 ? 342 : 320) + i * 62;
    return `<text x="256" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="#F5F0E1">${l.replace('&', '&amp;')}</text>`;
  }).join('');
  const subY = t.lines.length === 1 ? 392 : 432;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="248" fill="#14181F"/>
  <circle cx="256" cy="256" r="236" fill="none" stroke="${t.color}" stroke-width="22"/>
  <circle cx="256" cy="256" r="205" fill="none" stroke="${t.color}" stroke-width="3" opacity="0.6"/>
  ${glyph(t.glyph, t.color)}
  ${text}
  <text x="256" y="${subY}" font-family="Arial, Helvetica, sans-serif" font-size="30" text-anchor="middle" fill="${t.color}">${t.sub}</text>
</svg>`;
}

(async () => {
  for (const t of TOKENS) {
    await sharp(Buffer.from(svg(t))).png().toFile(path.join(OUT, t.file));
    console.log('drew ' + t.file);
  }
})();
