import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function DashboardRedirect() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Admin check
  if (orgId === 'org_3CqSUazt0GzaFAeoS5YngAZcro8') {
    redirect('/admin');
  }

  // Check if user is a volunteer
  const volunteer = await prisma.volunteer.findUnique({
    where: { clerkUserId: userId },
  });

  if (volunteer) {
    redirect('/dashboard/volunteer');
  }

  // Check if user is a donor
  const donation = await prisma.donation.findFirst({
    where: { clerkUserId: userId },
  });

  if (donation) {
    redirect('/dashboard/friend');
  }

  // Default redirect if no specific role found
  redirect('/get-involved');
}
