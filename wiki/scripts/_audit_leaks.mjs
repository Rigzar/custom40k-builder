import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk=(d,o=[])=>{for(const n of readdirSync(d)){const p=join(d,n);statSync(p).isDirectory()?walk(p,o):o.push(p)}return o};
const files=walk('dist').filter(f=>f.endsWith('.html'));
const vis=h=>h.replace(/<(script|style)[\s\S]*?<\/\1>/g,'').replace(/<[^>]+>/g,'\n');
const pats={undefined:/\bundefined\b/,NaN:/\bNaN\b/,object:/\[object/,braces:/\{\{|\}\}/,dunder:/__[a-z_]+__/,nullword:/\bnull\b/,amp:/&amp;amp;|&#38;#|&amp;#/,ptsMinus:/\bpts\b.*\bundefined/,emptyParen:/\(\s*\)/,dblspace:/ {3,}\S/};
const hits={};
for(const f of files){const t=vis(readFileSync(f,'utf8'));
 for(const [k,re] of Object.entries(pats)){ if(k==='dblspace'||k==='emptyParen') continue; const m=t.match(re); if(m){(hits[k]??=[]).push(f.replace('dist','')+'  ⟶ '+t.slice(Math.max(0,m.index-40),m.index+50).replace(/\s+/g,' '))}}}
for(const [k,v] of Object.entries(hits)){console.log('\n##',k,v.length);v.slice(0,6).forEach(x=>console.log('  ',x))}
// tiny pages
const small=files.filter(f=>vis(readFileSync(f,'utf8')).replace(/\s+/g,' ').length<700).map(f=>f.replace('dist',''));
console.log('\n## very small pages',small.length);small.slice(0,25).forEach(x=>console.log('  ',x));
