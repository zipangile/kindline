'use client';

import { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { updateSiteImage, removeSiteImage, uploadImage } from './actions';
import { SITE_IMAGE_SLOTS, PARTNER_KEY, resolveSiteImage } from '@/lib/site-images';
import { IMAGE_ACCEPT } from '@/lib/image-validation';
import Image from 'next/image';

interface SiteImage { id: string; key: string; url: string; alt: string | null }

function ImageCard({ item, images, busy, message, save, remove }: {
  item: { key: string; label: string }; images: SiteImage[]; busy: boolean; message?: string;
  save: (key: string, file: File | undefined, alt: string) => Promise<boolean>;
  remove: (key: string) => Promise<boolean>;
}) {
  const saved = images.find(image => image.key === item.key);
  const [alt, setAlt] = useState(saved?.alt ?? '');
  const [file, setFile] = useState<File>();
  const fileInput = useRef<HTMLInputElement>(null);
  const clearFile = () => {
    setFile(undefined);
    if (fileInput.current) fileInput.current.value = '';
  };
  const url = resolveSiteImage(images, item.key);
  const partner = PARTNER_KEY.test(item.key);
  return <Card>
    <CardHeader><CardTitle className="text-lg">{item.label}</CardTitle></CardHeader>
    <CardContent>
      <form className="space-y-4" onSubmit={async e => { e.preventDefault(); if (await save(item.key, file, alt)) clearFile(); }}>
        <label className="block text-sm font-medium" htmlFor={`${item.key}-file`}>Choose image (non-animated JPG, PNG, WEBP or GIF; up to 5 MB, 8192 pixels per side, 24 megapixels)</label>
        <input ref={fileInput} id={`${item.key}-file`} type="file" accept={IMAGE_ACCEPT} disabled={busy} aria-describedby={`${item.key}-status`} onChange={e => setFile(e.target.files?.[0])} className="block w-full text-sm" />
        <label className="block text-sm font-medium" htmlFor={`${item.key}-alt`}>{partner ? 'Partner name (public)' : 'Image description'}</label>
        <input id={`${item.key}-alt`} required={partner} maxLength={500} value={alt} onChange={e => setAlt(e.target.value)} className="w-full rounded border p-2" />
        {url ? <div className="relative h-48 rounded-lg border bg-gray-50"><Image src={url} alt={saved?.alt ?? item.label} fill sizes="(max-width: 768px) 90vw, 480px" className={partner ? 'object-contain p-4' : 'object-cover'} /></div> : <p className="text-sm text-gray-500">No image displayed.</p>}
        {file && <p className="break-words text-sm">Selected: {file.name}. Save to upload and publish this image.</p>}
        <p id={`${item.key}-status`} role="status" className="break-words text-sm font-medium">{message}</p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy || (!file && !url)} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save image & description'}</button>
          <button type="button" disabled={busy || (!url && !partner)} onClick={async () => { if (confirm('Remove this image from the website? The stored file will not be deleted.') && await remove(item.key)) clearFile(); }} className="rounded border px-4 py-2 text-red-700 disabled:opacity-50">{partner && !url ? 'Discard partner' : 'Remove image'}</button>
        </div>
      </form>
    </CardContent>
  </Card>;
}

export default function ImageManager({ initialImages }: { initialImages: SiteImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const setMessage = (key: string, message: string) => setMessages(previous => ({ ...previous, [key]: message }));
  const [draftKeys, setDraftKeys] = useState<string[]>([]);
  const partnerKeys = [...new Set([...images.filter(image => PARTNER_KEY.test(image.key) && image.url).map(image => image.key), ...draftKeys])];
  const save = async (key: string, file: File | undefined, alt: string) => {
    setBusy(true); setMessage(key, 'Saving…');
    let uploaded = false;
    try {
      let url = resolveSiteImage(images, key);
      if (file) {
        const data = new FormData(); data.set('file', file);
        const result = await uploadImage(data);
        if (!result.ok) { setMessage(key, result.message); return false; }
        url = result.url; uploaded = true;
      }
      await updateSiteImage(key, url, alt);
      setImages(previous => [...previous.filter(image => image.key !== key), { id: key, key, url, alt }]);
      setMessage(key, 'Saved. The website now uses this image.');
      return true;
    } catch { setMessage(key, uploaded ? 'The file uploaded, but saving it to the website could not be confirmed. Contact the site administrator before retrying.' : 'Saving could not be confirmed. Check your sign-in and contact the site administrator before retrying.'); return false; }
    finally { setBusy(false); }
  };
  const remove = async (key: string) => {
    setBusy(true); setMessage(key, 'Removing…');
    try {
      await removeSiteImage(key);
      setImages(previous => [...previous.filter(image => image.key !== key), { id: key, key, url: '', alt: null }]);
      setDraftKeys(previous => previous.filter(value => value !== key));
      setMessage(key, 'Removed from the website. No stored media files were deleted.');
      return true;
    } catch { setMessage(key, 'Removal could not be confirmed. Check your sign-in and contact the site administrator before retrying.'); return false; }
    finally { setBusy(false); }
  };
  return <div className="space-y-8">
    <h1 className="text-2xl font-bold">Manage Website Images</h1>
    <p>Choose a file, then save. Remove hides the photo without restoring the default or deleting the stored file.</p>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{SITE_IMAGE_SLOTS.map(item => <ImageCard key={item.key} item={item} images={images} busy={busy} message={messages[item.key]} save={save} remove={remove} />)}</div>
    <section id="partners" className="space-y-6">
      <h2 className="text-2xl font-bold">Partner logos</h2>
      <p>Add only partners whose name and logo you are authorised to publish. Saved logos appear on the homepage; no partners are added automatically.</p>
      <button type="button" disabled={busy} onClick={() => setDraftKeys(previous => [...previous, `partner_${crypto.randomUUID()}`])} className="rounded bg-blue-700 px-4 py-2 text-white">Add partner logo</button>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{partnerKeys.map(key => <ImageCard key={key} item={{ key, label: 'Partner logo' }} images={images} busy={busy} message={messages[key]} save={save} remove={remove} />)}</div>
    </section>
  </div>;
}
