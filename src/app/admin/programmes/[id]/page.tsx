import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateProgram } from '../actions';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id },
  });

  if (!program) {
    notFound();
  }

  const updateProgramWithId = updateProgram.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Programme</h1>
        <Link href="/admin/programmes" className="text-blue-600 hover:underline">Back to List</Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form action={updateProgramWithId} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={program.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                defaultValue={program.category}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              >
                <option value="Economic Empowerment">Economic Empowerment</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Sustainable Impact">Sustainable Impact</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={program.description}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            ></textarea>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center">
                <input
                    name="status"
                    type="radio"
                    value="live"
                    defaultChecked={program.status === 'live'}
                    className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 block text-sm text-gray-700">Live</label>
             </div>
             <div className="flex items-center">
                <input
                    name="status"
                    type="radio"
                    value="archived"
                    defaultChecked={program.status === 'archived'}
                    className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 block text-sm text-gray-700">Archived</label>
             </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold">
                Update Programme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
