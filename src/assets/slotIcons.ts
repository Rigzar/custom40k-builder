import hq           from './slots/HQsign.png';
import troops       from './slots/TroopsSign.png';
import elites       from './slots/ElitesSign.png';
import fastAttack   from './slots/FastAttackSign.png';
import heavySupport from './slots/HeavySupportSign.png';
import transport    from './slots/OtherSign.png';
import fortification from './slots/FortificationSign.png';
import flyers       from './slots/LordsOfWarSign.png';
import lordsOfWar   from './slots/LordsOfWarSign.png';

export const SLOT_ICONS: Record<string, string> = {
  'HQ':                   hq,
  'Troops':               troops,
  'Elites':               elites,
  'Fast Attack':          fastAttack,
  'Heavy Support':        heavySupport,
  'Dedicated Transport':  transport,
  'Fortifications':       fortification,
  'Flyers':               flyers,
  'Lords of War':         lordsOfWar,
};
