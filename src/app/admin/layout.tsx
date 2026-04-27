import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <Link href="/admin" className="block py-3 px-6 hover:bg-blue-800 transition-colors">
            Overview
          </Link>
          <Link href="/admin/programmes" className="block py-3 px-6 hover:bg-blue-800 transition-colors">
            Manage Programmes
          </Link>
          <Link href="/admin/volunteers" className="block py-3 px-6 hover:bg-blue-800 transition-colors">
            Volunteers
          </Link>
          <Link href="/admin/donors" className="block py-3 px-6 hover:bg-blue-800 transition-colors">
            Friends of Kindline
          </Link>
          <Link href="/admin/settings" className="block py-3 px-6 hover:bg-blue-800 transition-colors">
            Payment Settings
          </Link>
          <Link href="/" className="block py-3 px-6 mt-10 text-blue-300 hover:text-white transition-colors">
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
