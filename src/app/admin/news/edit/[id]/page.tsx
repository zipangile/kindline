import prisma from '@/lib/prisma';
import NewsForm from '../../NewsForm';
import { notFound } from 'next/navigation';
import { checkAdmin } from '@/lib/auth-utils';

export default async function EditNewsPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await searchParams;
  await checkAdmin('CONTENT_EDITOR');

  let post;
  try {
    post = await prisma.newsPost.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('[EditNewsPostPage] Error fetching post:', error);
    throw error;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-500">Updating: {post?.title}</p>
      </div>
      <NewsForm post={post} />
    </div>
  );
}
