import prisma from '@/lib/prisma';
import ImageManager from './ImageManager';

export const dynamic = "force-dynamic";

export default async function AdminImagesPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const images = await prisma.siteImage.findMany();

  return <ImageManager initialImages={images} />;
}
