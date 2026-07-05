'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { isValidEmail, SECURITY_LIMITS, isValidId } from '@/lib/security';

export type AdminRole = 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'FINANCIAL_ADMIN' | 'VOLUNTEER_COORD';

// Helper to get Supabase Admin client
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Metadata sync will fail.');
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

async function syncUserRole(email: string, role: AdminRole | null) {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return;

  // 1. Find user by email
  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    console.log(`User with email ${email} not found in Supabase Auth yet.`);
    return;
  }

  // 2. Update app_metadata
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    user.id,
    { app_metadata: { role: role || 'USER' } }
  );

  if (updateError) {
    console.error('Error updating user metadata:', updateError);
  }
}

export async function addAdmin(email: string, name: string, role: AdminRole) {
  await checkAdmin('SUPER_ADMIN');

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  // Security: Input validation and length limits
  if (!trimmedEmail || !isValidEmail(trimmedEmail) || trimmedEmail.length > SECURITY_LIMITS.EMAIL) {
    throw new Error('Invalid email address');
  }

  if (trimmedName.length > SECURITY_LIMITS.NAME) {
    throw new Error('Name is too long');
  }

  const admin = await prisma.managedAdmin.upsert({
    where: { email: trimmedEmail },
    update: { name: trimmedName, role },
    create: { email: trimmedEmail, name: trimmedName, role },
  });

  await syncUserRole(trimmedEmail, role);

  revalidatePath('/admin/admins');
  return admin;
}

export async function updateAdminRole(id: string, role: AdminRole) {
  await checkAdmin('SUPER_ADMIN');

  if (!id || id.length > SECURITY_LIMITS.ID || !isValidId(id)) {
    throw new Error('Invalid admin ID');
  }

  const admin = await prisma.managedAdmin.update({
    where: { id },
    data: { role },
  });

  await syncUserRole(admin.email, role);

  revalidatePath('/admin/admins');
  return admin;
}

export async function removeAdmin(id: string) {
  await checkAdmin('SUPER_ADMIN');

  if (!id || id.length > SECURITY_LIMITS.ID || !isValidId(id)) {
    throw new Error('Invalid admin ID');
  }

  const admin = await prisma.managedAdmin.delete({
    where: { id },
  });

  await syncUserRole(admin.email, null);

  revalidatePath('/admin/admins');
}
