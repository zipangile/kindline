export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sendNewsletter, deleteSubscriber } from './actions';
import { Send, Users, Trash2 } from 'lucide-react';
import { checkAdmin } from '@/lib/auth-utils';
import { Subscriber } from '@prisma/client';
import { ConfirmButton } from '@/components/ConfirmButton';
import EmailContentField from '@/components/EmailContentField';

export default async function AdminNewsletterPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  await checkAdmin('CONTENT_EDITOR');

  let subscribers: Subscriber[] = [];
  try {
    subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('[AdminNewsletterPage] Error fetching subscribers:', error);
  }

  const activeCount = subscribers.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Total: {subscribers.length}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" /> Send New Update
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={sendNewsletter} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Subject</label>
                        <input name="subject" required className="w-full p-2 border rounded mt-1" placeholder="Latest from Kindline Care" />
                    </div>
                    <EmailContentField />
                    <Button type="submit" className="w-full">Send to {activeCount} Subscribers</Button>
                </form>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-scroll" role="region" aria-label="Subscribers table" tabIndex={0}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Joined</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4 font-medium">{sub.email}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <form action={deleteSubscriber.bind(null, sub.id)} className="inline">
                        <ConfirmButton
                          type="submit"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Subscriber"
                          confirmMessage="Are you sure you want to delete this subscriber?"
                        >
                          <Trash2 size={16} />
                        </ConfirmButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
