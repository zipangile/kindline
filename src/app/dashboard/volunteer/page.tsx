export const dynamic = "force-dynamic";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function VolunteerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userId = user.id;

  let volunteer;
  try {
    volunteer = await prisma.volunteer.findUnique({
      where: { supabaseUserId: userId },
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Database error in volunteer dashboard:', error);
    redirect('/volunteer');
  }

  if (!volunteer) {
    redirect('/volunteer');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-900 px-8 py-12 text-white">
          <h1 className="text-3xl font-bold mb-2">Volunteer Dashboard</h1>
          <p className="text-blue-100">Welcome back, {volunteer.name}!</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status</h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    volunteer.status === 'approved' ? 'bg-green-100 text-green-700' :
                    volunteer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {volunteer.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  {volunteer.status === 'pending' && "Your application is currently being reviewed by our team. We'll be in touch soon!"}
                  {volunteer.status === 'approved' && "Congratulations! Your application has been approved. Welcome to the Kindline Care family."}
                  {volunteer.status === 'rejected' && "Thank you for your interest. Unfortunately, we cannot move forward with your application at this time."}
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Submitted Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{volunteer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{volunteer.phone || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500">Skills</p>
                      <p className="font-medium">{volunteer.skills || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resources</h2>
              <div className="space-y-4">
                <Link href="/about" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-bold text-blue-800">Volunteer Handbook</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn about our guidelines and expectations.</p>
                </Link>
                <Link href="/programmes" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-bold text-blue-800">Explore Programmes</h3>
                  <p className="text-sm text-gray-500 mt-1">See where you can make the most impact.</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
