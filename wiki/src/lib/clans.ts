/** Orks clans + Necrons dynasties — matched against an armory item's "desc" text
 *  (e.g. "...Unique. Bad Moons only." / "...Novokh only."), since the canonical data
 *  doesn't carry a structured clan/dynasty field per item, only this prose mention. */
const CLAN_ICONS: Record<string, string> = {
  'Bad Moons': '/icons/clans/bad-moons-clan.svg',
  'Evil Sunz': '/icons/clans/evil-sunz-clan.svg',
  'Evil Suns': '/icons/clans/evil-sunz-clan.svg',
  'Blood Axes': '/icons/clans/blood-axes-clan.svg',
  'Deathskulls': '/icons/clans/deathskulls-clan.svg',
  'Goffs': '/icons/clans/goffs-clan.svg',
  'Snakebites': '/icons/clans/snakebites-clan.svg',
  'Nephrekh': '/icons/dynasties/nephrekh.svg',
  'Szarekhan': '/icons/dynasties/szarekhan.svg',
  'Novokh': '/icons/dynasties/novokh.svg',
  'Nihilakh': '/icons/dynasties/nihilakh.svg',
  'Mephrit': '/icons/dynasties/mephrit.svg',
  'Sautekh': '/icons/dynasties/sautekh.svg',
};

const NAMES = Object.keys(CLAN_ICONS);

export function findClanIcon(desc: string | undefined): { name: string; icon: string } | null {
  if (!desc) return null;
  for (const name of NAMES) {
    if (desc.includes(name)) return { name, icon: CLAN_ICONS[name] };
  }
  return null;
}
