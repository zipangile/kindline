import prisma from '@/lib/prisma';
import AdminManagement from './AdminManagement';
import { checkAdmin } from '@/lib/auth-utils';
import { ManagedAdmin } from '@prisma/client';

export const dynamic = "force-dynamic";

export default async function AdminsPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  await checkAdmin('SUPER_ADMIN');

  let admins: ManagedAdmin[] = [];
  try {
    admins = await prisma.managedAdmin.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[AdminsPage] Error fetching admins:', error);
    throw error;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Permissions</h1>
        <p className="text-gray-500">Manage dashboard access and permission levels for your team.</p>
      </div>
      <AdminManagement initialAdmins={admins} />
    </div>
  );
}
