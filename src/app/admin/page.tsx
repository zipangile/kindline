export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const [programCount, activeCount, donorCount, volunteerCount] = await Promise.all([
    prisma.program.count(),
    prisma.program.count({ where: { status: 'live' } }),
    prisma.donation.count({ where: { status: 'successful' } }),
    prisma.volunteer.count({ where: { status: 'pending' } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Programmes</p>
          <p className="text-3xl font-bold text-blue-800 mt-2">{programCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Programmes</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Friends (Donors)</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{donorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Volunteers</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{volunteerCount}</p>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/programmes" className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Manage Programmes
          </Link>
          <Link href="/admin/donors" className="flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors">
            View Transactions
          </Link>
          <Link href="/admin/volunteers" className="flex items-center justify-center bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 font-medium transition-colors">
            Manage Volunteers
          </Link>
          <Link href="/admin/settings" className="flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors">
            Payment Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
