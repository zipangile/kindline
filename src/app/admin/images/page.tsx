import prisma from '@/lib/prisma';
import ImageManager from './ImageManager';

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const images = await prisma.siteImage.findMany();

  return <ImageManager initialImages={images} />;
}
