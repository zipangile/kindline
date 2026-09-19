import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..'),require=createRequire(import.meta.url),ts=require('typescript');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(p){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(read(p),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module:mod,exports:mod.exports,URL,require:n=>n==='@/lib/utils'?load('src/lib/utils.ts'):require(n)});return mod.exports;}
const rgb=h=>h.replace('#','').match(/../g).map(x=>parseInt(x,16));
const lum=h=>rgb(h).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('supported light theme has no partial automatic dark surfaces',()=>{
 const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(tsx|css)$/.test(p))files.push(p);}}walk(path.join(root,'src'));
 for(const f of files)assert.doesNotMatch(fs.readFileSync(f,'utf8'),/\bdark:|prefers-color-scheme\s*:\s*dark/,path.relative(root,f));
 assert.match(read('src/app/globals.css'),/color-scheme:\s*light/);
});
test('brand and semantic text/border token pairs meet contrast targets',()=>{
 const css=read('src/app/globals.css');
 for(const name of ['brand-blue','brand-purple','brand-green','brand-orange','muted-foreground','color-gray-500','color-green-600','color-orange-600','color-red-500']){
  const value=css.match(new RegExp('--'+name+':\\s*(#[0-9a-f]{6})'))?.[1];assert.ok(value,name);assert.ok(contrast(value,'#ffffff')>=4.5,`${name}: ${contrast(value,'#ffffff')}`);
 }
 assert.ok(contrast('#6b7280','#ffffff')>=3);assert.ok(contrast('#4b5563','#e5e7eb')>=4.5);
 assert.ok(contrast('#bfdbfe','#111827')>=4.5);assert.ok(contrast('#d1d5db','#1e293b')>=4.5);
 assert.ok(contrast('#b91c1c','#fef2f2')>=4.5);
});
test('actual shared Button retains paired colours, visible disabled and wrapping targets',()=>{
 const {buttonVariants}=load('src/components/ui/Button.tsx');
 for(const variant of ['default','purple','green','orange','destructive','outline','secondary','ghost','link']){const c=buttonVariants({variant});assert.match(c,/text-/);assert.doesNotMatch(c,/dark:|opacity-50|whitespace-nowrap/);assert.match(c,/min-h-11/);}
 const css=read('src/app/globals.css');assert.match(css,/:disabled\s*\{[\s\S]*?opacity:\s*1/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/outline:\s*3px solid #0071bc/);
});
test('actual shared Card no longer imposes a dark background over fixed light children',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');const {Card,CardTitle}=load('src/components/ui/Card.tsx');
 const html=renderToStaticMarkup(React.createElement(Card,null,React.createElement(CardTitle,{className:'text-gray-900'},'Fixture heading')));
 assert.match(html,/bg-white/);assert.match(html,/text-gray-900/);assert.doesNotMatch(html,/dark:/);
});
test('table controls remain reachable with keyboard-local horizontal scroll',()=>{
 for(const p of ['admin/programmes/page.tsx','admin/news/page.tsx','admin/admins/AdminManagement.tsx','admin/donors/page.tsx','admin/volunteers/page.tsx','admin/newsletter/page.tsx','dashboard/friend/page.tsx']){const s=read('src/app/'+p);assert.match(s,/table-scroll/);assert.match(s,/tabIndex=\{0\}/);assert.match(s,/role="region"/);}
 const s=read('src/app/admin/programmes/AddProgramForm.tsx');assert.match(s,/<button[\s\S]*?aria-expanded=\{isOpen\}/);assert.doesNotMatch(s,/<h2/);
});
test('Royal Blue/tagline and safe email formatting remain; mail has explicit paired palette',()=>{
 assert.match(read('src/app/globals.css'),/--brand-blue: #0071bc/);assert.match(read('src/components/Footer.tsx'),/My care\. Your care\. Our care\./);
 const {EMAIL_PANEL_STYLE,renderCommunicationEmail}=load('src/lib/email-template.ts');assert.match(EMAIL_PANEL_STYLE,/background-color:#ffffff/);assert.match(EMAIL_PANEL_STYLE,/color:#1f2937/);
 const mail=renderCommunicationEmail('Line one\nLine two\n\nParagraph two');assert.match(mail.html,/Line one<br>Line two/);assert.match(mail.html,/<\/p><p/);assert.match(mail.html,/Kindline Care Foundation/);
 assert.doesNotMatch(read('src/lib/email.ts'),/#999|#00A651|#8B438E/);
});
