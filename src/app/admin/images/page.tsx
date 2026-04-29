import prisma from '@/lib/prisma';
import ImageManager from './ImageManager';
import { checkAdmin } from '@/lib/auth-utils';
import { SiteImage } from '@prisma/client';

export const dynamic = "force-dynamic";

export default async function AdminImagesPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  await checkAdmin('CONTENT_EDITOR');

  let images: SiteImage[] = [];
  try {
    images = await prisma.siteImage.findMany();
  } catch (error) {
    console.error('[AdminImagesPage] Error fetching site images:', error);
  }

  return <ImageManager initialImages={images} />;
}
