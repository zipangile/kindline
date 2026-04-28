import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { deleteNewsPost } from './actions';

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage News & Updates</h1>
          <p className="text-gray-500">Create and manage blog posts and announcements.</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/new" className="flex items-center gap-2">
            <Plus size={18} /> New Post
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Post</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No posts found. Create your first one!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.image ? (
                        <img src={post.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <Calendar size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{post.title}</p>
                        <p className="text-xs text-gray-500 font-mono">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/news/edit/${post.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <form action={async () => {
                        'use server';
                        await deleteNewsPost(post.id);
                      }}>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
