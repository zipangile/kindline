export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { markMessageAsRead, deleteMessage, replyToMessage } from './actions';
import { Mail, MailOpen, Trash2, Reply, Clock } from 'lucide-react';
import { checkAdmin } from '@/lib/auth-utils';
import { ConfirmButton } from '@/components/ConfirmButton';
import { ContactMessage } from '@prisma/client';

export default async function AdminInboxPage() {
  await checkAdmin('CONTENT_EDITOR');

  let messages: ContactMessage[] = [];
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('[AdminInboxPage] Error fetching messages:', error);
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contact Inbox</h1>
        <div className="bg-brand-blue/10 text-brand-purple px-4 py-2 rounded-lg font-bold">
          {unreadCount} Unread Messages
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={`${msg.status === 'unread' ? 'border-l-4 border-l-brand-blue' : ''}`}>
            <CardHeader className="flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div>
                <CardTitle className="text-lg">{msg.name}</CardTitle>
                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                  <Mail size={14} /> {msg.email}
                  <Clock size={14} className="ml-2" /> {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                {msg.status === 'unread' && (
                  <form action={markMessageAsRead.bind(null, msg.id)}>
                    <Button variant="outline" size="sm" type="submit">
                      <MailOpen size={16} className="mr-2" /> Mark Read
                    </Button>
                  </form>
                )}
                <form action={deleteMessage.bind(null, msg.id)}>
                   <ConfirmButton
                    type="submit"
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    title="Delete Message"
                    confirmMessage="Are you sure you want to delete this message?"
                  >
                    <Trash2 size={16} />
                  </ConfirmButton>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                {msg.message}
              </p>

              <div className="mt-4">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-brand-blue font-medium hover:underline list-none">
                    <Reply size={16} /> {msg.status === 'replied' ? 'Sent another reply' : 'Reply to message'}
                  </summary>
                  <div className="mt-4 p-4 border rounded-lg bg-white shadow-inner">
                    <form action={replyToMessage.bind(null, msg.id)} className="space-y-4">
                      <input type="hidden" name="recipient" value={msg.email} />
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                          name="subject"
                          required
                          className="w-full p-2 border rounded"
                          defaultValue={`Re: Contact from Kindline Care - ${msg.name}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                          name="content"
                          required
                          className="w-full p-2 border rounded h-32"
                          placeholder="Write your response here..."
                        />
                      </div>
                      <Button type="submit" className="w-full">Send Reply</Button>
                    </form>
                  </div>
                </details>
                {msg.status === 'replied' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Replied
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
            <p className="text-gray-500">When people contact you through the website, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
