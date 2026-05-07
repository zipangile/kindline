import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserRole, PermissionLevel } from '@/lib/auth-utils';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Heart,
  BarChart3,
  Image as ImageIcon,
  Mail,
  Inbox,
  Send,
  Newspaper,
  ShieldCheck,
  Settings,
  ExternalLink
} from 'lucide-react';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[] | undefined>>;
}) {
  await params;
  const role = await getUserRole();

  if (role === 'USER') {
    redirect('/');
  }

  const hasAccess = (required: PermissionLevel[]) => required.includes(role);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#1e293b] text-white flex-shrink-0 flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Kindline Admin
          </h1>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          <SidebarContent hasAccess={hasAccess} />
        </nav>
      </aside>

      {/* Sidebar Mobile */}
      <div id="application-sidebar" className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 transition-all duration-300 transform h-full max-w-xs w-full z-[60] bg-[#1e293b] border-e border-gray-700 lg:hidden hidden">
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Kindline Admin
          </h1>
          <button type="button" className="text-gray-400 hover:text-white" data-hs-overlay="#application-sidebar">
            <span className="sr-only">Close sidebar</span>
            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          <SidebarContent hasAccess={hasAccess} />
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[40] w-full bg-white border-b border-gray-200 text-sm py-2.5 sm:py-4">
          <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6" aria-label="Global">
            <div className="me-5">
              <Link href="/admin" className="flex-none text-xl font-semibold text-brand-blue" aria-label="Kindline Care">Kindline Admin</Link>
            </div>

            <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
              <div className="flex flex-row items-center justify-end gap-2">
                <button type="button" className="p-2.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
                  <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ hasAccess }: { hasAccess: (required: PermissionLevel[]) => boolean }) {
  return (
    <div className="flex flex-col h-full">
      <Link href="/admin" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
        <LayoutDashboard size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Overview</span>
      </Link>

      <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Management
      </div>

      {hasAccess(['SUPER_ADMIN', 'CONTENT_EDITOR']) && (
        <Link href="/admin/programmes" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
          <Briefcase size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Programmes</span>
        </Link>
      )}

      {hasAccess(['SUPER_ADMIN', 'VOLUNTEER_COORD']) && (
        <Link href="/admin/volunteers" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
          <Users size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Partners</span>
        </Link>
      )}

      {hasAccess(['SUPER_ADMIN', 'FINANCIAL_ADMIN']) && (
        <Link href="/admin/donors" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
          <Heart size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Donors (Friends)</span>
        </Link>
      )}

      <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Content
      </div>

      {hasAccess(['SUPER_ADMIN', 'CONTENT_EDITOR']) && (
        <>
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
        </>
      )}

      {hasAccess(['SUPER_ADMIN', 'CONTENT_EDITOR', 'FINANCIAL_ADMIN']) && (
        <>
          <Link href="/admin/inbox" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Inbox size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Inbox</span>
          </Link>

          <Link href="/admin/communications" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Send size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Communications</span>
          </Link>

          <Link href="/admin/newsletter" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
            <Mail size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Newsletter</span>
          </Link>
        </>
      )}

      <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        System
      </div>

      {hasAccess(['SUPER_ADMIN']) && (
        <Link href="/admin/admins" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
          <ShieldCheck size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Permissions</span>
        </Link>
      )}

      {hasAccess(['SUPER_ADMIN', 'FINANCIAL_ADMIN']) && (
        <Link href="/admin/settings" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-300 hover:text-white group">
          <Settings size={20} className="text-gray-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Settings</span>
        </Link>
      )}

      <div className="mt-auto py-4 border-t border-gray-700/50">
        <Link href="/" className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-all text-gray-400 hover:text-white group">
          <ExternalLink size={18} />
          <span className="text-sm font-medium">View Website</span>
        </Link>
      </div>
    </div>
  );
}
