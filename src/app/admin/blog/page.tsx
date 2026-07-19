export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { checkAdmin } from '@/lib/auth-utils';
import { getOrganization, hasFeature } from '@/lib/features';
import { FileText, Plus, Edit, Trash2, Globe, Star } from 'lucide-react';
import { deletePost } from './actions';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function AdminBlogPage() {
  await checkAdmin('CONTENT_EDITOR');

  const org = await getOrganization();
  const blogEnabled = hasFeature(org, "BLOG");

  if (!blogEnabled) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Card className="border border-amber-200 shadow-xl bg-white rounded-3xl p-10 space-y-6">
          <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-900">Upgrade to Unlock Blog & CMS Features</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Creating news articles, project updates, and impact stories is a premium feature available on <strong>GROWTH</strong> and <strong>PRO</strong> plans.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <Button className="bg-brand-blue text-white font-bold px-8 h-12 rounded-xl shadow">
              Upgrade Subscription
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog & Story CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage articles, news posts, and impact stories.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2">
            <Plus size={18} /> New Post
          </Button>
        </Link>
      </div>

      <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50 p-6">
          <CardTitle className="text-lg font-bold text-gray-900">All Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {post.title}
                        <div className="text-xs font-normal text-gray-400 font-mono mt-0.5">/{post.slug}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          post.type === 'IMPACT_STORY' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {post.type === 'IMPACT_STORY' ? 'Impact Story' : 'Standard Blog'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {post.featured ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                            <Star size={12} className="fill-current" /> Featured
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {post.publishedAt ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-700">
                            <Globe size={12} /> Published
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-gray-100 text-gray-700">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link href={`/admin/blog/edit/${post.id}`} className="inline-block">
                          <Button variant="outline" className="p-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <form action={deletePost.bind(null, post.id)} className="inline-block">
                          <ConfirmButton
                            type="submit"
                            title="Delete Post"
                            confirmMessage="Are you sure you want to permanently delete this post?"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent"
                          >
                            <Trash2 size={16} />
                          </ConfirmButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center text-gray-400 font-medium">
                      No posts found. Get started by creating your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
