export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { updateVolunteerStatus, deleteVolunteer } from './actions';
import { Prisma } from '@prisma/client';
import { checkAdmin } from '@/lib/auth-utils';

export default async function AdminVolunteersPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<{ search?: string; skill?: string }>;
}) {
  await params;
  const p = await searchParams;
  await checkAdmin('VOLUNTEER_COORD');

  const search = p.search || '';
  const skill = p.skill || '';

  const where: Prisma.VolunteerWhereInput = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      } : {},
      skill ? {
        skills: { contains: skill },
      } : {},
    ],
  };

  let volunteers: Awaited<ReturnType<typeof prisma.volunteer.findMany>> = [];
  try {
    volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[AdminVolunteersPage] Error fetching volunteers:', error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Volunteers</h1>

        <form className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              aria-label="Search volunteers by name or email"
              defaultValue={search}
              placeholder="Search by name or email..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          <div className="w-full md:w-48">
            <input
              type="text"
              name="skill"
              aria-label="Filter volunteers by skill"
              defaultValue={skill}
              placeholder="Filter by skill..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-orange transition-colors"
          >
            Filter
          </button>
          {(search || skill) && (
            <a
              href="/admin/volunteers"
              className="text-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-scroll" role="region" aria-label="Volunteer applications table" tabIndex={0}>
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills & Interests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {volunteers.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{v.name}</div>
                  <div className="text-sm text-gray-500">{v.email}</div>
                  {v.phone && <div className="text-xs text-gray-600">{v.phone}</div>}
                  <div className="text-xs text-gray-600 mt-1">{v.location || 'No location'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 capitalize"><span className="font-medium">Availability:</span> {v.availability || 'N/A'}</div>
                  <div className="text-sm text-gray-500"><span className="font-medium">Exp:</span> {v.experience || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">Skills: <span className="font-normal text-gray-600">{v.skills || 'N/A'}</span></div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{v.interests}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    v.status === 'approved' ? 'bg-green-100 text-green-800' :
                    v.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <form action={updateVolunteerStatus.bind(null, v.id, 'approved')} className="inline">
                    <button type="submit" className="text-green-600 hover:text-green-900">Approve</button>
                  </form>
                  <form action={updateVolunteerStatus.bind(null, v.id, 'rejected')} className="inline">
                    <button type="submit" className="text-orange-600 hover:text-orange-900">Reject</button>
                  </form>
                  <form action={deleteVolunteer.bind(null, v.id)} className="inline">
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {volunteers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No volunteer applications yet.</td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
