import { Fragment, useEffect, useRef, useState } from 'react';
import { lookupRule, lookupWeaponType } from '../data/coreRules';
import { rl } from '../utils/localName';

/**
 * One weapon ability with its rule text in a popover: shown on mouse hover, and on a tap for touch screens (a native `title`
 * tooltip never opens on a phone). The box is positioned from the token's rectangle with `position: fixed`, so a table with
 * overflow clipping cannot cut it off.
 */
function AbilityTip({ label, name, description }: { label: string; name: string; description: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const pointer = useRef('mouse');

  const open = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const w = Math.min(288, window.innerWidth - 16);
    setPos({ x: Math.max(8, Math.min(r.left, window.innerWidth - w - 8)), y: r.bottom + 4 });
  };

  useEffect(() => {
    if (!pos) return;
    const close = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setPos(null); };
    document.addEventListener('pointerdown', close);
    window.addEventListener('scroll', () => setPos(null), { once: true, capture: true });
    return () => document.removeEventListener('pointerdown', close);
  }, [pos]);

  return (
    <span
      ref={ref}
      className="cursor-help underline decoration-dotted decoration-zinc-600 underline-offset-2"
      onPointerDown={e => { pointer.current = e.pointerType; }}
      onPointerEnter={e => { if (e.pointerType === 'mouse') open(); }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setPos(null); }}
      onClick={e => { e.stopPropagation(); if (pointer.current !== 'mouse') (pos ? setPos(null) : open()); }}
    >
      {label}
      {pos && (
        <span
          role="tooltip"
          style={{ position: 'fixed', left: pos.x, top: pos.y, width: Math.min(288, window.innerWidth - 16) }}
          className="z-[100] block bg-zinc-950 border border-amber-800 text-zinc-200 text-[11px] leading-snug p-2 shadow-lg normal-case font-normal no-underline whitespace-normal text-left"
        >
          <span className="block text-amber-400 font-semibold mb-0.5">{name}</span>
          {description}
        </span>
      )}
    </span>
  );
}

/** A weapon's "Abilities" cell with the rule text of each ability on hover or tap ("Rad", "AT(1)", "Piercing(5+)"...). */
export function AbilityTokens({ text }: { text: string }) {
  const tokens = text.split(/,\s*/).filter(Boolean);
  return (
    <>
      {tokens.map((tok, i) => {
        const clean = tok.replace(/\s*◆\s*$/, '').trim();
        const rule = lookupRule(clean);
        const label = rl(tok);
        return (
          <Fragment key={i}>
            {i > 0 && ', '}
            {rule ? <AbilityTip label={label} name={rule.displayName} description={rule.description} /> : label}
          </Fragment>
        );
      })}
    </>
  );
}

/** A weapon's "Type" cell ("Pistol 1", "Rapid Fire 2", "Melee"...) with the Core Rules text of that weapon type on hover or tap. */
export function WeaponTypeTip({ type }: { type: string }) {
  const rule = type ? lookupWeaponType(type) : null;
  return rule ? <AbilityTip label={rl(type)} name={rule.displayName} description={rule.description} /> : <>{rl(type)}</>;
}

/**
 * A rule's description with every quoted rule name in it explained on hover or tap: ... gains the "Shunting" ability ...
 * Only a quote that matches a Core Rules glossary entry becomes a tip; anything else stays plain text.
 */
export function RuleText({ text }: { text: string }) {
  const parts = text.split(/(["“][^"”\n]{2,40}["”])/);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^["“]([^"”\n]{2,40})["”]$/);
        const rule = m ? lookupRule(m[1].trim()) : null;
        return rule ? <AbilityTip key={i} label={p} name={rule.displayName} description={rule.description} /> : <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
