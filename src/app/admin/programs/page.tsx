import prisma from '@/lib/prisma';
import { createProgram, updateProgramStatus, deleteProgram } from './actions';
import { Program } from '@prisma/client';

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Programs</h1>
      </div>

      {/* Add Program Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Add New Program</h2>
        <form action={createProgram} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input name="title" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                <option value="Economic Empowerment">Economic Empowerment</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Sustainable Impact">Sustainable Impact</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center">
                <input name="status" type="radio" value="live" defaultChecked className="h-4 w-4 text-blue-600" />
                <label className="ml-2 block text-sm text-gray-700">Live</label>
             </div>
             <div className="flex items-center">
                <input name="status" type="radio" value="archived" className="h-4 w-4 text-blue-600" />
                <label className="ml-2 block text-sm text-gray-700">Archived</label>
             </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Program</button>
        </form>
      </div>

      {/* Program List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programs.map((program: Program) => (
              <tr key={program.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{program.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{program.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{program.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    program.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <form action={updateProgramStatus.bind(null, program.id, program.status === 'live' ? 'archived' : 'live')} className="inline">
                    <button type="submit" className="text-blue-600 hover:text-blue-900">
                      {program.status === 'live' ? 'Archive' : 'Make Live'}
                    </button>
                  </form>
                  <form action={deleteProgram.bind(null, program.id)} className="inline">
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
