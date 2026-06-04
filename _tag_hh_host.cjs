const fs = require('fs');
const f = 'data/parsed/horus_heresy.json';
const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const units = d.units || d;

let csm = 0, sm = 0;
for (const [un, u] of Object.entries(units)) {
  if (!u.option_groups) continue;
  for (const g of u.option_groups) {
    const h = g.header || '';
    // "Chaos Space Marine" must be tested BEFORE "Space Marine" (substring).
    if (/part of a Chaos Space Marine army/i.test(h)) {
      g.available_if = { type: 'instanceOf', scope: 'force', keyword: 'Chaos Space Marines' };
      csm++;
      console.log('CSM  ' + un + ' :: ' + h.slice(0, 60));
    } else if (/part of a Space Marine army/i.test(h)) {
      g.available_if = { type: 'instanceOf', scope: 'force', keyword: 'Space Marines' };
      sm++;
      console.log('SM   ' + un + ' :: ' + h.slice(0, 60));
    }
  }
}
fs.writeFileSync(f, JSON.stringify(d, null, 2));
console.log('tagged CSM(Mark of Chaos)=' + csm + '  SM(TSKNF)=' + sm);
