export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  let stats = {
    programCount: 0,
    activeCount: 0,
    donorCount: 0,
    volunteerCount: 0,
  };

  try {
    const [programCount, activeCount, donorCount, volunteerCount] = await Promise.all([
      prisma.program.count(),
      prisma.program.count({ where: { status: 'live' } }),
      prisma.donation.count({ where: { status: 'successful' } }),
      prisma.volunteer.count({ where: { status: 'pending' } }),
    ]);
    stats = { programCount, activeCount, donorCount, volunteerCount };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Programmes</p>
          <p className="text-3xl font-bold text-blue-800 mt-2">{stats.programCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Programmes</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Friends (Donors)</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.donorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Volunteers</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.volunteerCount}</p>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Link href="/admin/programmes" className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Manage Programmes
          </Link>
          <Link href="/admin/donors" className="flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors">
            View Transactions
          </Link>
          <Link href="/admin/volunteers" className="flex items-center justify-center bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 font-medium transition-colors">
            Manage Volunteers
          </Link>
          <Link href="/admin/impact" className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors">
            Impact & Stats
          </Link>
          <Link href="/admin/images" className="flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
            Manage Images
          </Link>
          <Link href="/admin/newsletter" className="flex items-center justify-center bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 font-medium transition-colors">
            Newsletter
          </Link>
          <Link href="/admin/settings" className="flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
