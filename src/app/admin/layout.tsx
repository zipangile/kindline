import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Heart,
  BarChart3,
  Image as ImageIcon,
  Mail,
  Newspaper,
  Settings,
  ExternalLink
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';
  const isAdmin = user.app_metadata?.role === 'admin' || user.email === adminEmail;

  // Only allow admins
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Kindline Admin
          </h1>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <LayoutDashboard size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Overview</span>
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </div>

          <Link href="/admin/programmes" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Briefcase size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Programmes</span>
          </Link>

          <Link href="/admin/volunteers" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Users size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Partner with Us</span>
          </Link>

          <Link href="/admin/donors" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Heart size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Donors (Friends)</span>
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content
          </div>

          <Link href="/admin/impact" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <BarChart3 size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Impact & Stories</span>
          </Link>

          <Link href="/admin/images" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <ImageIcon size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Site Images</span>
          </Link>

          <Link href="/admin/news" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Newspaper size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">News & Blog</span>
          </Link>

          <Link href="/admin/newsletter" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Mail size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Newsletter</span>
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </div>

          <Link href="/admin/settings" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Settings size={20} className="text-gray-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <Link href="/" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-400 hover:text-white group">
            <ExternalLink size={18} />
            <span className="text-sm font-medium">View Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
