export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Briefcase,
  Heart,
  Users,
  Clock,
  BarChart3,
  Image as ImageIcon,
  Mail,
  Newspaper,
  Settings,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening with Kindline Care.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Programmes</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.programCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-[#f3e8ff] p-3 rounded-xl text-[#8B438E]">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Successful Gifts</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.donorCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Appls</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.volunteerCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Quick Management</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/programmes" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Programmes</p>
                  <p className="text-xs text-gray-500">Edit core initiatives</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </Link>

            <Link href="/admin/volunteers" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Partner with Us</p>
                  <p className="text-xs text-gray-500">Review applications</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
            </Link>

            <Link href="/admin/news" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600">
                  <Newspaper size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">News & Blog</p>
                  <p className="text-xs text-gray-500">Write updates</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
            </Link>

            <Link href="/admin/newsletter" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-2.5 rounded-lg text-pink-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Newsletter</p>
                  <p className="text-xs text-gray-500">Send donor updates</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
            </Link>

            <Link href="/admin/impact" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Impact Stats</p>
                  <p className="text-xs text-gray-500">Update testimonials</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-green-500 transition-colors" />
            </Link>
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-2xl shadow-sm text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-green-400" />
            Rapid Actions
          </h2>
          <p className="text-gray-400 text-sm mb-6">Common tasks you might need to do quickly.</p>

          <div className="space-y-3">
            <Link href="/admin/programmes" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              New Programme
            </Link>
            <Link href="/admin/donors" className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Verify Transaction
            </Link>
            <Link href="/admin/images" className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Update Hero Image
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700">
             <Link href="/admin/settings" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={18} />
                <span>System Settings</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
