export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPostDetailPage(props: PageProps) {
  await props.searchParams;
  const resolvedParams = await props.params;
  const slug = (resolvedParams?.slug as string || '').trim();

  if (!slug) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.publishedAt) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-gray-600 flex items-center gap-2 hover:bg-gray-50 rounded-xl px-4 py-2 text-sm font-semibold">
              <ChevronLeft size={16} /> Back to Blog
            </Button>
          </Link>
        </div>

        {/* Post Meta */}
        <div className="flex items-center text-xs text-blue-600 font-bold uppercase tracking-wider mb-4 gap-2">
          <span className="bg-blue-50 border border-blue-200 px-2 py-1 rounded">
            {post.type === 'IMPACT_STORY' ? 'Impact Story' : 'Article'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
          </span>
        </div>

        {/* Post Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
          {post.title}
        </h1>

        {/* Post Body */}
        <article className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-lg font-medium whitespace-pre-line">
          {post.body}
        </article>
      </div>
    </div>
  );
}
