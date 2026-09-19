import Image from 'next/image';
import type { SiteImageRecord } from '@/lib/site-images';

export default function PartnerLogos({ partners }: { partners: SiteImageRecord[] }) {
  if (!partners.length) return null;
  return (
    <section className="bg-gray-50 py-16" aria-labelledby="partner-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="partner-heading" className="mb-10 text-center text-3xl font-bold text-gray-900">Our Partners</h2>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map(partner => (
            <li key={partner.key} className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <div className="relative h-24"><Image src={partner.url} alt={partner.alt ?? ''} fill sizes="(max-width: 640px) 40vw, 240px" className="object-contain" /></div>
              <p className="mt-4 break-words text-sm font-semibold text-gray-700">{partner.alt}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
