import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardRedirect(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userId = user.id;
  const adminEmail = process.env.ADMIN_EMAIL || 'info@kindlinecare.org';
  const isAdmin = user.app_metadata?.role === 'admin' || user.email === adminEmail;

  // Admin check
  if (isAdmin) {
    redirect('/admin');
  }

  let volunteer = null;
  let donation = null;
  let dbError = false;

  try {
    // Check if user is a volunteer
    volunteer = await prisma.volunteer.findUnique({
      where: { supabaseUserId: userId },
    });

    if (!volunteer) {
      // Check if user is a donor
      donation = await prisma.donation.findFirst({
        where: { supabaseUserId: userId },
      });
    }
  } catch (error) {
    console.error('Database error in dashboard redirect:', error);
    dbError = true;
  }

  // Handle role-based redirection outside try-catch
  if (dbError) {
    redirect('/volunteer');
  }

  if (volunteer) {
    redirect('/dashboard/volunteer');
  }

  if (donation) {
    redirect('/dashboard/friend');
  }

  // Default redirect if no specific role found
  redirect('/volunteer');
}
