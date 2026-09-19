import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import sharp from 'sharp';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';
import { inflateSync } from 'node:zlib';
const externalRequire = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');

// Actual TypeScript modules; only external services/framework transport are synthetic.
function load(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = fs.readFileSync(filename, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} }; cache.set(filename, loaded);
  const localRequire = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (['sharp', 'react', 'react/jsx-runtime', 'lucide-react', '@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'].includes(name)) return externalRequire(name);
    if (name === 'next/image') return function Image(props) { const imageProps = { ...props }; delete imageProps.fill; delete imageProps.sizes; return React.createElement('img', imageProps); };
    if (name === 'next/link') return function Link(props) { return React.createElement('a', props); };
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : path.resolve(path.dirname(filename), name);
      const file = ['.ts', '.tsx'].map(ext => base + ext).find(file => fs.existsSync(file));
      if (!file) throw new Error(`Unresolved test import ${name}`);
      return load(path.relative(root, file), mocks, cache);
    }
    throw new Error(`Unmocked service import: ${name}`);
  };
  vm.runInNewContext(js, { module: loaded, exports: loaded.exports, require: localRequire, console: { log() {}, warn() {}, error() {} }, URL, File, FormData, Uint8Array, crypto: globalThis.crypto, confirm: () => true, process: { env: { ADMIN_EMAIL: 'operator@example.test', NEXT_PUBLIC_SITE_URL: 'https://kindlinecare.org', NEXT_PUBLIC_SUPABASE_URL: 'https://ellswjqkvfcgiaqjuvkn.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-only', RESEND_API_KEY: 'synthetic-only' } } }, { filename });
  return loaded.exports;
}
const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));
const pageProps = () => ({ params: Promise.resolve({}), searchParams: Promise.resolve({}) });

test('Next 16 encoded params round-trip public legacy news slugs once and never disclose drafts', async () => {
  const { getDynamicParam } = externalRequire('next/dist/shared/lib/router/utils/get-dynamic-param.js');
  const { getRouteMatcher } = externalRequire('next/dist/shared/lib/router/utils/route-matcher.js');
  const { getRouteRegex } = externalRequire('next/dist/shared/lib/router/utils/route-regex.js');
  const { newsPostPath } = load('src/lib/news-path.ts');
  let stored; let published = true; const queries = [];
  const Detail = load('src/app/news/[slug]/page.tsx', {
    '@/lib/prisma': { newsPost: { findFirst: async query => { queries.push(query); return published && query.where.published === true && query.where.slug.equals === stored ? { title: 'Synthetic article', category: 'Event', content: 'Synthetic public body', published: true, image: null } : null; } } },
    'next/navigation': { notFound: () => { throw new Error('NOT_FOUND'); } },
  }).default;
  const slugs = ['Example Programme (WESAP) INTRODUCED', 'plain-slug', 'Café & school #1?', 'literal%20value', '100% support', 'a/b', ' padded '];
  for (const slug of slugs) {
    stored = slug;
    const matched = getRouteMatcher(getRouteRegex('/news/[slug]'))(newsPostPath(slug));
    const actual = getDynamicParam(matched, 'slug', 'd', null, null).value;
    assert.equal(actual, encodeURIComponent(slug));
    if (slug.includes(' ')) assert.notEqual(actual.trim(), stored, 'old page queried encoded bytes rather than stored slug');
    const output = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: actual }), searchParams: Promise.resolve({}) }));
    assert.match(output, /Synthetic public body/);
    assert.equal(queries.at(-1).where.slug.equals, slug);
  }
  published = false;
  await assert.rejects(Detail({ params: Promise.resolve({ slug: encodeURIComponent(stored) }), searchParams: Promise.resolve({}) }), /NOT_FOUND/);
  const before = queries.length;
  for (const slug of ['%ZZ', '%00', '', 'x'.repeat(201)]) await assert.rejects(Detail({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) }), /NOT_FOUND/);
  assert.equal(queries.length, before);
});

test('actual News links and image-update invalidation encode the same single slug segment', async () => {
  const slug = 'Example event & support #1?';
  const expected = `/news/${encodeURIComponent(slug)}`;
  const News = load('src/app/news/page.tsx', { '@/lib/prisma': { newsPost: { findMany: async () => [{ id: 'synthetic', slug, title: 'Example', content: 'Example', category: 'Event', image: null, publishedAt: null }] } }, '@/components/NewsletterSubscribeForm': { NewsletterSubscribeForm: () => null } }).default;
  const html = renderToStaticMarkup(await News(pageProps()));
  assert.equal(html.split(`href="${expected}"`).length - 1, 2);
  const paths = [];
  const actions = load('src/app/admin/news/actions.ts', { '@/lib/auth-utils': { checkAdmin: async () => {} }, '@/lib/prisma': { newsPost: { update: async () => ({ slug, image: '/logo.png' }) } }, 'next/cache': { revalidatePath: value => paths.push(value) }, 'next/navigation': { redirect() {} } });
  await actions.updateNewsImage('synthetic', '/logo.png'); assert.ok(paths.includes(expected));
});

test('database-backed root layout stays dynamic and distinguishes absent, removed, saved and failed logo reads', async () => {
  let record; let failure = false; let reads = 0;
  const layout = load('src/app/layout.tsx', {
    './globals.css': {}, 'next/font/google': { Geist: () => ({ variable: 'sans' }), Geist_Mono: () => ({ variable: 'mono' }) },
    '@/components/Header': props => React.createElement('header', { 'data-logo': props.logoUrl ?? 'default' }),
    '@/components/Footer': () => null, '@/components/PrelineScript': () => null,
    '@/lib/prisma': { siteImage: { findUnique: async () => { reads++; if (failure) throw new Error('Synthetic unavailable database'); return record; } } },
  });
  assert.equal(layout.dynamic, 'force-dynamic');
  const show = async () => renderToStaticMarkup(await layout.default({ children: null, params: Promise.resolve({}) }));
  record = null; assert.match(await show(), /data-logo="default"/);
  record = { url: '' }; assert.match(await show(), /data-logo=""/);
  record = { url: '/logo.png' }; assert.match(await show(), /data-logo="\/logo.png"/);
  failure = true; assert.match(await show(), /data-logo=""/);
  failure = false; record = null; assert.match(await show(), /data-logo="default"/);
  assert.equal(reads, 5);
});

test('image defaults, tombstones and unavailable reads remain distinct', () => {
  const lib = load('src/lib/site-images.ts');
  assert.equal(lib.resolveSiteImage([], 'about_snapshot'), '/images/volunteers.jpg');
  assert.equal(lib.resolveSiteImage([{ key: 'about_snapshot', url: '', alt: null }], 'about_snapshot'), '');
  assert.equal(lib.resolveSiteImage(null, 'about_snapshot'), '');
  assert.equal(lib.resolveSiteImage([{ key: 'about_snapshot', url: '/images/new.png', alt: null }], 'about_snapshot'), '/images/new.png');
  for (const key of ['../logo', 'constructor', 'partner_bad']) assert.equal(lib.isSiteImageKey(key), false);
});

test('actual live Supabase role guard protects mutations without new DB User or tier dependencies', async () => {
  let user = null; let writes = 0;
  const actions = load('src/app/admin/images/actions.ts', {
    '@/utils/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user }, error: null }) } }) },
    '@/lib/prisma': { siteImage: { upsert: async () => { writes++; } } },
    'next/navigation': { redirect: value => { throw new Error(`redirect:${value}`); } },
    'next/cache': { revalidatePath() {} },
  });
  await assert.rejects(actions.removeSiteImage('about_snapshot'), /redirect/);
  for (const role of ['USER', 'FINANCIAL_ADMIN', 'VOLUNTEER_COORD']) {
    user = { email: 'example@example.test', app_metadata: { role } };
    await assert.rejects(actions.removeSiteImage('about_snapshot'), /redirect/);
  }
  assert.equal(writes, 0);
  for (const role of ['CONTENT_EDITOR', 'SUPER_ADMIN']) {
    // Live contract has no email-confirmation check; do not assert latest-main policy.
    user = { email: 'example@example.test', email_confirmed_at: null, app_metadata: { role } };
    await actions.removeSiteImage('about_snapshot');
  }
  user = { email: 'operator@example.test', app_metadata: { role: 'USER' } };
  await actions.removeSiteImage('about_snapshot');
  assert.equal(writes, 3);
  user = { email: 'example@example.test', app_metadata: { role: 'USER' } };
  await assert.rejects(actions.removeSiteImage('about_snapshot'), /redirect/);
  assert.equal(writes, 3);
});

test('site removal persists empty URL, revalidates layout and never deletes objects', async () => {
  const rows = new Map(); const paths = [];
  const actions = load('src/app/admin/images/actions.ts', {
    '@/lib/auth-utils': { checkAdmin: async level => assert.equal(level, 'CONTENT_EDITOR') },
    '@/lib/prisma': { siteImage: { upsert: async ({ where, update, create }) => rows.set(where.key, rows.has(where.key) ? update : create) } },
    'next/cache': { revalidatePath: (...args) => paths.push(args) },
  });
  await actions.removeSiteImage('about_snapshot'); assert.equal(rows.get('about_snapshot').url, '');
  await actions.updateSiteImage('about_snapshot', '/images/new.png', 'New'); assert.equal(rows.get('about_snapshot').url, '/images/new.png');
  await assert.rejects(actions.updateSiteImage('unknown', '/logo.png'));
  await assert.rejects(actions.updateSiteImage('logo', '/logo.png', 'x'.repeat(501)));
  assert.ok(paths.some(([path, type]) => path === '/' && type === 'layout'));
});

test('partners require explicit saved name/logo, empty collections and removed logos do not render', async () => {
  const key = 'partner_12345678-1234-4123-8123-123456789012';
  let saved;
  const actions = load('src/app/admin/images/actions.ts', { '@/lib/auth-utils': { checkAdmin: async () => {} }, '@/lib/prisma': { siteImage: { upsert: async args => { saved = args.create; } } }, 'next/cache': { revalidatePath() {} } });
  await assert.rejects(actions.updateSiteImage(key, '/logo.png', ''));
  await actions.updateSiteImage(key, '/logo.png', '<Example>');
  const { partnerLogos } = load('src/lib/site-images.ts');
  const Partners = load('src/components/PartnerLogos.tsx').default;
  assert.equal(render(Partners, { partners: [] }), '');
  assert.match(render(Partners, { partners: partnerLogos([saved]) }), /&lt;Example&gt;/);
  assert.match(render(Partners, { partners: partnerLogos([saved]) }), /object-contain/);
  assert.equal(partnerLogos([{ ...saved, url: '' }]).length, 0);
});

test('KL-S01 exact CSS injection and malformed/nonimage URLs reject before write; Hero screens old stored values', async () => {
  let writes = 0;
  const actions = load('src/app/admin/images/actions.ts', { '@/lib/auth-utils': { checkAdmin: async () => {} }, '@/lib/prisma': { siteImage: { upsert: async () => { writes++; } } }, 'next/cache': { revalidatePath() {} } });
  const { validateImageUrl, imageBackgroundStyle } = load('src/lib/image-validation.ts');
  const Hero = load('src/components/Hero.tsx').default;
  for (const value of ['/images/volunteers.jpg),url(https://review.invalid/probe', '/images/a.png\n', '/images/a%0a.png', '/images/a%29.png', '/images/a.png;red', '/api/payments', '/images/a.svg', '/images/../logo.png', '/images/a.png#x', '//review.invalid/x', '/\\review.invalid/x', 'https://user:pw@images.unsplash.com/photo-123', 'https://ellswjqkvfcgiaqjuvkn.supabase.co/auth/v1']) {
    assert.throws(() => validateImageUrl(value));
    await assert.rejects(actions.updateSiteImage('homepage_hero', value));
    assert.equal(imageBackgroundStyle(value), undefined);
    assert.doesNotMatch(render(Hero, { imageUrl: value }), /background-image/);
  }
  assert.equal(writes, 0);
  for (const value of ['/logo.png', '/images/volunteers.jpg', '/storage/site-images/example.webp?v=2', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80', 'https://ellswjqkvfcgiaqjuvkn.supabase.co/storage/v1/object/public/images/site-images/example.png']) {
    assert.equal(validateImageUrl(value), value);
    assert.equal(imageBackgroundStyle(value), `url(${JSON.stringify(value)})`);
    assert.match(render(Hero, { imageUrl: value }), /background-image:url\(&quot;/);
  }
});

function uploader() {
  const uploads = []; let denied = false;
  const actions = load('src/app/admin/images/actions.ts', {
    '@/lib/auth-utils': { checkAdmin: async () => { if (denied) throw new Error('Denied'); } }, '@/lib/prisma': {}, 'next/cache': {},
    '@supabase/supabase-js': { createClient: () => ({ storage: { from: bucket => { assert.equal(bucket, 'images'); return {
      upload: async (...args) => { uploads.push(args); return { error: null }; },
      getPublicUrl: name => ({ data: { publicUrl: `https://ellswjqkvfcgiaqjuvkn.supabase.co/storage/v1/object/public/images/${name}` } }),
    }; } } }) },
  });
  return { uploads, deny: () => { denied = true; }, send: (bytes, type) => { const form = new FormData(); form.set('file', new File([bytes], 'synthetic.html', { type })); return actions.uploadImage(form); } };
}

test('KL-S02 real PNG/JPEG/GIF/WebP pixels decode/re-encode before immutable typed storage upload', async () => {
  const { send, uploads, deny } = uploader();
  for (const format of ['png', 'jpeg', 'gif', 'webp']) {
    const fixture = await sharp({ create: { width: 8, height: 6, channels: 3, background: '#0077b6' } }).toFormat(format).toBuffer();
    assert.ok((await send(fixture, `image/${format}`)).endsWith(format === 'jpeg' ? '.jpg' : `.${format}`));
    const output = uploads.at(-1);
    assert.equal(output[2].upsert, false); assert.equal(output[2].contentType, `image/${format}`);
    const decoded = await sharp(output[1], { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
    assert.equal(decoded.info.width, 8); assert.equal(decoded.info.height, 6);
    const count = uploads.length;
    await assert.rejects(send(fixture.subarray(0, Math.floor(fixture.length / 2)), `image/${format}`));
    await assert.rejects(send(fixture.subarray(0, fixture.length - 1), `image/${format}`));
    await assert.rejects(send(Buffer.concat([fixture, Buffer.from('TRAILING-PAYLOAD')]), `image/${format}`));
    await assert.rejects(send(fixture, format === 'png' ? 'image/jpeg' : 'image/png'));
    assert.equal(uploads.length, count);
  }
  deny(); await assert.rejects(send(new Uint8Array([1]), 'image/png'), /Denied/); assert.equal(uploads.length, 4);
});

test('KL-S02 four header-only reports, size/dimension/pixel bounds and animation reject with zero storage writes', async () => {
  const { send, uploads } = uploader();
  for (const [mime, bytes] of [['image/png', [137,80,78,71,13,10,26,10]], ['image/jpeg', [255,216,255]], ['image/gif', [71,73,70,56,57,97]], ['image/webp', [82,73,70,70,0,0,0,0,87,69,66,80]]]) await assert.rejects(send(Uint8Array.from(bytes), mime));
  for (const [width, height] of [[8193, 1], [5000, 5000]]) {
    const fixture = await sharp({ create: { width, height, channels: 3, background: '#0077b6' } }).png().toBuffer();
    await assert.rejects(send(fixture, 'image/png'));
  }
  const frames = Buffer.from([255,0,0, 255,0,0, 255,0,0, 255,0,0, 0,0,255, 0,0,255, 0,0,255, 0,0,255]);
  const animated = await sharp(frames, { raw: { width: 2, height: 4, pageHeight: 2, channels: 3 } }).gif({ delay: [100,100] }).toBuffer();
  assert.equal((await sharp(animated).metadata()).pages, 2);
  await assert.rejects(send(animated, 'image/gif'));
  await assert.rejects(send(new Uint8Array(5 * 1024 * 1024 + 1), 'image/png'));
  assert.equal(uploads.length, 0);
});

test('KL-S02-APNG rejects genuine two-frame animation and each APNG chunk before storage; static PNG still succeeds', async () => {
  const crc32 = bytes => {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const chunk = (name, data) => {
    const type = Buffer.from(name); const out = Buffer.alloc(data.length + 12);
    out.writeUInt32BE(data.length); type.copy(out, 4); data.copy(out, 8);
    out.writeUInt32BE(crc32(Buffer.concat([type, data])), data.length + 8);
    return out;
  };
  const chunks = bytes => {
    const result = [];
    for (let offset = 8; offset < bytes.length;) {
      const length = bytes.readUInt32BE(offset);
      assert.ok(offset + length + 12 <= bytes.length);
      assert.equal(bytes.readUInt32BE(offset + length + 8), crc32(bytes.subarray(offset + 4, offset + length + 8)));
      result.push({ name: bytes.toString('ascii', offset + 4, offset + 8), data: bytes.subarray(offset + 8, offset + 8 + length) });
      offset += length + 12;
    }
    return result;
  };
  const encode = background => sharp({ create: { width: 2, height: 2, channels: 4, background } }).png().toBuffer();
  const staticPng = await encode('#ff0000');
  const red = chunks(staticPng); const blue = chunks(await encode('#0000ff'));
  const animation = Buffer.alloc(8); animation.writeUInt32BE(2);
  const control = sequence => {
    const data = Buffer.alloc(26); data.writeUInt32BE(sequence); data.writeUInt32BE(2, 4); data.writeUInt32BE(2, 8);
    data.writeUInt16BE(1, 20); data.writeUInt16BE(10, 22); return data;
  };
  const firstData = Buffer.concat(red.filter(c => c.name === 'IDAT').map(c => c.data));
  const secondData = Buffer.concat(blue.filter(c => c.name === 'IDAT').map(c => c.data));
  const frameData = Buffer.concat([Buffer.from([0, 0, 0, 2]), secondData]);
  const apng = Buffer.concat([staticPng.subarray(0, 8), chunk('IHDR', red.find(c => c.name === 'IHDR').data),
    chunk('acTL', animation), chunk('fcTL', control(0)), chunk('IDAT', firstData),
    chunk('fcTL', control(1)), chunk('fdAT', frameData), chunk('IEND', Buffer.alloc(0))]);
  const parsed = chunks(apng);
  assert.equal(parsed.find(c => c.name === 'acTL').data.readUInt32BE(0), 2);
  assert.deepEqual(parsed.filter(c => c.name === 'fcTL' || c.name === 'fdAT').map(c => c.data.readUInt32BE(0)), [0, 1, 2]);
  assert.equal(inflateSync(firstData).length, 18); assert.equal(inflateSync(secondData).length, 18);
  assert.notDeepEqual(inflateSync(firstData), inflateSync(secondData));
  const { send, uploads } = uploader();
  await assert.rejects(send(apng, 'image/png'), /non-animated|animation/i);
  assert.equal(uploads.length, 0);
  // Independently trip each type, including controls after IDAT rather than only before it.
  for (const [name, data] of [['acTL', animation], ['fcTL', control(0)], ['fdAT', frameData]]) {
    const injected = Buffer.concat([staticPng.subarray(0, -12), chunk(name, data), staticPng.subarray(-12)]);
    chunks(injected);
    await assert.rejects(send(injected, 'image/png'), /non-animated|animation/i);
    assert.equal(uploads.length, 0);
  }
  assert.match(await send(staticPng, 'image/png'), /\.png$/);
  assert.equal(uploads.length, 1);
  const output = await sharp(uploads[0][1], { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
  assert.equal(output.info.width, 2); assert.equal(output.info.height, 2);
});

test('actual news image-only save/removal keeps other fields and invalidates list/detail/editor', async () => {
  const calls = []; const paths = [];
  const actions = load('src/app/admin/news/actions.ts', { '@/lib/auth-utils': { checkAdmin: async level => assert.equal(level, 'CONTENT_EDITOR') }, '@/lib/prisma': { newsPost: { update: async args => { calls.push(args); return { image: args.data.image, slug: 'example' }; } } }, 'next/cache': { revalidatePath: path => paths.push(path) }, 'next/navigation': { redirect() {} } });
  await actions.updateNewsImage('example', '/images/new.png');
  assert.deepEqual(Object.keys(calls[0].data), ['image']); assert.equal(calls[0].data.image, '/images/new.png');
  await actions.updateNewsImage('example', ''); assert.equal(calls[1].data.image, null);
  for (const path of ['/news', '/news/example', '/admin/news', '/admin/news/edit/example']) assert.ok(paths.includes(path));
  await assert.rejects(actions.updateNewsImage('example', '//review.invalid/x')); assert.equal(calls.length, 2);
});

test('live news create/update retain original length and publication rules while validating image URLs', async () => {
  const writes = [];
  const actions = load('src/app/admin/news/actions.ts', { '@/lib/auth-utils': { checkAdmin: async () => {} }, '@/lib/prisma': { newsPost: { create: async value => writes.push(value), findUnique: async () => ({ published: true, publishedAt: new Date('2026-01-01'), slug: 'old' }), update: async value => writes.push(value) } }, 'next/cache': { revalidatePath() {} }, 'next/navigation': { redirect() {} } });
  const data = { title: 'Example', slug: 'example', category: 'Event', excerpt: 'Example', content: 'Example', image: '/logo.png', published: true };
  await actions.createNewsPost(data); assert.equal(writes[0].data.image, '/logo.png'); assert.ok(writes[0].data.publishedAt);
  await actions.updateNewsPost('example', { ...data, image: '', published: false }); assert.equal(writes[1].data.image, null); assert.equal(writes[1].data.publishedAt, null);
  for (const mutation of [{ title: 'x'.repeat(201) }, { content: 'x'.repeat(20001) }, { image: '/api/private' }]) await assert.rejects(actions.createNewsPost({ ...data, ...mutation }));
  assert.equal(writes.length, 2);
});

test('email formatter preserves paragraphs/newlines and rebuilds safe HTML with larger real-logo branding', () => {
  const { renderCommunicationEmail, formatEmailContent } = load('src/lib/email-template.ts');
  const output = renderCommunicationEmail('Hello\nFriends\n\nAnother paragraph\nhttps://kindlinecare.org/get-involved');
  assert.match(output.html, /Hello<br>Friends/); assert.match(output.html, /<p[^>]*>Another paragraph/); assert.match(output.html, /width="200"/);
  assert.match(output.html, /Kindline Care Foundation \| Lusaka, Zambia/); assert.doesNotMatch(output.html, /Kindline Care Organi[sz]ation/); assert.match(output.text, /Hello\nFriends/);
  assert.doesNotMatch(renderCommunicationEmail('Example', undefined, '').html, /<img/);
  assert.match(formatEmailContent('<h2>Heading</h2><p>Care &amp; kindness<br>Next</p>'), /Care &amp; kindness<br>Next/);
  for (const href of ['javascript:alert(1)', 'jav&#x61;script:alert(1)', 'java&#10;script:alert(1)', 'data:text/html,bad', 'file:///tmp/example', '//review.invalid/x']) assert.doesNotMatch(formatEmailContent(`<p><a href="${href}" onclick="bad()">Hello</a></p>`), /href=|onclick=/);
  assert.doesNotMatch(formatEmailContent('<p><img src=x onerror=bad()><svg><script>bad()</script></svg><iframe src=x></iframe></p>'), /<img|<svg|<script|<iframe|onerror=/);
});

test('actual live-base manual/newsletter sender uses safe template/BCC with no tier lookup', async () => {
  const sent = []; let error = null;
  class Resend { emails = { send: async value => { sent.push(value); return { error }; } }; }
  const mocks = { '@/lib/prisma': { siteImage: { findUnique: async () => ({ url: '/logo.png' }) }, subscriber: { findMany: async () => [{ email: 'one@example.test' }, { email: 'two@example.test' }] } }, resend: { Resend }, '@/lib/auth-utils': { checkAdmin: async () => {} }, 'next/cache': { revalidatePath() {} } };
  const mail = load('src/lib/email.ts', mocks);
  assert.equal((await mail.sendCommunicationEmail('recipient@example.test', 'Example', 'One\n\nTwo')).success, true);
  const action = load('src/app/admin/newsletter/actions.ts', mocks);
  const form = new FormData(); form.set('subject', 'Example'); form.set('content', 'One\nTwo');
  await action.sendNewsletter(form);
  assert.equal(sent[1].bcc.length, 2); assert.equal(sent[1].to, 'Kindline Care <updates@kindlinecare.org>'); assert.match(sent[1].html, /One<br>Two/); assert.ok(sent[1].text);
  form.set('subject', 'x'.repeat(201)); await assert.rejects(action.sendNewsletter(form)); assert.equal(sent.length, 2);
  form.set('subject', 'Example'); form.set('content', 'x'.repeat(20001)); await assert.rejects(action.sendNewsletter(form)); assert.equal(sent.length, 2);
  form.set('content', 'Example'); error = { message: 'synthetic failure' }; await assert.rejects(action.sendNewsletter(form), /could not be sent/);
  assert.equal((await mail.sendCommunicationEmail('recipient@example.test', 'Example', 'One')).success, false);
});

test('actual Home/About/Contact/Footer remove obsolete block/service wording and cleared photo', async () => {
  const mocks = { '@/lib/prisma': { siteImage: { findMany: async () => [{ key: 'about_snapshot', url: '', alt: null }] }, impactStat: { findMany: async () => [] }, impactStory: { findMany: async () => [] } }, '@/app/admin/newsletter/actions': { subscribe: async () => {} }, '@/components/ImpactSnapshot': () => null };
  for (const file of ['src/app/page.tsx', 'src/app/about/page.tsx']) {
    const html = renderToStaticMarkup(await load(file, mocks).default(pageProps()));
    assert.doesNotMatch(html, /volunteers\.jpg|partnerships@|Partnerships &amp; Donations|10 Miles/);
  }
  const Contact = load('src/app/contact/page.tsx', { './actions': { submitContactForm: async () => ({ success: true }) } }).default;
  for (const html of [render(Contact), render(load('src/components/Footer.tsx').default, { logoUrl: '' })]) {
    assert.match(html, /Chibombo District, Central Province/); assert.match(html, /info@kindlinecare\.org/); assert.doesNotMatch(html, /10 Miles|partnerships@/);
  }
});

test('actual News switches placeholder to saved image', async () => {
  let image = null;
  const News = load('src/app/news/page.tsx', { '@/lib/prisma': { newsPost: { findMany: async () => [{ id: 'example', slug: 'example', title: 'Example event', content: 'Example', excerpt: '', category: 'Event', image, publishedAt: null }] } }, '@/components/NewsletterSubscribeForm': { NewsletterSubscribeForm: () => null } }).default;
  assert.doesNotMatch(renderToStaticMarkup(await News(pageProps())), /<img/);
  image = '/images/new.png'; assert.match(renderToStaticMarkup(await News(pageProps())), /<img[^>]+src="\/images\/new.png"/);
});

test('five currencies have small suggestions and custom decimal validation; live monthly choice remains ungated', () => {
  const lib = load('src/lib/donation-options.ts');
  assert.equal(lib.DONATION_SUGGESTIONS.join(','), '10,20,30'); assert.equal(lib.DONATION_CURRENCIES.length, 5);
  for (const currency of lib.DONATION_CURRENCIES) for (const amount of lib.DONATION_SUGGESTIONS) assert.equal(lib.donationAmountLabel(currency, amount), currency === 'ZMW' ? `K${amount}` : `${currency} ${amount}`);
  for (const value of ['10', '20', '30', '12.50', '0.50']) assert.equal(lib.isPositiveDonationAmount(value), true);
  for (const value of ['', '0', '-1', 'NaN', 'Infinity', '1e5', '10x', '1.234']) assert.equal(lib.isPositiveDonationAmount(value), false);
  const Donation = load('src/components/DonationForm.tsx', { '@/utils/supabase/client': { createClient: () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }) } }).default;
  const html = render(Donation, { settings: {} });
  assert.match(html, /K10/); assert.match(html, /K20/); assert.match(html, /K30/); assert.match(html, /not fixed donation levels/); assert.match(html, /Monthly/); assert.doesNotMatch(html, /PRO|Upgrade/);
});

function hooks() {
  const state = []; let cursor = 0;
  return { react: { ...React, useState: initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], next => { state[i] = typeof next === 'function' ? next(state[i]) : next; }]; }, useRef: initial => { const i = cursor++; if (!(i in state)) state[i] = { current: initial }; return state[i]; } }, reset: () => { state.length = 0; }, render: (component, props) => { cursor = 0; return component(props); } };
}
function elements(tree, predicate, out = []) {
  if (!tree || typeof tree !== 'object') return out;
  if (Array.isArray(tree)) { tree.forEach(item => elements(item, predicate, out)); return out; }
  if (predicate(tree)) out.push(tree);
  elements(tree.props?.children, predicate, out); return out;
}

test('KL-F01/QA-01 successful Save/Remove clears file state/input; failures preserve retry selection', async () => {
  const parent = hooks(); const child = hooks(); let uploads = 0; let failSave = false; let failRemove = false; const updates = [];
  const Manager = load('src/app/admin/images/ImageManager.tsx', { react: parent.react, './actions': { uploadImage: async () => `/images/upload-${++uploads}.png`, updateSiteImage: async (...args) => { if (failSave) throw new Error('Synthetic save failure'); updates.push(args); }, removeSiteImage: async () => { if (failRemove) throw new Error('Synthetic remove failure'); } } }).default;
  const childModule = load('src/app/admin/images/ImageManager.tsx', { react: child.react, './actions': {} });
  const Card = elements(child.render(childModule.default, { initialImages: [] }), el => el.props?.item?.key === 'about_snapshot')[0].type; child.reset();
  let card; let rendered;
  const rerender = () => { card = elements(parent.render(Manager, { initialImages: [] }), el => el.props?.item?.key === 'about_snapshot')[0]; rendered = child.render(Card, card.props); };
  const chooser = () => elements(rendered, el => el.type === 'input' && el.props.type === 'file')[0];
  const submit = () => elements(rendered, el => el.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  const remove = () => elements(rendered, el => el.type === 'button' && el.props.type === 'button')[0].props.onClick();
  const file = new File(['hook fixture only'], 'selected.png', { type: 'image/png' }); const dom = { value: '' };
  const select = () => { chooser().props.ref.current = dom; dom.value = 'C:\\fakepath\\selected.png'; chooser().props.onChange({ target: { files: [file] } }); rerender(); };
  rerender(); select(); await submit(); rerender(); assert.equal(uploads, 1); assert.equal(dom.value, ''); assert.doesNotMatch(renderToStaticMarkup(rendered), /Selected:/);
  elements(rendered, el => el.type === 'input' && !el.props.type)[0].props.onChange({ target: { value: 'Description only' } }); rerender(); await submit(); rerender(); assert.equal(uploads, 1); assert.equal(updates.at(-1)[2], 'Description only');
  select(); failSave = true; await submit(); rerender(); assert.notEqual(dom.value, ''); assert.match(renderToStaticMarkup(rendered), /Selected:/);
  failRemove = true; await remove(); rerender(); assert.notEqual(dom.value, '');
  failSave = false; failRemove = false; await remove(); rerender(); assert.equal(dom.value, ''); assert.doesNotMatch(renderToStaticMarkup(rendered), /Selected:/);
  assert.equal(elements(rendered, el => el.type === 'button' && el.props.type === 'submit')[0].props.disabled, true);
  select(); await submit(); rerender(); assert.equal(dom.value, '');
});
