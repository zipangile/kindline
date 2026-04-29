import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProgramForm from '../ProgramForm';

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await searchParams;
  const program = await prisma.program.findUnique({
    where: { id },
  });

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Programme</h1>
        <Link href="/admin/programmes" className="text-blue-600 hover:underline">Back to List</Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ProgramForm program={program} />
      </div>
    </div>
  );
}
