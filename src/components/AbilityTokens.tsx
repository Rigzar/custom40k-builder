import { Fragment } from 'react';
import { lookupRule } from '../data/coreRules';
import { rl } from '../utils/localName';

/** A weapon's "Abilities" cell with the rule text of each ability as a hover tooltip ("Rad", "AT(1)", "Piercing(5+)"...). */
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
            {rule
              ? <span title={`${rule.displayName}: ${rule.description}`} className="cursor-help underline decoration-dotted decoration-zinc-600 underline-offset-2">{label}</span>
              : label}
          </Fragment>
        );
      })}
    </>
  );
}
