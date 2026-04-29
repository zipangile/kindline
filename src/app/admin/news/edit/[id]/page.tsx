import prisma from '@/lib/prisma';
import NewsForm from '../../NewsForm';
import { notFound } from 'next/navigation';

export default async function EditNewsPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await searchParams;
  const post = await prisma.newsPost.findUnique({
    where: { id },
  });

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
