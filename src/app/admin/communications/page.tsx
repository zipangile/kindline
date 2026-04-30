export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sendManualEmail, deleteCommunication, sendVolunteerInvite } from './actions';
import { Send, History, Trash2, User, Mail, Calendar, UserPlus } from 'lucide-react';
import { checkAdmin } from '@/lib/auth-utils';
import { ConfirmButton } from '@/components/ConfirmButton';
import { Communication } from '@prisma/client';

export default async function AdminCommunicationsPage() {
  await checkAdmin('CONTENT_EDITOR');

  let history: Communication[] = [];
  try {
    history = await prisma.communication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (error) {
    console.error('[AdminCommunicationsPage] Error fetching history:', error);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            {/* Compose Form */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-brand-blue" /> Compose Email
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={sendManualEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">To</label>
                        <input name="recipient" required type="email" className="w-full p-2 border rounded mt-1" placeholder="recipient@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Subject</label>
                        <input name="subject" required className="w-full p-2 border rounded mt-1" placeholder="Kindline Care Update" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Message (HTML supported)</label>
                        <textarea name="content" required className="w-full p-2 border rounded mt-1 h-32" placeholder="Hello..." />
                    </div>
                    <Button type="submit" className="w-full">Send Email</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Volunteer Invite Form */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-green-600" /> Invite Volunteer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={sendVolunteerInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Recipient Email</label>
                            <input name="recipient" required type="email" className="w-full p-2 border rounded mt-1" placeholder="potential-volunteer@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Personal Message (Optional)</label>
                            <textarea name="message" className="w-full p-2 border rounded mt-1 h-24" placeholder="We'd love to have you on the team..." />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Send Invitation</Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* Sent History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5" /> Sent History
          </h2>

          {history.map((comm) => (
            <Card key={comm.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-md">{comm.subject}</CardTitle>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User size={12} /> To: {comm.recipient}</span>
                      <span className="flex items-center gap-1"><Mail size={12} /> By: {comm.sentBy || 'System'}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(comm.createdAt).toLocaleString()}</span>
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[10px] ${
                        comm.type === 'reply' ? 'bg-blue-100 text-blue-700' :
                        comm.type === 'system' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {comm.type}
                      </span>
                    </div>
                  </div>
                  <form action={deleteCommunication.bind(null, comm.id)}>
                    <ConfirmButton
                        type="submit"
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Record"
                        confirmMessage="Delete this communication record?"
                    >
                        <Trash2 size={16} />
                    </ConfirmButton>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <details>
                  <summary className="text-sm text-brand-blue cursor-pointer hover:underline">View content</summary>
                  <div className="mt-2 text-sm text-gray-600 border-l-2 border-gray-100 pl-4 py-2 bg-gray-50 rounded whitespace-pre-wrap">
                    {comm.content}
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}

          {history.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 italic">No communication history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
