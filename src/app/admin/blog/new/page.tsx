export const dynamic = "force-dynamic";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { checkAdmin } from '@/lib/auth-utils';
import { getOrganization, hasFeature } from '@/lib/features';
import { createPost } from '../actions';
import { ChevronLeft, Star } from 'lucide-react';

export default async function AdminNewBlogPage() {
  await checkAdmin('CONTENT_EDITOR');

  const org = await getOrganization();
  const featuredEnabled = hasFeature(org, "BLOG_FEATURED_PLACEMENT");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-sm text-gray-500">Publish a new article, project update, or impact story.</p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <form action={createPost} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Kindline Care launches new Chibombo project"
                className="block w-full rounded-xl border border-gray-200 p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="type" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Post Type</label>
                <select
                  id="type"
                  name="type"
                  defaultValue="STANDARD"
                  className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                >
                  <option value="STANDARD">Standard Blog / News Update</option>
                  <option value="IMPACT_STORY">Impact Story</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="published" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Publish Status</label>
                <select
                  id="published"
                  name="published"
                  defaultValue="false"
                  className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                >
                  <option value="false">Save as Draft</option>
                  <option value="true">Publish Immediately</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
              <div className="pt-0.5">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  value="true"
                  disabled={!featuredEnabled}
                  className="w-5 h-5 text-brand-blue border-gray-300 rounded focus:ring-brand-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-0.5">
                <label htmlFor="featured" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Feature this Post on Homepage
                  {!featuredEnabled && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Star size={10} className="fill-current" /> PRO Feature
                    </span>
                  )}
                </label>
                <p className="text-xs text-gray-500">
                  {featuredEnabled
                    ? "Pinned posts are showcased at the top of the homepage and public feeds."
                    : "Upgrade your subscription to the PRO Plan to display featured posts pinned to the homepage."
                  }
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="body" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Content / Body</label>
              <textarea
                id="body"
                name="body"
                required
                rows={12}
                placeholder="Write your story or update here... Markdown or HTML tags can be used."
                className="block w-full rounded-xl border border-gray-200 p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link href="/admin/blog">
                <Button variant="outline" className="border-gray-200 text-gray-700 rounded-xl px-6 h-12">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/95 font-bold rounded-xl px-8 h-12 text-white">
                Create Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
