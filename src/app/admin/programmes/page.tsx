export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { updateProgramStatus, deleteProgram } from './actions';
import { Program } from '@prisma/client';
import Link from 'next/link';
import AddProgramForm from './AddProgramForm';
import { Edit2, Trash2, Globe, Archive } from 'lucide-react';

export default async function AdminProgramsPage() {
  const programmes = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programmes Management</h1>
          <p className="text-gray-500 text-sm">Create and manage your organization&apos;s core initiatives.</p>
        </div>
      </div>

      <AddProgramForm />

      {/* Programme List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programmes.map((programme: Program) => (
              <tr key={programme.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{programme.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{programme.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{programme.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    programme.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {programme.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/programmes/${programme.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Programme"
                    >
                      <Edit2 size={18} />
                    </Link>

                    <form action={updateProgramStatus.bind(null, programme.id, programme.status === 'live' ? 'archived' : 'live')} className="inline">
                      <button
                        type="submit"
                        className={`p-2 rounded-lg transition-colors ${
                          programme.status === 'live' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={programme.status === 'live' ? 'Archive' : 'Make Live'}
                      >
                        {programme.status === 'live' ? <Archive size={18} /> : <Globe size={18} />}
                      </button>
                    </form>

                    <form action={deleteProgram.bind(null, programme.id)} className="inline">
                      <button
                        type="submit"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Programme"
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this programme?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
