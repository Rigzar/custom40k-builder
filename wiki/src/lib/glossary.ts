import { lookupRule, normaliseKey } from '../vendor/src/data/coreRules';
export {
  RULES,
  normaliseKey,
  lookupRule,
  lookupRuleGeneric,
  parseAbility,
} from '../vendor/src/data/coreRules';
export type { RuleEntry, AbilityPart } from '../vendor/src/data/coreRules';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * A rule's text as HTML in which every quoted Core Rules name ("Shunting", "Move through cover"...) is a link to its
 * glossary page that shows the rule on hover or keyboard focus (class `rule-tip`, styled in Layout.astro). A quote that is
 * not a glossary entry stays plain. Everything else is escaped, so the result is safe for set:html.
 */
export function ruleTextHtml(text: string): string {
  return text.split(/(["“][^"”\n]{2,40}["”])/).map(part => {
    const m = part.match(/^["“]([^"”\n]{2,40})["”]$/);
    const rule = m ? lookupRule(m[1].trim()) : null;
    if (!m || !rule) return esc(part);
    const { key } = normaliseKey(m[1].trim());
    return `<a class="rule-tip" href="/glossary/${encodeURIComponent(key)}" data-tip="${esc(`${rule.displayName}: ${rule.description}`)}">${esc(part)}</a>`;
  }).join('');
}
