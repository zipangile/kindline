import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const root = path.resolve(import.meta.dirname, '..'), require = createRequire(import.meta.url);
const ts = require('typescript'), sharp = require('sharp');
function fixture({ key = 'sb_secret_synthetic_only', denied = false, providerError = null, transportError = false } = {}) {
  const calls = [], logs = [], cache = new Map();
  function load(p) {
    p = path.normalize(p);
    if (cache.has(p)) return cache.get(p).exports;
    const mod = { exports: {} }; cache.set(p, mod);
    const code = ts.transpileModule(fs.readFileSync(path.join(root, p), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { module: mod, exports: mod.exports, Buffer, File, FormData, Uint8Array, URL, crypto: globalThis.crypto,
      process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://ellswjqkvfcgiaqjuvkn.supabase.co', SUPABASE_SERVICE_ROLE_KEY: key } },
      console: { error: (...a) => logs.push(a), warn: (...a) => logs.push(a) }, require: n => {
        if (n === 'sharp') return sharp;
        if (n === '@/lib/prisma' || n === 'next/cache') return {};
        if (n === '@/lib/auth-utils') return { checkAdmin: async level => { assert.equal(level, 'CONTENT_EDITOR'); if (denied) throw new Error('AUTH_REDIRECT'); } };
        if (n === '@supabase/supabase-js') return { createClient: (_url, actualKey, options) => { assert.equal(actualKey, key); assert.equal(options.auth.persistSession, false); return { storage: { from: bucket => { assert.equal(bucket, 'images'); return {
          upload: async (...args) => { calls.push(args); if (transportError) throw new Error('PRIVATE_PROVIDER_CANARY'); return { error: providerError }; },
          getPublicUrl: p => ({ data: { publicUrl: `https://ellswjqkvfcgiaqjuvkn.supabase.co/storage/v1/object/public/images/${p}` } }),
        }; } } }; } };
        if (n.startsWith('@/') || n.startsWith('.')) return load((n.startsWith('@/') ? 'src/' + n.slice(2) : path.join(path.dirname(p), n)) + '.ts');
        throw Error('Unmocked service ' + n);
      } }, { filename: p });
    return mod.exports;
  }
  const action = load('src/app/admin/images/actions.ts');
  return { load, calls, logs, send: bytes => { const f = new FormData(); f.set('file', new File([bytes], 'fixture.png', { type: 'image/png' })); return action.uploadImage(f); }, action };
}
function pixels(dim, channels = 3, palette = false) {
  const b = Buffer.alloc(dim * dim * channels); let s = 0x197921;
  for (let i = 0; i < b.length; i += channels) { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; const v = s >>> 0;
    b[i] = v & 255; b[i + 1] = palette ? ((v & 255) * 73) & 255 : (v >>> 8) & 255; b[i + 2] = palette ? ((v & 255) * 151) & 255 : (v >>> 16) & 255;
    if (channels === 4) b[i + 3] = palette ? v & 255 : (v >>> 24) & 255;
  } return b;
}
const decoded = bytes => sharp(bytes).toColourspace('srgb').ensureAlpha().raw().toBuffer();

test('indexed PNGs formerly expanded over cap now pass with every colour/alpha byte preserved', async () => {
  for (const [dim, channels] of [[1500, 3], [1800, 3], [2000, 4]]) {
    const raw = pixels(dim, channels, true);
    if (channels === 4) for (let i = 3; i < raw.length; i += 4) raw[i] = 128;
    const image = await sharp(raw, { raw: { width: dim, height: dim, channels } }).png({ palette: true, colours: 256, dither: 0 }).toBuffer();
    const meta = await sharp(image).metadata(); assert.equal(meta.isPalette, true); assert.ok(image.length < 5242880);
    if (channels === 3) assert.equal(image.length, dim === 1500 ? 2256342 : 3248394, 'exact reported regression fixture');
    const unpacked = await sharp(image).toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    const old = await sharp(unpacked.data, { raw: { width: dim, height: dim, channels: unpacked.info.channels } }).png().toBuffer();
    assert.ok(old.length > 5242880, `old implementation must reproduce output overflow: ${dim}/${channels} input=${image.length} output=${old.length}`);
    const f = fixture(); const result = await f.send(image); assert.equal(result.ok, true); assert.equal(f.calls.length, 1);
    const output = f.calls[0]; assert.ok(output[1].length <= 5242880); assert.equal(output[2].contentType, 'image/png'); assert.equal(output[2].upsert, false);
    assert.deepEqual(await decoded(output[1]), await decoded(image));
  }
});

test('genuine 1–5MiB PNG/JPEG/WebP and transparent static GIF still decode and upload', async () => {
  const f = fixture();
  for (const [format, dims, options] of [['png', [650, 1020, 1300], {}], ['jpeg', [1100, 1700, 2230], { quality: 95 }], ['webp', [1150, 1800, 2420], { quality: 90 }]]) {
    for (const dim of dims) {
      const bytes = await sharp(pixels(dim), { raw: { width: dim, height: dim, channels: 3 } }).toFormat(format, options).toBuffer();
      assert.ok(bytes.length > 1048576 && bytes.length <= 5242880);
      const form = new FormData(); form.set('file', new File([bytes], 'fixture.' + format, { type: 'image/' + format }));
      const result = await f.action.uploadImage(form); assert.equal(result.ok, true);
      const output = f.calls.at(-1); assert.ok(output[1].length <= 5242880); assert.equal(output[2].contentType, 'image/' + format);
      const decoded = await sharp(output[1], { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
      assert.equal(decoded.info.width, dim); assert.equal(decoded.info.height, dim);
    }
  }
  const raw = Buffer.from([255,0,0,0, 0,255,0,128, 0,0,255,255, 255,0,0,0]);
  for (const format of ['png', 'gif']) {
    const bytes = await sharp(raw, { raw: { width: 2, height: 2, channels: 4 } }).toFormat(format, format === 'png' ? { palette: true } : {}).toBuffer();
    const form = new FormData(); form.set('file', new File([bytes], 'alpha.' + format, { type: 'image/' + format }));
    assert.equal((await f.action.uploadImage(form)).ok, true);
    assert.deepEqual(await decoded(f.calls.at(-1)[1]), await decoded(bytes), 'original decoded colours including transparent pixels');
  }
  assert.equal(new Set(f.calls.map(call => call[0])).size, f.calls.length, 'unique immutable storage names');
});

test('RGB and RGBA PNGs retain lossless pixels; full-colour processed overflow returns exact safe size', async () => {
  for (const channels of [3, 4]) {
    const image = await sharp(pixels(700, channels), { raw: { width: 700, height: 700, channels } }).png().toBuffer();
    const f = fixture(); assert.equal((await f.send(image)).ok, true); assert.deepEqual(await decoded(f.calls[0][1]), await decoded(image));
  }
  // Efficient full-colour encoding can expand under default output settings, without being indexed.
  const dim = 2000, raw = pixels(dim, 3, true);
  const image = await sharp(raw, { raw: { width: dim, height: dim, channels: 3 } }).toColourspace('b-w').png().toBuffer();
  const f = fixture();
  assert.ok(image.length <= 5242880, `compressed input bytes ${image.length}`);
  const result = await f.send(image);
  assert.equal(result.ok, false); assert.equal(result.code, 'OUTPUT_TOO_LARGE'); assert.match(result.message, /Processed size: \d+ bytes/); assert.equal(f.calls.length, 0);
});

test('configuration shape is not authentication; malformed/public/wrong-role credentials never reach storage', async () => {
  const png = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#0071bc80' } }).png().toBuffer();
  const jwt = role => [Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url'), Buffer.from(JSON.stringify({ role })).toString('base64url'), 'synthetic_signature'].join('.');
  for (const key of ['', 'synthetic-only', 'Bearer sb_secret_synthetic', 'sb_publishable_synthetic', 'sb_secret_synthetic\n', '"sb_secret_synthetic"', jwt('anon'), jwt('authenticated'), 'a.b.c']) {
    const f = fixture({ key }); const result = await f.send(png); assert.equal(result.ok, false); assert.equal(result.code, 'STORAGE_CONFIG'); assert.equal(f.calls.length, 0); assert.deepEqual(f.logs, []); assert.ok(!JSON.stringify(result).includes(key) || !key);
  }
  for (const key of ['sb_secret_synthetic_only', jwt('service_role')]) { const f = fixture({ key }); assert.equal((await f.send(png)).ok, true); }
  const f = fixture({ denied: true, key: '' }); await assert.rejects(f.send(png), /AUTH_REDIRECT/); assert.equal(f.calls.length, 0);
});

test('storage 400/403, bucket and transport failures return fixed safe results without provider/credential logs', async () => {
  const png = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#0071bc' } }).png().toBuffer();
  for (const [providerError, expected] of [[{ statusCode: '403', message: 'PRIVATE_PROVIDER_CANARY' }, 'STORAGE_AUTH'], [{ statusCode: '400', message: 'InvalidCompactJWS PRIVATE_PROVIDER_CANARY' }, 'STORAGE_AUTH'], [{ statusCode: '404', message: 'Bucket not found PRIVATE_PROVIDER_CANARY' }, 'STORAGE_UNAVAILABLE'], [{ statusCode: '413', message: 'PRIVATE_PROVIDER_CANARY' }, 'STORAGE_REJECTED']]) {
    const f = fixture({ providerError }); const result = await f.send(png); assert.equal(result.ok, false); assert.equal(result.code, expected); assert.doesNotMatch(JSON.stringify(result), /PRIVATE_PROVIDER|sb_secret|InvalidCompactJWS/); assert.deepEqual(f.logs, []);
  }
  const f = fixture({ transportError: true }); assert.equal((await f.send(png)).code, 'UPLOAD_FAILED'); assert.deepEqual(f.logs, []);
});

test('typed validation results retain input, dimensions, malformed and animation guards', async () => {
  const f = fixture(); assert.equal((await f.action.uploadImage(new FormData())).code, 'NO_FILE');
  assert.equal((await f.send(Buffer.alloc(5242881))).code, 'INPUT_TOO_LARGE');
  const bad = new FormData(); bad.set('file', new File(['<svg/>'], 'test.svg', { type: 'image/svg+xml' })); assert.equal((await f.action.uploadImage(bad)).code, 'UNSUPPORTED_TYPE');
  assert.equal((await f.send(Buffer.from([137,80,78,71,13,10,26,10]))).code, 'INVALID_IMAGE');
  const wide = await sharp({ create: { width: 8193, height: 1, channels: 3, background: 'white' } }).png().toBuffer(); assert.equal((await f.send(wide)).code, 'IMAGE_DIMENSIONS');
  assert.equal(f.calls.length, 0);
});
