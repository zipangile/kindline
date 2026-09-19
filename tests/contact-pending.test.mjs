import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json'));
// Existing QA tooling can be supplied without installing or changing packages.
const tools=process.env.KINDLINE_QA_TOOLING
  ? createRequire(path.join(path.resolve(process.env.KINDLINE_QA_TOOLING),'package.json')) : require;
const {build}=tools('esbuild'),{chromium}=tools('playwright');

test('Contact uses real React pending state until delayed failure/success settles', {timeout:90000}, async()=>{
  const source=process.env.KINDLINE_CONTACT_TEST_SOURCE||path.join(root,'src/app/contact/page.tsx');
  const out=fs.mkdtempSync(path.join(process.env.KINDLINE_QA_OUTPUT||os.tmpdir(),'contact-pending-'));
  const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import Contact from ${JSON.stringify(source)};createRoot(document.getElementById('root')).render(<Contact/>);`,loader:'tsx',resolveDir:root},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic',nodePaths:[path.join(root,'node_modules')],define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'held-contact-action',setup(b){
    b.onResolve({filter:/^\.\/actions$/},()=>({path:'held-action',namespace:'test'}));
    b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:`window.contactCalls=[];window.contactResolve=null;export async function submitContactForm(data){window.contactCalls.push(Object.fromEntries(data));return await new Promise(resolve=>{window.contactResolve=resolve;});}`}));
  }}]});
  const css=process.env.KINDLINE_QA_CSS?fs.readFileSync(process.env.KINDLINE_QA_CSS):'';
  const server=http.createServer((r,s)=>{
    if(r.method!=='GET'){s.writeHead(405);return s.end('No real actions');}
    if(r.url==='/bundle.js'){s.setHeader('content-type','text/javascript');return s.end(bundle.outputFiles[0].contents);}
    if(r.url==='/styles.css'){s.setHeader('content-type','text/css');return s.end(css);}
    s.setHeader('content-type','text/html');s.end('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>');
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
  let browser,failed;const rows=[],errors=[];
  try{
    browser=await chromium.launch({headless:true,...(process.env.KINDLINE_QA_BROWSER_CHANNEL?{channel:process.env.KINDLINE_QA_BROWSER_CHANNEL}:{})});
    for(const width of [390,1280])for(const scheme of ['light','dark']){
      const context=await browser.newContext({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390,colorScheme:scheme,serviceWorkers:'block',reducedMotion:'reduce'});
      await context.route('**/*',r=>new URL(r.request().url()).origin===origin&&r.request().method()==='GET'?r.continue():r.abort());
      const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin);await p.locator('#email').waitFor();
      const submit=p.locator('button[type="submit"]');
      // Native required/email validation still prevents dispatch.
      await submit.click();assert.equal(await p.evaluate(()=>window.contactCalls.length),0);
      await p.locator('#email').fill('invalid');await p.locator('#message').fill('Synthetic QA only');await submit.click();assert.equal(await p.evaluate(()=>window.contactCalls.length),0);
      for(const [index,response] of [{success:false,error:'Synthetic validation failure'},{success:false},{success:true}].entries()){
        await p.locator('#firstName').fill('Synthetic');await p.locator('#lastName').fill('QA');await p.locator('#email').fill('fixture@example.test');await p.locator('#message').fill('Synthetic message '+index);
        await p.evaluate(()=>{window.contactResolve=null;});await submit.click();await p.waitForFunction(()=>typeof window.contactResolve==='function');
        await p.waitForTimeout(1200);
        assert.equal(await submit.innerText(),'Sending...');assert.equal(await submit.isDisabled(),true);
        for(const id of ['firstName','lastName','email','message'])assert.equal(await p.locator('#'+id).isDisabled(),true,id);
        assert.equal(await p.locator('form').getAttribute('aria-busy'),'true');assert.equal(await p.locator('[role=alert]').count(),0);
        assert.equal(await p.getByText('Message Sent!',{exact:true}).count(),0);
        assert.deepEqual(await p.evaluate(()=>window.contactCalls.at(-1)),{firstName:'Synthetic',lastName:'QA',email:'fixture@example.test',message:'Synthetic message '+index});
        await submit.evaluate(e=>e.click());assert.equal(await p.evaluate(()=>window.contactCalls.length),index+1,'disabled click must not dispatch again');
        const pendingShot=path.join(out,`${width}-${scheme}-${index}-pending.png`);await p.screenshot({path:pendingShot,fullPage:true});
        await p.evaluate(result=>window.contactResolve(result),response);
        if(response.success){await p.getByText('Message Sent!',{exact:true}).waitFor();assert.equal(await p.locator('form').count(),0);}
        else{const expected=response.error||'An unexpected error occurred.';await p.getByRole('alert').filter({hasText:expected}).waitFor();assert.equal(await submit.innerText(),'Send Message');assert.equal(await submit.isDisabled(),false);assert.equal(await p.locator('form').getAttribute('aria-busy'),'false');for(const id of ['firstName','lastName','email','message'])assert.equal(await p.locator('#'+id).isDisabled(),false);}
        const settledShot=path.join(out,`${width}-${scheme}-${index}-settled.png`);await p.screenshot({path:settledShot,fullPage:true});rows.push({width,scheme,index,response,pendingShot,settledShot});
      }
      await p.getByRole('button',{name:'Send another message'}).click();await p.locator('#email').waitFor();assert.equal(await submit.isDisabled(),false);assert.equal(await p.getByRole('alert').count(),0);assert.equal(await p.evaluate(()=>window.contactCalls.length),3);await context.close();
    }
    assert.deepEqual(errors,[]);
  }catch(e){failed=e;throw e;}finally{
    if(browser)await browser.close();await new Promise(r=>server.close(r));
    fs.writeFileSync(path.join(out,'RESULTS.json'),JSON.stringify({rows,errors,failure:failed?.message||null,closure:{browserClosed:!browser?.isConnected(),serverClosed:!server.listening},source,noRealActionOrEmail:true},null,2));console.log('Contact regression evidence: '+out);
  }
});
