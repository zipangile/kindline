import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export const dynamic = "force-dynamic";

export default async function NewsPostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  await searchParams;

  console.log(`[NewsPostDetailPage] Fetching post with slug: ${slug}`);

  const post = await prisma.newsPost.findFirst({
    where: {
      slug: {
        equals: slug,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mode: 'insensitive'
      }
    },
  });

  if (!post) {
    console.log(`[NewsPostDetailPage] Post not found for slug: ${slug}`);
    notFound();
  }

  if (!post.published && process.env.NODE_ENV === 'production') {
    console.log(`[NewsPostDetailPage] Post not published: ${slug}`);
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Button variant="ghost" className="mb-8" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
        </Button>

        <header className="mb-12">
          <div className="flex items-center text-blue-600 font-bold uppercase tracking-wide mb-4 text-sm">
            <span>{post?.category}</span>
            <span className="mx-3 text-gray-300">•</span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post?.title}
          </h1>
        </header>

        {post?.image && (
          <div className="mb-12 aspect-video relative rounded-3xl overflow-hidden shadow-lg border">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-blue">
          {post?.content.split('\n').map((para, i) => (
            <p key={i} className="mb-6 text-gray-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
