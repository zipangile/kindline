'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type PermissionLevel = 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'FINANCIAL_ADMIN' | 'VOLUNTEER_COORD' | 'USER';

export async function checkAdmin(requiredLevel: PermissionLevel = 'CONTENT_EDITOR') {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('[checkAdmin] Auth error:', authError);
  }

  if (!user) {
    console.warn('[checkAdmin] No user found, redirecting to login');
    redirect('/login');
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const userRole = user.app_metadata?.role as PermissionLevel || 'USER';

  // Super admin and hardcoded admin always have full access
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || (!!adminEmail && user.email === adminEmail);

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
    console.warn(`[checkAdmin] User ${user.email} with role ${userRole} does not have required permission: ${requiredLevel}`);
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

export async function getUserEmail() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email || null;
}

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('[getUserRole] Auth error:', authError);
  }

  if (!user) return 'USER';

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email === adminEmail) return 'SUPER_ADMIN';

  const role = user.app_metadata?.role as PermissionLevel || 'USER';
  return role;
}
