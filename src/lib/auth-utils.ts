'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import prisma from './prisma';

export type PermissionLevel = 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'FINANCIAL_ADMIN' | 'VOLUNTEER_COORD' | 'USER';

export async function checkAdmin(requiredLevel: PermissionLevel = 'CONTENT_EDITOR') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';
  const userRole = user.app_metadata?.role as PermissionLevel || 'USER';

  // Super admin and hardcoded admin always have full access
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || user.email === adminEmail;

  if (isSuperAdmin) return user;

  // Level-based checks
  const permissions = {
    'SUPER_ADMIN': ['SUPER_ADMIN'],
    'CONTENT_EDITOR': ['SUPER_ADMIN', 'CONTENT_EDITOR'],
    'FINANCIAL_ADMIN': ['SUPER_ADMIN', 'FINANCIAL_ADMIN'],
    'VOLUNTEER_COORD': ['SUPER_ADMIN', 'VOLUNTEER_COORD'],
    'USER': ['SUPER_ADMIN', 'CONTENT_EDITOR', 'FINANCIAL_ADMIN', 'VOLUNTEER_COORD', 'USER']
  };

  const hasPermission = permissions[requiredLevel].includes(userRole);

  if (!hasPermission) {
    // If they have any admin role, send to admin dashboard but maybe with limited view
    // For now, if they don't have the specific permission, redirect to overview
    if (userRole !== 'USER') {
        // Allow them to stay in admin if they have any admin role, but this function is usually called in specific pages
        // So we redirect them to the main admin page
        redirect('/admin');
    }
    redirect('/');
  }

  return user;
}

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'USER';

  const adminEmail = process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';
  if (user.email === adminEmail) return 'SUPER_ADMIN';

  return user.app_metadata?.role as PermissionLevel || 'USER';
}
