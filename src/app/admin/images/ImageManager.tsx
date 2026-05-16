'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { updateSiteImage, uploadImage } from './actions';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SiteImage {
  id: string;
  key: string;
  url: string;
  alt: string | null;
}

interface ImageCardProps {
  item: { key: string; label: string };
  existing: SiteImage | undefined;
  uploading: boolean;
  onUpload: (key: string, file: File, alt: string) => Promise<void>;
}

function ImageCard({ item, existing, uploading, onUpload }: ImageCardProps) {
  const [alt, setAlt] = useState(existing?.alt || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{item.label}</CardTitle>
        <code className="text-xs text-gray-400 font-mono">{item.key}</code>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Upload New Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await onUpload(item.key, file, alt);
                  }
                }}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {uploading && <Loader2 className="animate-spin text-blue-600" size={20} />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Alt Text</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description for accessibility"
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>

        {existing?.url && (
          <div className="mt-4 aspect-video relative bg-gray-100 rounded-lg overflow-hidden border group">
            <Image
              src={existing.url}
              alt={existing.alt || ''}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white text-xs font-mono truncate px-4">{existing.url}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ImageManager({ initialImages }: { initialImages: SiteImage[] }) {
  const [images, setImages] = useState<SiteImage[]>(initialImages);
  const [uploading, setUploading] = useState<string | null>(null);

  const imageKeys = [
    { key: 'logo', label: 'Organization Logo' },
    { key: 'homepage_hero', label: 'Homepage Hero Image' },
    { key: 'about_snapshot', label: 'About Section Image' },
    { key: 'donation_hero', label: 'Donation Page Hero' },
    { key: 'child_development', label: 'Child Development Section' },
    { key: 'wesap_group', label: 'WESAP Group Photo' },
    { key: 'volunteers_action', label: 'Volunteers in Action' },
    { key: 'volunteer_action', label: 'Volunteer Page Feature Image' },
  ];

  const handleUpload = async (key: string, file: File, alt: string) => {
    try {
      setUploading(key);
      const formData = new FormData();
      formData.append('file', file);

      const publicUrl = await uploadImage(formData);
      await updateSiteImage(key, publicUrl, alt);

      // Update local state
      setImages(prev => {
        const filtered = prev.filter(img => img.key !== key);
        return [...filtered, { id: Date.now().toString(), key, url: publicUrl, alt }];
      });

      alert('Image updated successfully!');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to update image.');
      }
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Manage Website Images</h1>
      <p className="text-gray-600">Upload images directly to Supabase storage to be used across the site.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {imageKeys.map((item) => (
          <ImageCard
            key={item.key}
            item={item}
            existing={images.find(img => img.key === item.key)}
            uploading={uploading === item.key}
            onUpload={handleUpload}
          />
        ))}
      </div>
    </div>
  );
}
