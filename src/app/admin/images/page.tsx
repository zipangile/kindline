export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { updateSiteImage } from './actions';

export default async function AdminImagesPage() {
  const images = await prisma.siteImage.findMany();

  const imageKeys = [
    { key: 'homepage_hero', label: 'Homepage Hero Image' },
    { key: 'about_snapshot', label: 'About Section Image' },
    { key: 'donation_hero', label: 'Donation Page Hero' },
    { key: 'child_development', label: 'Child Development Section' },
    { key: 'wesap_group', label: 'WESAP Group Photo' },
    { key: 'volunteers_action', label: 'Volunteers in Action' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Manage Website Images</h1>
      <p className="text-gray-600">Provide URLs for images to be used across the site. You can use images from the public folder or external links.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {imageKeys.map((item) => {
          const existing = images.find(img => img.key === item.key);
          return (
            <Card key={item.key}>
              <CardHeader>
                <CardTitle className="text-lg">{item.label}</CardTitle>
                <code className="text-xs text-gray-400 font-mono">{item.key}</code>
              </CardHeader>
              <CardContent>
                <form
                  action={async (formData) => {
                    'use server';
                    const url = formData.get('url') as string;
                    const alt = formData.get('alt') as string;
                    await updateSiteImage(item.key, url, alt);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium">Image URL</label>
                    <input
                      name="url"
                      defaultValue={existing?.url || ''}
                      placeholder="/images/hero.jpg"
                      className="w-full p-2 border rounded mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Alt Text</label>
                    <input
                      name="alt"
                      defaultValue={existing?.alt || ''}
                      placeholder="Description for accessibility"
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                  <Button type="submit">Update Image</Button>
                </form>

                {existing?.url && (
                  <div className="mt-4 aspect-video relative bg-gray-100 rounded-lg overflow-hidden border">
                    <img src={existing.url} alt={existing.alt || ''} className="object-cover w-full h-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
