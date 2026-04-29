'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { addAdmin, updateAdminRole, removeAdmin, AdminRole } from './actions';
import { ManagedAdmin } from '@prisma/client';
import { Trash2, UserPlus, Loader2 } from 'lucide-react';

export default function AdminManagement({ initialAdmins }: { initialAdmins: ManagedAdmin[] }) {
  const [admins, setAdmins] = useState<ManagedAdmin[]>(initialAdmins);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('add');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as AdminRole;

    try {
      const newAdmin = await addAdmin(email, name, role);
      setAdmins([...admins, newAdmin]);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert('Failed to add admin');
    } finally {
      setLoading(null);
    }
  };

  const handleRoleUpdate = async (id: string, role: AdminRole) => {
    setLoading(id);
    try {
      await updateAdminRole(id, role);
      setAdmins(admins.map(a => a.id === id ? { ...a, role } : a));
    } catch (error) {
      console.error(error);
      alert('Failed to update role');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    setLoading(id);
    try {
      await removeAdmin(id);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to remove admin');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <UserPlus size={20} className="text-blue-600" />
          Add New Admin
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="name" placeholder="Full Name" required className="p-3 border rounded-xl" />
          <input name="email" type="email" placeholder="Email Address" required className="p-3 border rounded-xl" />
          <select name="role" className="p-3 border rounded-xl">
            <option value="CONTENT_EDITOR">Content Editor</option>
            <option value="FINANCIAL_ADMIN">Financial Admin</option>
            <option value="VOLUNTEER_COORD">Volunteer Coordinator</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <Button type="submit" disabled={loading === 'add'}>
            {loading === 'add' ? <Loader2 className="animate-spin" size={18} /> : 'Add Admin'}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-900">{admin.name}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={admin.role}
                    onChange={(e) => handleRoleUpdate(admin.id, e.target.value as AdminRole)}
                    disabled={loading === admin.id}
                    className="p-2 border rounded-lg text-sm font-medium"
                  >
                    <option value="CONTENT_EDITOR">Content Editor</option>
                    <option value="FINANCIAL_ADMIN">Financial Admin</option>
                    <option value="VOLUNTEER_COORD">Volunteer Coordinator</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(admin.id)}
                    disabled={loading === admin.id}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
