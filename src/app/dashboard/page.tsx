import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function DashboardRedirect() {
  let userId: string | null = null;
  let orgId: string | null = null;
  let authError = false;

  try {
    const authData = await auth();
    userId = authData.userId ?? null;
    orgId = authData.orgId ?? null;
  } catch (error) {
    console.error('Error during Clerk authentication in dashboard redirect:', error);
    authError = true;
  }

  // Handle auth redirection outside try-catch to avoid catching NEXT_REDIRECT
  if (authError || !userId) {
    redirect('/sign-in');
  }

  // Admin check - Kindline Care Organisation ID
  if (orgId === 'org_3CqSUazt0GzaFAeoS5YngAZcro8') {
    redirect('/admin');
  }

  let volunteer = null;
  let donation = null;
  let dbError = false;

  try {
    // Check if user is a volunteer
    volunteer = await prisma.volunteer.findUnique({
      where: { clerkUserId: userId },
    });

    if (!volunteer) {
      // Check if user is a donor
      donation = await prisma.donation.findFirst({
        where: { clerkUserId: userId },
      });
    }
  } catch (error) {
    console.error('Database error in dashboard redirect:', error);
    dbError = true;
  }

  // Handle role-based redirection outside try-catch
  if (dbError) {
    redirect('/get-involved');
  }

  if (volunteer) {
    redirect('/dashboard/volunteer');
  }

  if (donation) {
    redirect('/dashboard/friend');
  }

  // Default redirect if no specific role found
  redirect('/get-involved');
}
