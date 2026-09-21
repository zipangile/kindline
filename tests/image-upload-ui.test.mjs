import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { createRequire } from 'node:module';
const root = path.resolve(import.meta.dirname, '..');
const tools = createRequire(path.join(process.env.KINDLINE_QA_TOOLING || root, 'package.json'));
const { build } = tools('esbuild'), { chromium } = tools('playwright');

test('all actual upload forms show safe failures locally, retain retry files and clear only on confirmed success', { timeout: 90000 }, async () => {
  const out = fs.mkdtempSync(path.join(process.env.KINDLINE_QA_OUTPUT || os.tmpdir(), 'image-upload-ui-'));
  const actions = `window.qa={calls:[],saveCalls:[],removeCalls:[],resolve:null,saveFail:false,removeFail:false};
export async function uploadImage(data){window.qa.calls.push({name:data.get('file').name,size:data.get('file').size});return await new Promise((resolve,reject)=>window.qa.resolve=value=>value.throw?reject(new Error('PRIVATE_PROVIDER_CANARY')):resolve(value));}
export async function updateSiteImage(...args){window.qa.saveCalls.push(args);if(window.qa.saveFail)throw new Error('PRIVATE_DB_CANARY');}
export async function removeSiteImage(...args){window.qa.removeCalls.push(args);if(window.qa.removeFail)throw new Error('PRIVATE_DB_CANARY');}
export async function updateNewsImage(...args){window.qa.saveCalls.push(args);if(window.qa.saveFail)throw new Error('PRIVATE_DB_CANARY');}
export async function createNewsPost(){} export async function updateNewsPost(){} export async function createProgram(){} export async function updateProgram(){}`;
  const bundle = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import Images from './src/app/admin/images/ImageManager';import News from './src/app/admin/news/NewsForm';import Programme from './src/app/admin/programmes/ProgramForm';
const kind=new URLSearchParams(location.search).get('kind');const post={id:'synthetic',title:'Synthetic',slug:'synthetic',content:'Synthetic',excerpt:null,category:'Event',image:null,published:true};
createRoot(document.getElementById('root')).render(kind==='news'?<News post={post}/>:kind==='programme'?<Programme/>:<Images initialImages={[]}/>);`, loader: 'tsx', resolveDir: root }, bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', nodePaths: [path.join(root, 'node_modules')], define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'synthetic-upload-actions', setup(b) {
    b.onResolve({ filter: /actions$/ }, () => ({ path: 'actions', namespace: 'fixture' }));
    b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: actions }));
    b.onResolve({ filter: /^next\/image$/ }, () => ({ path: 'image', namespace: 'image' }));
    b.onLoad({ filter: /.*/, namespace: 'image' }, () => ({ contents: `import React from 'react';export default function Image({alt}){return <span role="img" aria-label={alt}/>}`, loader: 'tsx', resolveDir: root }));
  } }] });
  const css = process.env.KINDLINE_QA_CSS ? fs.readFileSync(process.env.KINDLINE_QA_CSS) : '';
  const server = http.createServer((r, s) => {
    if (r.method !== 'GET') { s.writeHead(405); return s.end(); }
    if (r.url === '/bundle.js') { s.setHeader('Content-Type', 'text/javascript'); return s.end(bundle.outputFiles[0].contents); }
    if (r.url === '/styles.css') { s.setHeader('Content-Type', 'text/css'); return s.end(css); }
    s.setHeader('Content-Type', 'text/html'); s.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body style="padding:20px"><div id="root"></div><script src="/bundle.js"></script></body></html>');
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = `http://127.0.0.1:${server.address().port}`;
  let browser, failure; const rows = [], errors = [];
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.KINDLINE_QA_BROWSER_CHANNEL ? { channel: process.env.KINDLINE_QA_BROWSER_CHANNEL } : {}) });
    for (const width of [390, 1280]) for (const kind of ['images', 'partner', 'news', 'programme']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width === 390, hasTouch: width === 390, serviceWorkers: 'block', reducedMotion: 'reduce' });
      await context.route('**/*', route => new URL(route.request().url()).origin === origin && route.request().method() === 'GET' ? route.continue() : route.abort());
      const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message)); await page.goto(`${origin}/?kind=${kind}`);
      const cards = kind === 'images' || kind === 'partner';
      if (kind === 'partner') await page.getByRole('button', { name: 'Add partner logo', exact: true }).click();
      const input = kind === 'images' ? page.locator('#logo-file') : kind === 'partner' ? page.locator('input[type=file][id^=partner_]') : page.locator('input[type=file]');
      await input.waitFor(); assert.equal(await input.getAttribute('accept'), 'image/jpeg,image/png,image/webp,image/gif');
      const form = input.locator('xpath=ancestor::form');
      if (kind === 'partner') await form.getByLabel('Partner name (public)').fill('Synthetic partner');
      const status = cards ? form.getByRole('status') : page.getByRole('status');
      const start = async () => {
        await page.evaluate(() => { window.qa.resolve = null; });
        if (cards) await form.getByRole('button', { name: 'Save image & description', exact: true }).click();
        else await page.getByRole('button', { name: 'Retry selected image', exact: true }).click();
        await page.waitForFunction(() => typeof window.qa.resolve === 'function');
      };
      await input.setInputFiles({ name: 'fixture.png', mimeType: 'image/png', buffer: Buffer.from('Synthetic action fixture; decoder separately tested') });
      if (cards) await start(); else await page.waitForFunction(() => typeof window.qa.resolve === 'function');
      assert.equal(await input.isDisabled(), true);
      const denied = { ok: false, code: 'STORAGE_AUTH', message: 'Image storage denied access. Contact the site administrator to check the configured project, server key and storage permissions.' };
      await page.evaluate(value => window.qa.resolve(value), denied);
      await status.filter({ hasText: denied.message }).waitFor(); assert.equal(await input.isDisabled(), false); assert.equal(await input.evaluate(e => e.files.length), 1); assert.equal(await page.evaluate(() => window.qa.saveCalls.length), 0);
      await status.scrollIntoViewIfNeeded(); const shot = path.join(out, `${kind}-${width}-error.png`); await page.screenshot({ path: shot });
      await start(); await page.evaluate(() => window.qa.resolve({ throw: true })); await status.filter({ hasText: 'could not be confirmed' }).waitFor(); assert.equal(await input.evaluate(e => e.files.length), 1); assert.doesNotMatch(await page.locator('body').innerText(), /PRIVATE_PROVIDER|PRIVATE_DB/);
      if (kind !== 'programme') {
        await page.evaluate(() => { window.qa.saveFail = true; }); await start(); await page.evaluate(() => window.qa.resolve({ ok: true, url: '/images/synthetic.png' }));
        await status.filter({ hasText: 'file uploaded, but saving' }).waitFor(); assert.equal(await input.evaluate(e => e.files.length), 1);
      }
      await page.evaluate(() => { window.qa.saveFail = false; }); await start(); await page.evaluate(() => window.qa.resolve({ ok: true, url: '/images/synthetic.png' }));
      await page.waitForFunction(id => document.getElementById(id).files.length === 0, await input.getAttribute('id')); assert.equal(await input.inputValue(), '');
      if (!cards) assert.equal(await page.getByRole('button', { name: 'Retry selected image', exact: true }).count(), 0);
      if (kind === 'programme') assert.match(await status.innerText(), /Save or Update Programme/);
      if (cards) { const before = await page.evaluate(() => window.qa.calls.length); await form.getByRole('button', { name: 'Save image & description', exact: true }).click(); assert.equal(await page.evaluate(() => window.qa.calls.length), before); }
      if (kind === 'images' || kind === 'news') {
        await input.setInputFiles({ name: 'retained.png', mimeType: 'image/png', buffer: Buffer.from('Synthetic only') });
        if (kind === 'news') { await page.waitForFunction(() => typeof window.qa.resolve === 'function'); await page.evaluate(value => window.qa.resolve(value), denied); await status.filter({ hasText: denied.message }).waitFor(); }
        await page.evaluate(() => { window.qa.removeFail = true; window.qa.saveFail = true; });
        page.once('dialog', dialog => dialog.accept());
        await (kind === 'images' ? form.getByRole('button', { name: 'Remove image', exact: true }) : page.getByRole('button', { name: 'Remove', exact: true })).click();
        await status.filter({ hasText: kind === 'images' ? 'Removal could not be confirmed' : 'Photo could not be removed' }).waitFor(); assert.equal(await input.evaluate(e => e.files.length), 1);
        await page.evaluate(() => { window.qa.removeFail = false; window.qa.saveFail = false; });
        page.once('dialog', dialog => dialog.accept());
        await (kind === 'images' ? form.getByRole('button', { name: 'Remove image', exact: true }) : page.getByRole('button', { name: 'Remove', exact: true })).click();
        await page.waitForFunction(id => document.getElementById(id).files.length === 0, await input.getAttribute('id'));
      }
      rows.push({ kind, width, screenshot: shot, calls: await page.evaluate(() => window.qa.calls.length), successCleared: true, failuresRetained: true });
      await context.close();
    }
    assert.deepEqual(errors, []);
  } catch (e) { failure = e.message; throw e; } finally {
    if (browser) await browser.close(); await new Promise(r => server.close(r));
    fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ rows, errors, failure, browserClosed: !browser?.isConnected(), serverClosed: !server.listening, noRealStorageOrActions: true }, null, 2)); console.log('Upload UI evidence: ' + out);
  }
});
