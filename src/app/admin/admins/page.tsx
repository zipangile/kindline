import prisma from '@/lib/prisma';
import AdminManagement from './AdminManagement';
import { checkAdmin } from '@/lib/auth-utils';

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  await checkAdmin();
  const admins = await prisma.managedAdmin.findMany({
    orderBy: { createdAt: 'desc' },
  });

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
